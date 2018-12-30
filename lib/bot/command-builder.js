const secondsFormatter = require('./format-seconds')
const messageBuilder = require('./message-builder')

function convenientTime(team, userIds) {
  const userTZs = userIds
    .map(id => team[id])
    // there might be some bots or other weird stuff so let's just remove them if we don't know them
    .filter(tz => typeof tz !== 'undefined')

  const convenientTimes = userTZs.map(tz => ({
    start: 8 * 3600 - tz,
    end: 19 * 3600 - tz,
  }))

  const time = convenientTimes[0]

  convenientTimes.forEach(({ start, end }) => {
    if (start > time.start) {
      time.start = start
    }
    if (end < time.end) {
      time.end = end
    }
  })

  return time
}

module.exports = function commandBuilder(
  team,
  posterId,
  { command, userIds, event }
) {
  if (command === 'help') {
    return [
      {
        text: `At your service. Here is a list of things to help you...`,
      },
    ]
  }

  if (command === 'debug') {
    return [
      {
        text: `\`\`\`\n${JSON.stringify(event, null, '  ')
          .replace(/</g, '\\<')
          .replace(/>/g, '\\>')}\n\`\`\``,
        user: posterId,
      },
    ]
  }

  if (command === 'convenient-time') {
    userIds.add(posterId)
    const userIdsArray = [...userIds]
    const time = convenientTime(team, userIdsArray)

    if (time.start > time.end) {
      return [
        {
          text:
            'I am very sorry, there does not seem to be any convenient time for all of you',
        },
      ]
    }

    const start = secondsFormatter(time.start)
    const end = secondsFormatter(time.end)

    return [
      {
        text: `A convenient time for all of you would be between ${start} and ${end} UTC.`,
      },
      userIdsArray.map(user => ({
        user,
        text: messageBuilder.message(
          [
            {
              match: `${start} UTC`,
              time: time.start,
              timezoneModifier: 'UTC',
              timezoneModifierValue: 0,
            },
            {
              match: `${end} UTC`,
              time: time.end,
              timezoneModifier: 'UTC',
              timezoneModifierValue: 0,
            },
          ],
          team[user],
          0
        ),
      })),
    ]
  }

  // if we don't understand the command, just send a temp message to the poster
  return [
    [
      {
        user: posterId,
        text: 'I am very sorry, I did not understand what you were asking.',
      },
    ],
  ]
}

module.exports.convenientTime = convenientTime
