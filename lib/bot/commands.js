const USER_REGEX = /<@(U[A-Z0-9]*)>/g

const HELP_REGEX = /(\s|^)help(\s|$)/gi
const CONVENIENT_TIME_REGEX = /(\s|^)convenient time(\s|$)/gi
const DEBUG_REGEX = /(\s|^)debug(\s|$)/gi

module.exports = (event, botId) => {
  const { text } = event

  if (!text) {
    console.log(event)
    return undefined
  }

  const userMentions = new Set()

  let match = USER_REGEX.exec(text)

  while (match) {
    userMentions.add(match[1])

    match = USER_REGEX.exec(text)
  }

  if (botId && !userMentions.has(botId)) {
    return undefined
  }

  const askHelp = text.match(HELP_REGEX)
  const convenientTime = text.match(CONVENIENT_TIME_REGEX)
  const debug = text.match(DEBUG_REGEX)

  if (convenientTime) {
    return {
      command: 'convenient-time',
      userIds: userMentions,
      message: text,
    }
  }

  if (askHelp) {
    return {
      command: 'help',
      message: text,
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
