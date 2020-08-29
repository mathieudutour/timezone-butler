import { NextApiResponse, NextApiRequest } from 'next'

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export default function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: any, res: any, cb: (result: Error | any) => void) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
