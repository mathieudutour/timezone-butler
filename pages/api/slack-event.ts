import { verifyAndgetBody } from '../../utils/slack-request'
import { NextApiResponse, NextApiRequest } from 'next'
import handleSlackEvent from '../../bot/handle-slack-event'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function slackDirectInstall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = await verifyAndgetBody(req)
    res.send(await handleSlackEvent(body))
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send(err)
  }
}
