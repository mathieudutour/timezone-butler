import { verifyAndgetBody } from '../../utils/slack-request'
import { NextApiResponse, NextApiRequest } from 'next'
import handleSlackEvent from '../../bot/handle-slack-event'

export default async function slackDirectInstall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = await verifyAndgetBody(req)
  try {
    res.send(await handleSlackEvent(body))
  } catch (err) {
    res.statusCode = 500
    res.send(err)
  }
}
