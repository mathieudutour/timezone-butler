import crypto from 'crypto'

export default function areStringsEqual(
  session: string | string[],
  query: string | string[]
) {
  const stateFromSlack = Buffer.from(query)
  const stateFromSession = Buffer.from(session)

  return (
    stateFromSlack.length === stateFromSession.length &&
    crypto.timingSafeEqual(stateFromSlack, stateFromSession)
  )
}
