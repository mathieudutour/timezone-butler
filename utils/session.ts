import CookieSession from 'cookie-session'
import { NextApiResponse, NextApiRequest } from 'next'

const cookieSession = CookieSession({
  name: 'slack-oauth-session',
  secret: process.env.COOKIES_SECRET,
  maxAge: 60000,
})

export default function (
  req: NextApiRequest,
  res: NextApiResponse
): NextApiRequest & { session: { [key: string]: string } } {
  // @ts-ignore
  cookieSession(req, res, () => {})
  // @ts-ignore
  return req
}
