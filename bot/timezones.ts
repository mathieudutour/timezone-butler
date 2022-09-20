const timezones: { [tz: string]: number } = {
  NZDT: 12 * 3600,
  AEDT: 11 * 3600,
  ACDT: 10.5 * 3600,
  AEST: 10 * 3600,
  ACST: 9.5 * 3600,
  KST: 9 * 3600,
  HKT: 8 * 3600,
  ICT: 7 * 3600,
  ALMT: 6 * 3600,
  IST: 5.5 * 3600,
  PKT: 5 * 3600,
  GET: 4 * 3600,
  MSK: 3 * 3600,
  EET: 2 * 3600,
  CET: 1 * 3600,
  Z: 0,
  UT: 0,
  GMT: 0,
  UTC: 0,
  EDT: 0,
  CVT: -1 * 3600,
  BRST: -2 * 3600,
  BRT: -3 * 3600,
  AST: -4 * 3600,
  EST: -5 * 3600,
  CDT: -5 * 3600,
  CST: -6 * 3600,
  MDT: -6 * 3600,
  MST: -7 * 3600,
  PDT: -7 * 3600,
  PST: -8 * 3600,
  AKDT: -8 * 3600,
  AKST: -9 * 3600,
  HDT: -9 * 3600,
  HST: -10 * 3600,
  SST: -11 * 3600,
}

// match CET or PST or ...
const timezonesRegex = ({
  start,
  end,
}: { start?: boolean; end?: boolean } = {}) => {
  if (start) {
    return `((?: |^)(?:${Object.keys(timezones).join('|')}))`
  }
  if (end) {
    return `((?:${Object.keys(timezones).join('|')})(?: |$))`
  }
  return `(${Object.keys(timezones).join('|')})`
}

// match 8:30 or 09:12 or 3h12 or 11h20 or 8:10am or 12h11pm
const longTime = '((\\d{1,2})[:h](\\d{2}))([ap]m)?'
// match 1am or 12pm
const shortTime = '(\\d{1,2})([ap]m)'
// match 1 EST
const shortTimezone = `(\\d{1,2}) ?${timezonesRegex({ end: true })}`

// match 10-11am
// const period = `(\\d{1,2})([:h](\\d{2}))?-(\\d{1,2})([:h](\\d{2}))?([ap]m)`

// put everything together
const REGEX = new RegExp(
  `${timezonesRegex({
    start: true,
  })}? ?(${longTime}|${shortTime}|${shortTimezone}) ?${timezonesRegex({
    end: true,
  })}?`,
  'gi'
)

export type Time = {
  match: string
  time: number
  ambigousAPM: boolean
} & (
  | { timezoneModifier: string; timezoneModifierValue: number }
  | { timezoneModifier: undefined; timezoneModifierValue: undefined }
)

export default function (message: string) {
  const times: Time[] = []

  let match = REGEX.exec(message)

  while (match) {
    let hours = parseInt(match[4] || match[7] || match[9] || '0', 10)
    const minutes = parseInt(match[5] || '0', 10)

    let amOrPm = match[6] || match[8]

    // check if we have a valid hour/minute
    if ((amOrPm && hours > 12) || hours > 23 || minutes > 59) {
      match = REGEX.exec(message)
      // eslint-disable-next-line no-continue
      continue
    }

    // if am or pm isn't specified, make an inference about the most likely time.
    // this prioritizes 2pm to 2am
    if (!amOrPm && hours < 7) {
      amOrPm = 'pm'
    }
    if (amOrPm && amOrPm.toLowerCase() === 'pm') {
      hours += 12
    }

    // weird people using 12:05pm to mean five past noon
    if ((amOrPm && hours === 12) || hours === 24) {
      hours -= 12
    }

    let timezoneModifier: string | undefined =
      match[1] || match[11] || match[10]
    if (timezoneModifier) {
      timezoneModifier = timezoneModifier.trim().toUpperCase()
    }

    times.push(
      timezoneModifier
        ? {
            match: match[0].trim(),
            time: hours * 3600 + minutes * 60,
            timezoneModifier,
            timezoneModifierValue: timezones[timezoneModifier],
            ambigousAPM: !!match[10],
          }
        : {
            match: match[0].trim(),
            time: hours * 3600 + minutes * 60,
            timezoneModifier: undefined,
            timezoneModifierValue: undefined,
            ambigousAPM: !!match[10],
          }
    )

    match = REGEX.exec(message)
  }

  if (message.match(' noon') || message.match('noon ') || message === 'noon') {
    times.push({
      match: 'noon',
      time: 12 * 3600,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    })
  }

  const dedupe: { [key: string]: boolean } = {}

  return times.filter(({ time, timezoneModifierValue }) => {
    if (dedupe[`${time}${timezoneModifierValue}`]) {
      return false
    }
    dedupe[`${time}${timezoneModifierValue}`] = true
    return true
  })
}
