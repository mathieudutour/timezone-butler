const { send } = require('micro')
const slackRequest = require('./slack-request')
const timeParser = require('./timezones')
const commandParser = require('./commands')
const messageBuilder = require('./message-builder')
const commandBuilder = require('./command-builder')
const { removeTeam } = require('./db')

const SUBTYPES = [
  'message_changed',
  'me_message',
  'message_replied',
  'thread_broadcast',
]

const commandResponse = (teams, body, event, command) =>
  commandBuilder(teams[body.team_id], event.user, command)
    .reduce((p, messageLists) => {
      // if we have an array, it means that it's an ephemeral message to send to multiple people
      if (Array.isArray(messageLists)) {
        p.then(() =>
          Promise.all(
            messageLists.map(({ user, text }) =>
              text
                ? slackRequest.post(
                    'chat.postEphemeral',
                    teams[body.team_id]._token,
                    {
                      channel: event.channel,
                      user,
                      text,
                      thread_ts: event.thread_ts,
                    }
                  )
                : Promise.resolve()
            )
          )
        )
      } else if (messageLists.text) {
        // otherwise it's a normal message
        p.then(() =>
          slackRequest.post('chat.postMessage', teams[body.team_id]._token, {
            channel: event.channel,
            text: messageLists.text,
            thread_ts: event.thread_ts,
          })
        )
      }
      return p
    }, Promise.resolve())
    .then(() => 'sent command response')

const handleSlackMessage = async (teams, body, event) => {
  if (
    event.hidden ||
    (event.subsubtype && SUBTYPES.indexOf(event.subsubtype) === -1)
  ) {
    return ''
  }

  const times = timeParser(event.text)

  // direct message to the bot
  if (event.channel_type === 'app_home' || event.channel_type === 'im') {
    if (times.length) {
      const text = messageBuilder.message(
        times,
        teams[body.team_id][event.user] + 7200,
        teams[body.team_id][event.user]
      )
      return slackRequest
        .post('chat.postMessage', teams[body.team_id]._token, {
          channel: event.channel,
          text: `This is what I would say to someone in a timezone +2h compared to yours:\n${text}`,
          thread_ts: event.thread_ts,
        })
        .then(() => 'sent example to direct message')
    }

    const command = commandParser(event.text)

    if (!command) {
      return slackRequest
        .post('chat.postMessage', teams[body.team_id]._token, {
          channel: event.channel,
          text: `I'm sorry, I don't understand...\n\`\`\`\n${JSON.stringify(
            event,
            null,
            '  '
          )
            .replace(/</g, '\\<')
            .replace(/>/g, '\\>')}\n\`\`\``,
          thread_ts: event.thread_ts,
        })
        .then(() => 'sent example to direct message')
    }

    return commandResponse(teams, body, event, command)
  }

  if (!times.length) {
    const command = commandParser(event.text, teams[body.team_id]._botId)

    if (command) {
      return commandResponse(teams, body, event, command)
    }

    return 'nothing to handle'
  }

  return Promise.all(
    messageBuilder(teams[body.team_id], event.user, times).map(
      ({ user, text }) =>
        text
          ? slackRequest.post(
              'chat.postEphemeral',
              teams[body.team_id]._token,
              {
                channel: event.channel,
                user,
                text,
                thread_ts: event.thread_ts,
              }
            )
          : Promise.resolve()
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
