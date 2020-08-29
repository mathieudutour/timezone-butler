import crypto from 'crypto'
import { NextApiResponse, NextApiRequest } from 'next'
import withSession from '../../utils/session'

export default async function slackDirectInstall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const state = crypto
    .randomBytes(Math.ceil(30 / 2))
    .toString('hex')
    .slice(0, 30)
  ;(await withSession(req, res)).session.slackOauthState = state
  res.redirect(
    302,
    `https://slack.com/oauth/v2/authorize?client_id=${
      process.env.SLACK_CLIENT_ID
    }&scope=app_mentions:read,channels:history,chat:write,commands,groups:history,groups:write,im:history,im:write,incoming-webhook,mpim:history,mpim:write,team:read,users:read&state=${state}${
      process.env.NODE_ENV === 'development'
        ? `&redirect_uri=${encodeURIComponent(
            'https://cecdf804ff6c.ngrok.io/api/oauth/slack'
          )}`
        : ''
    }`
  )
}
