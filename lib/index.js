const { send } = require('micro')
const crypto = require('crypto')
const querystring = require('querystring')
const CookieSession = require('cookie-session')
const slackRequest = require('./slack-request')
const { addTeam } = require('./db')
const initialization = require('./init')
const serveHTML = require('./serve-html')
const areStatesEqual = require('./are-states-equal')
const handleSlackEvent = require('./handle-slack-event')

const cookieSession = CookieSession({
  name: 'slack-oauth-session',
  secret: process.env.COOKIES_SECRET,
  maxAge: 60000,
})

let teams = {}

initialization()
  .then(_teams => {
    teams = _teams
  })
  .then(() =>
    console.log(`initialized with ${Object.keys(teams).length} teams`)
  )
  .catch(console.error)

module.exports = async (req, res) => {
  const [url, qs] = req.url.split('?')
  let query = {}
  if (qs) {
    query = querystring.parse(qs)
  }
  switch (url) {
    case '/slack-event': {
      const body = await slackRequest.verifyAndgetBody(req)
      try {
        console.log(await handleSlackEvent(teams, body, res))
      } catch (err) {
        console.error(err)
      }
      break
    }
    case '/slack-direct-install': {
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
      break
    }
    case '/oauth/slack': {
      cookieSession(req, res, () => {})
      const state = req.session.slackOauthState
      if (
        (req.query.error && req.query.error === 'access_denied') ||
        !req.query.state ||
        !state ||
        !areStatesEqual(req.query.state, state)
      ) {
        res.statusCode = 302
        res.setHeader('Location', `https://timezone-butler.now.sh`)
        res.end()
        return
      }

      const { body } = await slackRequest.post(
        `oauth.access?code=${query.code}&client_id=${
          process.env.SLACK_CLIENT_ID
        }&client_secret=${process.env.SLACK_CLIENT_SECRET}`
      )

      if (body.team_id && body.bot && body.bot.bot_access_token) {
        const team = await addTeam(body)
        serveHTML(res, 'loggedIn', team)
        try {
          teams[team.teamId] = await slackRequest.getUsers(team.token)
          console.log('team added')
        } catch (err) {
          console.error(err)
        }
      } else {
        send(res, 500, JSON.stringify(body, undefined, '  '))
      }
      break
    }
    case '/':
      serveHTML(res, 'index')
      break
    case '/privacy':
      serveHTML(res, 'privacy')
      break
    default:
      res.statusCode = 404
      serveHTML(res, 404)
  }
}
