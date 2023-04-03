export default (seconds: number, options?: { ambigousAPM?: boolean }) => {
  let hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)

  const dayBefore = hours < 0 || (hours === 0 && minutes === 0)
  const dayAfter = hours >= 24

  if (dayBefore) {
    hours += 24
  } else if (dayAfter) {
    hours -= 24
  }

  // eslint-disable-next-line no-nested-ternary
  const dayModifierString = dayBefore
    ? ` the day before`
    : dayAfter
    ? ` the day after`
    : ''

  let amOrPm = hours > 12 ? 'pm' : 'am'
  let hoursString = hours > 12 ? `${hours - 12}` : `${hours}`

  const { ambigousAPM } = options || {}

  if (minutes === 0) {
    if (hoursString === '0') {
      return (
        (amOrPm === 'am' ? 'midnight' : 'noon') +
        dayModifierString +
        (ambigousAPM
          ? ` (or ${amOrPm === 'am' ? 'noon' : 'midnight'} if it was pm)`
          : '')
      )
    }
    if (hoursString === '12') {
      return (
        (amOrPm === 'am' ? 'noon' : 'midnight') +
        dayModifierString +
        (ambigousAPM
          ? ` (or ${amOrPm === 'am' ? 'midnight' : 'noon'} if it was pm)`
          : '')
      )
    }
    return `${hoursString}${amOrPm}${dayModifierString}${deambiguate(
      `${hoursString}`,
      amOrPm,
      options
    )}`
  }

  if (hours === 12) {
    amOrPm = 'pm'
  } else if (hours === 0) {
    amOrPm = 'am'
  }

  if (hoursString === '0') {
    hoursString = '12'
  }
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${hoursString}:${minutesString}${amOrPm}${dayModifierString}${deambiguate(
    `${hoursString}:${minutesString}`,
    amOrPm,
    options
  )}`
}

function deambiguate(
  string: string,
  amOrPm: string,
  options?: { ambigousAPM?: boolean }
) {
  return options?.ambigousAPM
    ? ` (or ${string}${amOrPm === 'am' ? 'pm' : 'am'} if it was pm)`
    : ''
}
