const { send } = require('micro')
const slackRequest = require('./slack-request')
const messageParser = require('./timezones')
const messageBuilder = require('./message-builder')
const { removeTeam } = require('./db')

let lastFewSlackEventsHandled = []

const handleSlackMessage = async (teams, body, event) => {
  const times = messageParser(event.text)

  // direct message to the bot
  if (event.channel_type === 'app_home') {
    if (times.length) {
      const text = messageBuilder.message(
        times,
        teams[body.team_id][event.user],
        teams[body.team_id][event.user] + 7200
      )
      return slackRequest.post('chat.postMessage', teams[body.team_id]._token, {
        channel: event.channel,
        text: `This is what I would say to someone in a timezone +2h compared to yours:\n${text}`,
        thread_ts: event.thread_ts,
      })
    }
    // send help!
    return 'direct message'
  }

  if (!times.length) {
    return 'no time to translate'
  }

  lastFewSlackEventsHandled.push(body.event_id)
  lastFewSlackEventsHandled = lastFewSlackEventsHandled.slice(0, 20)

  return Promise.all(
    messageBuilder(teams[body.team_id], event.user, times).map(
      ({ user, text }) =>
        slackRequest.post('chat.postEphemeral', teams[body.team_id]._token, {
          channel: event.channel,
          user,
          text,
          thread_ts: event.thread_ts,
        })
    )
  ).then(() => 'time translations sent')
}

const handleSlackUserChanged = async (teams, body, event) => {
  // eslint-disable-next-line no-param-reassign
  teams[body.team_id][event.user.id] = parseFloat(event.user.tz_offset)
  return `updated user ${event.user.id}`
}

const handleUninstall = async (teams, body) => {
  await removeTeam(body.team_id)

  // eslint-disable-next-line no-param-reassign
  delete teams[body.team_id]
  return `removed team ${body.team_id}`
}

module.exports = (teams, body, res) => {
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
    return handleUninstall(teams, body, event)
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
    return handleSlackMessage(teams, body, event)
  }

  if (event.type === 'user_change') {
    return handleSlackUserChanged(teams, body, event)
  }

  return 'not sure what to do with that...'
}
