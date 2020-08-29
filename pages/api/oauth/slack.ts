import { NextApiResponse, NextApiRequest } from 'next'
import * as slackRequest from '../../../utils/slack-request'
import { addTeam } from '../../../utils/db'
import areStringsEqual from '../../../utils/are-strings-equal'
import withSession from '../../../utils/session'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const state = withSession(req, res).session.slackOauthState
  if (
    (req.query.error && req.query.error === 'access_denied') ||
    !req.query.state ||
    !state ||
    !areStringsEqual(req.query.state, state)
  ) {
    res.statusCode = 302
    res.setHeader('Location', `https://timezone-butler.now.sh`)
    res.end()
    return
  }

  const body: {
    team_id: string
    team_name: string
    bot: { bot_access_token: string; bot_user_id: string }
  } = await slackRequest.post(
    `oauth.access?code=${req.query.code}&client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}`
  )

  if (body.team_id && body.bot && body.bot.bot_access_token) {
    const team = await addTeam(body)
    console.log(`team added: ${team.teamId}`)
    res.statusCode = 302
    res.setHeader('Location', `/logged-in`)
    res.end()
  } else {
    console.log('error on slack oauth callback')
    console.log(body)
    throw new Error('error on slack oauth callback')
  }
}
