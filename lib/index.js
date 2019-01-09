const querystring = require('querystring')
const CookieSession = require('cookie-session')
const slackRequest = require('./slack-request')
const initialization = require('./init')
const serveHTML = require('./front-end/serve-html')
const handleSlackEvent = require('./bot/handle-slack-event')
const oauthCallback = require('./oauth/callback')
const oauthStart = require('./oauth/start')

const cookieSession = CookieSession({
  name: 'slack-oauth-session',
  secret: process.env.COOKIES_SECRET,
  maxAge: 60000,
})

let teams = {}

function addTeam(id, users) {
  teams[id] = users
}

initialization()
  .then(_teams => {
    teams = _teams
  })
  .then(() => {
    console.log(`initialized with ${Object.keys(teams).length} teams`)
    console.log(JSON.stringify(teams))
  })
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
      oauthStart(req, res, cookieSession)
      break
    }
    case '/oauth/slack': {
      await oauthCallback(req, res, query, addTeam, cookieSession)
      break
    }
    case '/':
      serveHTML(res, 'index')
      break
    case '/privacy':
      serveHTML(res, 'privacy')
      break
    case '/contact':
      serveHTML(res, 'contact')
      break
    default:
      res.statusCode = 404
      serveHTML(res, 404)
  }
}
