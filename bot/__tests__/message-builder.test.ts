/* globals test, expect */
import messageBuilder from '../message-builder'

test('should build a message for people in a different timezone', () => {
  expect(
    messageBuilder(
      {
        a: 0,
        b: -3600,
        c: 3600,
        d: 0,
      },
      'a',
      [
        {
          match: '8:30pm',
          time: 73800,
          timezoneModifier: undefined,
          timezoneModifierValue: undefined,
          ambigousAPM: false,
        },
      ]
    )
  ).toEqual([
    {
      text: '8:30pm is 7:30pm in your timezone.',
      user: 'b',
    },
    {
      text: '8:30pm is 9:30pm in your timezone.',
      user: 'c',
    },
  ])
})

test('should build a message for people in a different timezone when there are multiple times', () => {
  expect(
    messageBuilder(
      {
        a: 0,
        b: -3600,
        c: 3600,
        d: 0,
      },
      'a',
      [
        {
          match: '8:30pm',
          time: 73800,
          timezoneModifier: undefined,
          timezoneModifierValue: undefined,
          ambigousAPM: false,
        },
        {
          match: '1am',
          time: 3600,
          timezoneModifier: undefined,
          timezoneModifierValue: undefined,
          ambigousAPM: false,
        },
      ]
    )
  ).toEqual([
    {
      text: '8:30pm is 7:30pm in your timezone.\n1am is midnight the day before in your timezone.',
      user: 'b',
    },
    {
      text: '8:30pm is 9:30pm in your timezone.\n1am is 2am in your timezone.',
      user: 'c',
    },
  ])
})

test('should build a message even if the day changes', () => {
  expect(
    messageBuilder(
      {
        a: 0,
        b: -7200,
        c: 7200,
        d: 0,
      },
      'a',
      [
        {
          match: '11pm',
          time: 23 * 3600,
          timezoneModifier: undefined,
          timezoneModifierValue: undefined,
          ambigousAPM: false,
        },
        {
          match: '1am',
          time: 3600,
          timezoneModifier: undefined,
          timezoneModifierValue: undefined,
          ambigousAPM: false,
        },
      ]
    )
  ).toEqual([
    {
      text: '11pm is 9pm in your timezone.\n1am is 11pm the day before in your timezone.',
      user: 'b',
    },
    {
      text: '11pm is 1am the day after in your timezone.\n1am is 3am in your timezone.',
      user: 'c',
    },
  ])
})
