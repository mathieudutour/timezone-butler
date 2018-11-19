const { send } = require('micro')
const querystring = require('querystring')
const slackRequest = require('./slack-request')
const messageParser = require('./timezones')
const messageBuilder = require('./message-builder')
const { addTeam, removeTeam } = require('./db')
const initialization = require('./init')
const serveHTML = require('./serve-html')

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
const handleSlackMessage = async (body, event, token) => {
  const times = messageParser(event.text)
  if (!times.length) {
    return 'no time to translate'
  }

  lastFewSlackEventsHandled.push(body.event_id)
  lastFewSlackEventsHandled = lastFewSlackEventsHandled.slice(0, 20)

  return Promise.all(
    messageBuilder(teams[body.team_id], event.user, times).map(
      ({ user, text }) =>
        slackRequest.post('chat.postEphemeral', token, {
          channel: event.channel,
          user,
          text,
          thread_ts: event.thread_ts,
        })
    )
  )
}

const handleSlackUserChanged = async (body, event) => {
  teams[body.team_id][event.user.id] = parseFloat(event.user.tz_offset)
  return `updated ${event.user.id}`
}

const handleUninstall = async body => {
  await removeTeam(body.team_id)

  delete teams[body.team_id]
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

  if (event.type === 'app_uninstalled') {
    return handleUninstall(body, event)
  }

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
    return handleSlackMessage(body, event, teams[body.team_id]._token)
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
        serveHTML(res, 'loggedIn', team)
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
