const USER_REGEX = /<@(U[A-Z0-9]*)>/g

const HELP_REGEX = /(\s|^)help(\s|$)/gi
const CONVENIENT_TIME_REGEX = /(\s|^)convenient time(\s|$)/gi
const DEBUG_REGEX = /(\s|^)debug(\s|$)/gi

export type Command =
  | {
      command: 'convenient-time'
      userIds: Set<string>
      message: string
      event: { text: string }
    }
  | {
      command: 'help'
      userIds: undefined
      message: string
      event: { text: string }
    }
  | {
      command: 'debug'
      userIds: undefined
      message: undefined
      event: { text: string }
    }
  | {
      command: undefined
      userIds: undefined
      message: undefined
      event: undefined
    }

export default (
  event: { text: string }
): Command | undefined => {
  const { text } = event

  if (typeof text === 'undefined') {
    console.log(event)
    return undefined
  }

  const userMentions = new Set<string>()

  let match = USER_REGEX.exec(text)

  while (match) {
    userMentions.add(match[1])

    match = USER_REGEX.exec(text)
  }

  const askHelp = text.match(HELP_REGEX)
  const convenientTime = text.match(CONVENIENT_TIME_REGEX)
  const debug = text.match(DEBUG_REGEX)

  if (convenientTime) {
    return {
      command: 'convenient-time',
      userIds: userMentions,
      message: text,
      event,
    }
  }

  if (askHelp) {
    return {
      command: 'help',
      message: text,
      event,
      userIds: undefined,
    }
  }

  if (debug) {
    return {
      command: 'debug',
      event,
      userIds: undefined,
      message: undefined,
    }
  }

  return undefined
}
