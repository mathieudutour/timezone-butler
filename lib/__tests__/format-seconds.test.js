/* globals test, expect */
const formatSeconds = require('../format-seconds')

test('should format a number of seconds', () => {
  expect(formatSeconds(3600)).toBe('1am')
  expect(formatSeconds(13 * 3600)).toBe('1pm')
  expect(formatSeconds(13 * 3600 + 60)).toBe('1:01pm')
  expect(formatSeconds(13 * 3600 + 600)).toBe('1:10pm')
})
