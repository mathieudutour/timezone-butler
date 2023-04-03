import secondsFormatter from './format-seconds'
import { Time, timezones } from './timezones'

export function message(times: Time[], userTZ: number, posterTZ: number) {
  const text = times.map(({ match, time, timezoneModifier }) => {
    if (typeof timezoneModifier !== 'undefined') {
      const timezone = timezones[timezoneModifier]
      if (timezone === userTZ) {
        return `${timezoneModifier} is your timezone.`
      }
      return `${match} is ${secondsFormatter(
        time + userTZ - timezone
      )} in your timezone.`
    }

    return `${match} is ${secondsFormatter(
      time + userTZ - posterTZ
    )} in your timezone.`
  })

  return [...new Set(text)].join('\n')
}

export default function messageBuilder(
  team: { [userId: string]: number },
  posterId: string,
  times: Time[]
) {
  const posterTZ = team[posterId]

  if (typeof posterTZ === 'undefined') {
    return []
  }

  const usersInDiffTZ = Object.keys(team).filter(
    (userId) =>
      userId !== posterId &&
      team[userId] !== posterTZ &&
      typeof team[userId] !== 'undefined'
  )

  return usersInDiffTZ.map((userId) => {
    const text = message(times, team[userId], posterTZ)
    return {
      user: userId,
      text,
    }
  })
}
