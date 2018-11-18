module.exports = seconds => {
  const hours = Math.floor(seconds / 3600)

  const minutes = Math.floor((seconds - hours * 3600) / 60)

  const amOrPm = hours > 12 ? 'pm' : 'am'
  const hoursString = hours > 12 ? `${hours - 12}` : `${hours}`

  if (minutes === 0) {
    return `${hoursString}${amOrPm}`
  }

  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${hoursString}:${minutesString}${amOrPm}`
}
