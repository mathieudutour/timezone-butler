const { send } = require('micro')
const querystring = require('querystring')
const slackRequest = require('./slack-request')
const messageParser = require('./timezones')
const secondsFormatter = require('./format-seconds')
const { addTeam } = require('./db')
const initialization = require('./init')
const serveHTML = require('./serve-html')

const token = process.env.SLACK_BOT_OAUTH_TOKEN

let teams = {}

initialization()
  .then(_teams => {
    teams = _teams
  })
  .then(() =>
    console.log(`initialized with ${Object.keys(teams).length} teams`)
  )
  .catch(console.error)

let lastFewSlackEventsHandled = []

// handle slack event
const handleSlackMessage = async (body, event) => {
  const times = messageParser(event.text)
  if (!times.length) {
    return 'no time to translate'
  }

  lastFewSlackEventsHandled.push(body.event_id)
  lastFewSlackEventsHandled = lastFewSlackEventsHandled.slice(0, 20)

  const posterTZ = teams[body.team_id][event.user]

  const usersInDiffTZ = Object.keys(teams[body.team_id]).filter(
    userId => userId !== event.user && teams[body.team_id][userId] !== posterTZ
  )

  return Promise.all(
    usersInDiffTZ.map(userId => {
      const userTZ = teams[body.team_id][userId]

      const text = times
        .map(({ match, time, timezoneModifier, timezoneModifierValue }) => {
          if (typeof timezoneModifier !== 'undefined') {
            if (timezoneModifierValue === userTZ) {
              return `${timezoneModifier} is your timezone.`
            }
            return `${match} is ${secondsFormatter(
              time + userTZ - timezoneModifierValue
            )} in your timezone.`
          }

          return `${match} is ${secondsFormatter(
            time + userTZ - posterTZ
          )} in your timezone.`
        })
        .join('\n')

      return slackRequest.post('chat.postEphemeral', token, {
        channel: event.channel,
        user: userId,
        text,
        thread_ts: event.thread_ts,
      })
    })
  )
}

const handleSlackUserChanged = async (body, event) => {
  teams[body.team_id][event.user.id] = parseFloat(event.user.tz_offset)
  return `updated ${event.user.id}`
}

const handleSlackEvent = (body, res) => {
  if (body.type === 'url_verification') {
    send(res, 200, body.challenge)
    return body.challenge
  }
  send(res, 200, 'All good')
  if (body.type !== 'event_callback' || !body.event) {
    return 'not sure how to handle that...'
  }

  if (lastFewSlackEventsHandled.indexOf(body.event_id) !== -1) {
    return 'already handled'
  }

  const { event } = body

  if (event.bot_id) {
    return 'ignore'
  }

  if (
    !teams[body.team_id] ||
    typeof teams[body.team_id][event.user] === 'undefined'
  ) {
    return 'not initialized yet'
  }

  if (event.type === 'message') {
    return handleSlackMessage(body, event)
  }

  if (event.type === 'user_change') {
    return handleSlackUserChanged(body, event)
  }

  return 'not sure what to do with that...'
}

module.exports = async (req, res) => {
  const [url, qs] = req.url.split('?')
  let query = {}
  if (qs) {
    query = querystring.parse(qs)
  }
  switch (url) {
    case '/slack-event': {
      const body = await slackRequest.verifyAndgetBody(req)
      try {
        console.log(await handleSlackEvent(body, res))
      } catch (err) {
        console.error(err)
      }
      break
    }
    case '/slack-direct-install': {
      res.statusCode = 302
      res.setHeader(
        'Location',
        `https://slack.com/oauth/authorize?client_id=${
          process.env.SLACK_CLIENT_ID
        }&scope=bot`
      )
      res.end()
      break
    }
    case '/oauth/slack': {
      const { body } = await slackRequest.post(
        `oauth.access?code=${query.code}&client_id=${
          process.env.SLACK_CLIENT_ID
        }&client_secret=${process.env.SLACK_CLIENT_SECRET}`
      )
      if (body.team_id && body.bot && body.bot.bot_access_token) {
        const team = await addTeam(body)
        serveHTML(res, 'logged-in', team)
        try {
          teams[team.teamId] = await slackRequest.getUsers(team.token)
          console.log('team added')
        } catch (err) {
          console.error(err)
        }
      } else {
        send(res, 500, JSON.stringify(body, undefined, '  '))
      }
      break
    }
    case '/':
      serveHTML(res, 'index')
      break
    case '/privacy':
      serveHTML(res, 'privacy')
      break
    default:
      res.statusCode = 404
      serveHTML(res, 404)
  }
}
