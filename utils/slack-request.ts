import https from 'https'
import crypto from 'crypto'
import { NextApiRequest } from 'next'
import areStringsEqual from './are-strings-equal'

const { SLACK_SIGNING_SECRET } = process.env

export type Team = { [id: string]: number } & { _token: string; _botId: string }

export const verifyAndgetBody = async (req: NextApiRequest) => {
  // Request signature
  const signature = req.headers['x-slack-signature']
  // Request timestamp
  const ts = req.headers['x-slack-request-timestamp']

  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5

  if (
    typeof ts !== 'string' ||
    parseInt(ts) < fiveMinutesAgo ||
    !signature ||
    typeof signature !== 'string'
  ) {
    const error = new Error('Slack request signing verification failed')
    // error.code = 'SLACKHTTPHANDLER_REQUEST_TIMELIMIT_FAILURE'
    throw error
  }

  if (!SLACK_SIGNING_SECRET) {
    return req.body
  }

  console.log(req.body)

  const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET)
  const [version, hash] = signature.split('=')
  hmac.update(`${version}:${ts}:${JSON.stringify(req.body)}`)

  if (!areStringsEqual(hash, hmac.digest('hex'))) {
    const error = new Error('Slack request signing verification failed')
    // error.code = 'SLACKHTTPHANDLER_REQUEST_SIGNATURE_VERIFICATION_FAILURE'
    throw error
  }

  return req.body
}

export const post = <T>(
  path: string,
  token?: string,
  payload?: any
): Promise<T> => {
  const postData = payload ? JSON.stringify(payload) : ''

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
    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        data += d
      })

      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (err) {
          reject(err)
        }
      })
    })

    req.on('error', reject)

    if (payload) req.write(postData)
    req.end()
  })
}

export const get = <T>(path: string, token: string): Promise<T> => {
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
    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        data += d
      })

      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (err) {
          reject(err)
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

export const getUsers = async (
  _token: string,
  _botId: string,
  cursor?: any
) => {
  let path = 'users.list'
  if (cursor) {
    path += `?cursor=${encodeURIComponent(cursor)}`
  }
  const body: {
    members: {
      deleted?: boolean
      is_bot?: boolean
      is_app_user?: boolean
      id: string
      tz_offset: string
    }[]
    response_metadata?: { next_cursor?: any }
  } = await get(path, _token)
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
    } as Team
  )

  // paginate
  if (body.response_metadata && body.response_metadata.next_cursor) {
    const additionalMembers = await getUsers(
      _token,
      _botId,
      body.response_metadata.next_cursor
    )

    Object.keys(additionalMembers).forEach((k) => {
      members[k] = additionalMembers[k]
    })
  }

  return members
}

export const getUserInfo = async (_token: string, userId: string) => {
  const body: { user: any } = await get(
    `users.info?user=${userId}&include_locale=true`,
    _token
  )

  return body.user
}
