const secondsFormatter = require('./format-seconds')

function message(times, userTZ, posterTZ) {
  const text = times
    .map(({ match, time, timezoneModifier, timezoneModifierValue }) => {
      if (typeof timezoneModifier !== 'undefined') {
        if (timezoneModifierValue === userTZ) {
          return `${timezoneModifier} is your timezone.`
        }
        return `${match} is ${secondsFormatter(
          time + userTZ - timezoneModifierValue
        )} in your timezone.`
      }

      return `${match} is ${secondsFormatter(
        time + userTZ - posterTZ
      )} in your timezone.`
    })
    .join('\n')

  return text
}

module.exports = function messageBuilder(team, posterId, times) {
  const posterTZ = team[posterId]

  if (typeof posterTZ === 'undefined') {
    return []
  }

  const usersInDiffTZ = Object.keys(team).filter(
    userId => userId !== posterId && team[userId] !== posterTZ
  )

  return usersInDiffTZ.map(userId => {
    const text = message(times, team[userId], posterTZ)
    return {
      user: userId,
      text,
    }
  })
}

module.exports.message = message
