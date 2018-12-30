const USER_REGEX = /<@(U[A-Z0-9]*)>/g

const HELP_REGEX = /\shelp\s/g
const CONVENIENT_TIME_REGEX = /\sconvenient time\s/g
const DEBUG_REGEX = /\sdebug\s/g

module.exports = (event, botId) => {
  const { message } = event
  const userMentions = new Set()

  let match = USER_REGEX.exec(message)

  while (match) {
    userMentions.add(match[1])

    match = USER_REGEX.exec(message)
  }

  if (botId && !userMentions.has(botId)) {
    return undefined
  }

  const askHelp = HELP_REGEX.test(message)
  const convenientTime = CONVENIENT_TIME_REGEX.test(message)
  const debug = DEBUG_REGEX.test(message)

  if (convenientTime) {
    return {
      command: 'convenient-time',
      userIds: userMentions,
      message,
    }
  }

  if (askHelp) {
    return {
      command: 'help',
      message,
    }
  }

  if (debug) {
    return {
      command: 'debug',
      event,
    }
  }

  return undefined
}
