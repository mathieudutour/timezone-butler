import { NextApiResponse, NextApiRequest } from 'next'
import Cors from 'cors'
import * as slackRequest from '../../../utils/slack-request'
import { addTeam } from '../../../utils/db'
import areStringsEqual from '../../../utils/are-strings-equal'
import withSession from '../../../utils/session'
import runMiddleware from '../../../utils/run-middleware'

const cors = Cors({
  methods: ['GET', 'HEAD'],
})

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)
  const state = (await withSession(req, res)).session.slackOauthState
  if (
    (req.query.error && req.query.error === 'access_denied') ||
    !req.query.state ||
    !state ||
    !areStringsEqual(req.query.state, state)
  ) {
    res.redirect(302, `https://timezone-butler.now.sh`)
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
    res.redirect(302, `/logged-in`)
  } else {
    console.log('error on slack oauth callback')
    console.log(body)
    throw new Error('error on slack oauth callback')
  }
}
