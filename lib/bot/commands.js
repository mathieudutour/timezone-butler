const USER_REGEX = /<@(U[A-Z0-9]*)>/g

const HELP_REGEX = /(\s|^)help(\s|$)/gi
const CONVENIENT_TIME_REGEX = /(\s|^)convenient time(\s|$)/gi
const DEBUG_REGEX = /(\s|^)debug(\s|$)/gi

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

  const askHelp = message.match(HELP_REGEX)
  const convenientTime = message.match(CONVENIENT_TIME_REGEX)
  const debug = message.match(DEBUG_REGEX)

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
