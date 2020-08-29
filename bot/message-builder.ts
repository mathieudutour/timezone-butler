import secondsFormatter from './format-seconds'
import { Time } from './timezones'

export function message(times: Time[], userTZ: number, posterTZ: number) {
  if (!userTZ) {
    return undefined
  }

  const text = times.map(
    ({ match, time, timezoneModifier, timezoneModifierValue }) => {
      if (
        typeof timezoneModifier !== 'undefined' &&
        typeof timezoneModifierValue !== 'undefined'
      ) {
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
    }
  )

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
    (userId) => userId !== posterId && team[userId] !== posterTZ
  )

  return usersInDiffTZ.map((userId) => {
    const text = message(times, team[userId], posterTZ)
    return {
      user: userId,
      text,
    }
  })
}
