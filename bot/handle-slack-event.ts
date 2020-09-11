import * as slackRequest from '../utils/slack-request'
import timeParser from './timezones'
import commandParser, { Command } from './commands'
import messageBuilder, { message } from './message-builder'
import commandBuilder from './command-builder'
import { removeTeam, getTeam } from '../utils/db'

const SUBTYPES = [
  'message_changed',
  'me_message',
  'message_replied',
  'thread_broadcast',
]

const commandResponse = (
  team: slackRequest.Team,
  event: {
    user: string
    text: string
    channel: string
    thread_ts: string
  },
  command?: Command
) =>
  commandBuilder(team, event.user, command)
    .reduce((p, messageLists) => {
      // if we have an array, it means that it's an ephemeral message to send to multiple people
      if (Array.isArray(messageLists)) {
        return p.then(() =>
          Promise.all(
            messageLists.map((message) =>
              message.text
                ? slackRequest.post('chat.postEphemeral', team._token, {
                    ...message,
                    channel: event.channel,
                    thread_ts: event.thread_ts,
                  })
                : Promise.resolve()
            )
          )
        )
      }
      if (messageLists.text) {
        // otherwise it's a normal message
        return p.then(() =>
          slackRequest.post('chat.postMessage', team._token, {
            ...messageLists,
            channel: event.channel,
            thread_ts: event.thread_ts,
          })
        )
      }
      return p
    }, Promise.resolve() as Promise<any>)
    .then(() => 'sent command response')

const handleSlackMessage = async (
  { team_id, bot_id }: { team_id: string; bot_id: string },
  event: {
    type: 'app_uninstalled' | 'message' | 'app_home_opened'
    channel_type: 'app_home' | 'im'
    user: string
    text: string
    channel: string
    thread_ts: string
  }
) => {
  if (event.type === 'app_uninstalled' || event.type === 'app_home_opened') {
    return
  }

  const times = timeParser(event.text)

  // direct message to the bot
  if (event.channel_type === 'app_home' || event.channel_type === 'im') {
    const team = await getTeam(team_id)

    if (!team) {
      return `team ${team_id} is missing from db`
    }

    if (typeof team[event.user] === 'undefined') {
      return `unknown user ${event.user} in team ${team_id}`
    }

    if (times.length) {
      const text = message(times, team[event.user] + 7200, team[event.user])
      return slackRequest
        .post('chat.postMessage', team._token, {
          channel: event.channel,
          text: `This is what I would say to someone in a timezone +2h compared to yours:\n${text}`,
          thread_ts: event.thread_ts,
        })
        .then(() => 'sent example to direct message')
    }

    const command = commandParser(event)

    return commandResponse(team, event, command)
  }

  const command = commandParser(event, bot_id)

  if (command) {
    const team = await getTeam(team_id)

    if (team && typeof team[event.user] !== 'undefined') {
      await commandResponse(team, event, command)
    }
  }

  if (!times.length) {
    return 'nothing to handle'
  }

  const team = await getTeam(team_id)

  if (!team) {
    return `team ${team_id} is missing from db`
  }

  if (typeof team[event.user] === 'undefined') {
    return `unknown user ${event.user} in team ${team_id}`
  }

  return Promise.all(
    messageBuilder(team, event.user, times).map(({ user, text }) =>
      text
        ? slackRequest.post('chat.postEphemeral', team._token, {
            channel: event.channel,
            user,
            text,
            thread_ts: event.thread_ts,
          })
        : Promise.resolve()
    )
  ).then(() => 'time translations sent')
}

const handleUninstall = async (body: { team_id: string }) => {
  await removeTeam(body.team_id)
  return `removed team ${body.team_id}`
}

export default async function (body: {
  type: 'event_callback'
  team_id: string
  event: {
    type: 'app_uninstalled' | 'message' | 'app_home_opened'
    subtype: string
    bot_id?: string
    hidden: boolean
    user: string
    channel_type: 'app_home' | 'im'
    text: string
    channel: string
    thread_ts: string
  }
  authed_users: string[]
}) {
  if (body.type !== 'event_callback' || !body.event) {
    return 'not sure how to handle that...'
  }

  const { event, authed_users } = body
  const bot_id = authed_users[0]

  if (event.type === 'app_uninstalled') {
    return handleUninstall(body)
  }

  if (event.type === 'app_home_opened') {
    const team = await getTeam(body.team_id)

    if (!team) {
      return `team ${body.team_id} is missing from db`
    }

    if (typeof team[event.user] === 'undefined') {
      return `unknown user ${event.user} in team ${body.team_id}`
    }

    const previousConvo: {
      messages: {}[]
    } = await slackRequest.get('conversations.history', team._token, {
      channel: event.channel,
      count: 1,
    })

    if (previousConvo.messages.length) {
      return 'already sent welcome message'
    }

    return slackRequest
      .post('chat.postMessage', team._token, {
        channel: event.channel,
        text: `Hello there!\nI'm the Timezone Butler, at your service.\n I'll work without you eveen noticing, making sure that everybody in your team are on the same page when talking about time.\n\n If you'd like to see what I'll say to someone who is in a different timezone than yours, you can try chatting here. For example, try to send\n> Can we chat tomorrow around 4pm?`,
        thread_ts: event.thread_ts,
      })
      .then(() => 'sent example to direct message')
  }

  if (event.bot_id) {
    return 'ignore'
  }

  // for some reason, event.user is sometime a object with the entire user object
  // @ts-ignore
  if (typeof event.user === 'object' && event.user.id) {
    // @ts-ignore
    event.user = event.user.id
  }

  if (!event.user) {
    console.log(event)
    return 'missing user'
  }

  if (
    event.type !== 'message' ||
    event.hidden ||
    (event.subtype && SUBTYPES.indexOf(event.subtype) === -1)
  ) {
    return 'ignore'
  }

  return handleSlackMessage({ team_id: body.team_id, bot_id }, event)
}
