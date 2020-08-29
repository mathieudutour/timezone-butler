/* globals test, expect */
const commandBuilder = require('../command-builder')

test('convenient times', () => {
  expect(
    commandBuilder.convenientTime(
      {
        a: 0,
        b: -7200,
        c: 7200,
      },
      ['a', 'b', 'c']
    )
  ).toEqual({ start: 10 * 3600, end: 17 * 3600 })
  expect(
    commandBuilder.convenientTime(
      {
        a: 0,
        b: -7200,
        c: 7200,
      },
      ['c', 'b']
    )
  ).toEqual({ start: 10 * 3600, end: 17 * 3600 })
})

test('should build a message for a convenient time', () => {
  expect(
    commandBuilder(
      {
        a: 0,
        b: -7200,
        c: 7200,
        d: 0,
      },
      'a',
      { command: 'convenient-time', userIds: new Set(['a', 'b', 'c']) }
    )
  ).toEqual([
    {
      text:
        'A convenient time for all of you would be between 10am and 5pm UTC.',
    },
    [
      { text: undefined, user: 'a' },
      {
        text:
          '10am UTC is 8am in your timezone.\n5pm UTC is 3pm in your timezone.',
        user: 'b',
      },
      {
        text:
          '10am UTC is noon in your timezone.\n5pm UTC is 7pm in your timezone.',
        user: 'c',
      },
    ],
  ])

  expect(
    commandBuilder(
      {
        a: 0,
        b: 3600,
        c: -9 * 3600,
        d: 0,
      },
      'b',
      { command: 'convenient-time', userIds: new Set(['b', 'c']) }
    )
  ).toEqual([
    {
      text:
        'A convenient time for all of you would be between 5pm and 6pm UTC.',
    },
    [
      {
        text:
          '5pm UTC is 6pm in your timezone.\n6pm UTC is 7pm in your timezone.',
        user: 'b',
      },
      {
        text:
          '5pm UTC is 8am in your timezone.\n6pm UTC is 9am in your timezone.',
        user: 'c',
      },
    ],
  ])
})

test('should build a message when there is no convenient time', () => {
  expect(
    commandBuilder(
      {
        a: 0,
        b: 7200,
        c: -10 * 3600,
        d: 0,
      },
      'b',
      { command: 'convenient-time', userIds: new Set(['b', 'c']) }
    )
  ).toEqual([
    {
      text:
        'I am very sorry, there does not seem to be any convenient time for all of you',
    },
  ])
})
