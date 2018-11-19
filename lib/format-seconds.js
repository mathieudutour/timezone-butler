module.exports = seconds => {
  let hours = Math.floor(seconds / 3600)

  const minutes = Math.floor((seconds - hours * 3600) / 60)

  const dayBefore = hours <= 0
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

  const amOrPm = hours > 12 ? 'pm' : 'am'
  const hoursString = hours > 12 ? `${hours - 12}` : `${hours}`

  if (minutes === 0) {
    if (hoursString === '0') {
      return (amOrPm === 'am' ? 'midnight' : 'noon') + dayModifierString
    }
    if (hoursString === '12') {
      return (amOrPm === 'am' ? 'noon' : 'midnight') + dayModifierString
    }
    return `${hoursString}${amOrPm}${dayModifierString}`
  }

  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${hoursString}:${minutesString}${amOrPm}${dayModifierString}`
}
