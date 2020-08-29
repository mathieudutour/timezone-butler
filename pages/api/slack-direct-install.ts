import crypto from 'crypto'
import { NextApiResponse, NextApiRequest } from 'next'
import withSession from '../../utils/session'

export default function slackDirectInstall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const state = crypto
    .randomBytes(Math.ceil(30 / 2))
    .toString('hex')
    .slice(0, 30)
  withSession(req, res).session.slackOauthState = state
  res.statusCode = 302
  res.setHeader(
    'Location',
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
  res.end()
}
