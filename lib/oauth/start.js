const crypto = require('crypto')

module.exports = (req, res, cookieSession) => {
  cookieSession(req, res, () => {})
  const state = crypto
    .randomBytes(Math.ceil(30 / 2))
    .toString('hex')
    .slice(0, 30)
  req.session.slackOauthState = state
  res.statusCode = 302
  res.setHeader(
    'Location',
    `https://slack.com/oauth/authorize?client_id=${
      process.env.SLACK_CLIENT_ID
    }&scope=bot&state=${state}`
  )
  res.end()
}
