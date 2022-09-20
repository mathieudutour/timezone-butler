import crypto from 'crypto'

export default function areStringsEqual(
  session: string | string[],
  query: string | string[]
): boolean {
  if (Array.isArray(session)) {
    return session.every((session) => areStringsEqual(session, query))
  }

  if (Array.isArray(query)) {
    return query.every((query) => areStringsEqual(session, query))
  }

  const stateFromSlack = Buffer.from(query)
  const stateFromSession = Buffer.from(session)

  return (
    stateFromSlack.length === stateFromSession.length &&
    crypto.timingSafeEqual(stateFromSlack, stateFromSession)
  )
}
