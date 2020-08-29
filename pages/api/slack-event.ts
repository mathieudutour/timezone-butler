import { NextApiResponse, NextApiRequest } from 'next'
import Cors from 'cors'
import { verifyAndGetBody } from '../../utils/slack-request'
import handleSlackEvent from '../../bot/handle-slack-event'
import runMiddleware from '../../utils/run-middleware'

export const config = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors({
  methods: ['POST', 'HEAD', 'OPTION'],
})

export default async function slackEventHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors)
  try {
    const body = await verifyAndGetBody(req)

    if (body.type === 'url_verification') {
      res.send(body.challenge)
      return
    }

    res.send(await handleSlackEvent(body))
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send(err)
  }
}
