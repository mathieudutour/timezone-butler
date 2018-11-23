const timezones = {
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
const timezonesRegex = `(${Object.keys(timezones).join('|')})?`

// match 8:30 or 09:12 or 3h12 or 11h20 or 8:10am or 12h11pm
const longTime = '((\\d{1,2})[:h](\\d{2}))([ap]m)?'
// match 1am or 12pm
const shortTime = '(\\d{1,2})([ap]m)'

// put everything together
const REGEX = new RegExp(
  `${timezonesRegex}\\s?(${longTime}|${shortTime})\\s?${timezonesRegex}`,
  'gi'
)

module.exports = message => {
  const result = []

  let match = REGEX.exec(message)

  while (match) {
    let hours = parseInt(match[4] || match[7] || 0, 10)
    const minutes = parseInt(match[5] || 0, 10)

    const amOrPm = match[6] || match[8]
    if (amOrPm && amOrPm.toLowerCase() === 'pm') {
      hours += 12
    }

    const timezoneModifier = match[1] || match[9]

    result.push({
      match: match[0].trim(),
      time: hours * 3600 + minutes * 60,
      timezoneModifier,
      timezoneModifierValue: timezoneModifier
        ? timezones[timezoneModifier.toUpperCase()]
        : undefined,
    })

    match = REGEX.exec(message)
  }

  const dedupe = {}

  return result.filter(({ time, timezoneModifierValue }) => {
    if (dedupe[`${time}${timezoneModifierValue}`]) {
      return false
    }
    dedupe[`${time}${timezoneModifierValue}`] = true
    return true
  })
}
