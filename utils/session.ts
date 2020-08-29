import CookieSession from 'cookie-session'
import { NextApiResponse, NextApiRequest } from 'next'
import runMiddleware from './run-middleware'

const cookieSession = CookieSession({
  name: 'slack-oauth-session',
  secret: process.env.COOKIES_SECRET,
  maxAge: 60000,
})

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiRequest & { session: { [key: string]: string } }> {
  await runMiddleware(req, res, cookieSession)
  // @ts-ignore
  return req
}
