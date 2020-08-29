/* globals test, expect */
const timezones = require('../timezones')

test('should return empty array when no time to parse', () => {
  expect(timezones('no time to parse')).toEqual([])
})

test('should find a time with no modifier', () => {
  expect(timezones('8:30')).toEqual([
    {
      match: '8:30',
      time: 30600,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])

  expect(timezones('20:30')).toEqual([
    {
      match: '20:30',
      time: 73800,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])
})

test('should find a time with am', () => {
  expect(timezones('8:30am')).toEqual([
    {
      match: '8:30am',
      time: 30600,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])
  expect(timezones('11:30am')).toEqual([
    {
      match: '11:30am',
      time: 41400,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])
})

test('should find a time with pm', () => {
  expect(timezones('8:30pm')).toEqual([
    {
      match: '8:30pm',
      time: 73800,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])
  expect(timezones('11:30pm')).toEqual([
    {
      match: '11:30pm',
      time: 84600,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])
})

test('should find a time a timezone modifier', () => {
  expect(timezones('8:30am PST')).toEqual([
    {
      match: '8:30am PST',
      time: 30600,
      timezoneModifier: 'PST',
      timezoneModifierValue: -28800,
      ambigousAPM: false,
    },
  ])

  expect(timezones('8:30am Zip')).toEqual([
    {
      match: '8:30am',
      time: 30600,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])

  expect(timezones('8:30am\nEST')).toEqual([
    {
      match: '8:30am',
      time: 30600,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])

  expect(timezones('PST 8:30am')).toEqual([
    {
      match: 'PST 8:30am',
      time: 30600,
      timezoneModifier: 'PST',
      timezoneModifierValue: -28800,
      ambigousAPM: false,
    },
  ])
})

test('should find a time a timezone modifier without am or pm', () => {
  expect(timezones('8 PST')).toEqual([
    {
      match: '8 PST',
      time: 28800,
      timezoneModifier: 'PST',
      timezoneModifierValue: -28800,
      ambigousAPM: true,
    },
  ])
})

test('should find multiple times', () => {
  expect(timezones('8:30am PST 8:30pm')).toEqual([
    {
      match: '8:30am PST',
      time: 30600,
      timezoneModifier: 'PST',
      timezoneModifierValue: -28800,
      ambigousAPM: false,
    },
    {
      match: '8:30pm',
      time: 73800,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])
})

test('should not return duplicated times', () => {
  expect(timezones('8:30am 8:30am')).toEqual([
    {
      match: '8:30am',
      time: 30600,
      timezoneModifier: undefined,
      timezoneModifierValue: undefined,
      ambigousAPM: false,
    },
  ])
})

test('should not return not valid time', () => {
  expect(timezones('13:30am 80:80 01:80')).toEqual([])
})

// test('should find a period', () => {
//   expect(timezones('8-9 PST')).toEqual([
//     {
//       match: '8 PST',
//       time: 28800,
//       timezoneModifier: 'PST',
//       timezoneModifierValue: -28800,
//       ambigousAPM: true,
//     },
//   ])
// })
