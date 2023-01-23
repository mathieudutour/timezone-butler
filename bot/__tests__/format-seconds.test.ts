/* globals test, expect */
import formatSeconds from '../format-seconds'

test('should format a number of seconds', () => {
  expect(formatSeconds(3600)).toBe('1am')
  expect(formatSeconds(13 * 3600)).toBe('1pm')
  expect(formatSeconds(13 * 3600 + 60)).toBe('1:01pm')
  expect(formatSeconds(13 * 3600 + 600)).toBe('1:10pm')
})

test('should format a number of seconds around noon and midnight', () => {
  expect(formatSeconds(0.5 * 3600)).toBe('12:30am')
  expect(formatSeconds(12.5 * 3600)).toBe('12:30pm')
})

test('should format midnight', () => {
  expect(formatSeconds(0)).toBe('midnight the day before')
  expect(formatSeconds(24 * 3600)).toBe('midnight the day after')
})

test('should format noon', () => {
  expect(formatSeconds(12 * 3600)).toBe('noon')
})

test('should format negative time', () => {
  expect(formatSeconds(-8 * 3600)).toBe('4pm the day before')
})

test('should format time bigger than 24h', () => {
  expect(formatSeconds(26 * 3600)).toBe('2am the day after')
})

test('should format ambigous time', () => {
  expect(formatSeconds(3600, { ambigousAPM: true })).toBe(
    '1am (or 1pm if it was pm)'
  )
})
