const { send } = require('micro')
const slackRequest = require('../slack-request')
const { addTeam } = require('../db')
const serveHTML = require('../front-end/serve-html')
const areStatesEqual = require('./are-states-equal')

module.exports = async (req, res, query, addTeamToCache, cookieSession) => {
  cookieSession(req, res, () => {})
  const state = req.session.slackOauthState
  if (
    (query.error && query.error === 'access_denied') ||
    !query.state ||
    !state ||
    !areStatesEqual(query.state, state)
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
      // eslint-disable-next-line no-param-reassign
      addTeamToCache(
        team.teamId,
        await slackRequest.getUsers(team.token, team.botId)
      )
      console.log('team added: ')
    } catch (err) {
      console.error(err)
    }
  } else {
    send(res, 500, JSON.stringify(body, undefined, '  '))
  }
}
