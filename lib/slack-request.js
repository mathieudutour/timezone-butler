const https = require('https')
const { text } = require('micro')
const crypto = require('crypto')
const timingSafeCompare = require('tsscmp')

const { SLACK_SIGNING_SECRET } = process.env

module.exports.verifyAndgetBody = async req => {
  // Request signature
  const signature = req.headers['x-slack-signature']
  // Request timestamp
  const ts = req.headers['x-slack-request-timestamp']

  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5

  if (ts < fiveMinutesAgo) {
    const error = new Error('Slack request signing verification failed')
    error.code = 'SLACKHTTPHANDLER_REQUEST_TIMELIMIT_FAILURE'
    throw error
  }

  // body
  const body = await text(req)

  if (!SLACK_SIGNING_SECRET) {
    try {
      return JSON.parse(body)
    } catch (err) {
      return body
    }
  }

  const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET)
  const [version, hash] = signature.split('=')
  hmac.update(`${version}:${ts}:${body}`)

  if (!timingSafeCompare(hash, hmac.digest('hex'))) {
    const error = new Error('Slack request signing verification failed')
    error.code = 'SLACKHTTPHANDLER_REQUEST_SIGNATURE_VERIFICATION_FAILURE'
    throw error
  }

  try {
    return JSON.parse(body)
  } catch (err) {
    return body
  }
}

module.exports.post = (path, token, payload) => {
  const postData = payload ? JSON.stringify(payload) : {}

  const options = {
    hostname: 'slack.com',
    port: 443,
    path: `/api/${path}`,
    method: 'POST',
    headers: {
      ...(payload
        ? {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': postData.length,
          }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }

  return new Promise((resolve, reject) => {
    let data = ''
    const req = https.request(options, res => {
      res.on('data', d => {
        data += d
      })

      res.on('end', () => {
        res.data = data
        try {
          res.body = JSON.parse(res.data)
        } catch (err) {
          res.body = {}
        }
        resolve(res)
      })
    })

    req.on('error', reject)

    if (payload) req.write(postData)
    req.end()
  })
}

module.exports.get = (path, token) => {
  const options = {
    hostname: 'slack.com',
    port: 443,
    path: `/api/${path}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return new Promise((resolve, reject) => {
    let data = ''
    const req = https.request(options, res => {
      res.on('data', d => {
        data += d
      })

      res.on('end', () => {
        res.data = data
        try {
          res.body = JSON.parse(res.data)
        } catch (err) {
          res.body = {}
        }
        resolve(res)
      })
    })

    req.on('error', reject)
    req.end()
  })
}

module.exports.getUsers = async (_token, _botId, cursor) => {
  let path = 'users.list'
  if (cursor) {
    path += `?cursor=${encodeURIComponent(cursor)}`
  }
  const { body } = await module.exports.get(path, _token)
  const members = body.members.reduce(
    (prev, member) => {
      if (
        member.deleted ||
        member.is_bot ||
        member.is_app_user ||
        member.id === 'USLACKBOT'
      ) {
        return prev
      }
      // eslint-disable-next-line no-param-reassign
      prev[member.id] = parseFloat(member.tz_offset)
      return prev
    },
    {
      _token,
      _botId,
    }
  )

  // paginate
  if (body.response_metadata && body.response_metadata.next_cursor) {
    const additionalMembers = await module.exports.getUsers(
      _token,
      _botId,
      body.response_metadata.next_cursor
    )

    Object.keys(additionalMembers).forEach(k => {
      members[k] = additionalMembers[k]
    })
  }

  return members
}
