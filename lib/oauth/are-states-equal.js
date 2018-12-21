const crypto = require('crypto')

module.exports = (session, query) => {
  const stateFromSlack = Buffer.from(query)
  const stateFromSession = Buffer.from(session)

  return (
    stateFromSlack.length === stateFromSession.length &&
    crypto.timingSafeEqual(stateFromSlack, stateFromSession)
  )
}
