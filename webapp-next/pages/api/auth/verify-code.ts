import type { NextApiRequest, NextApiResponse } from 'next';
const tmpCodes = require('../../../utils/codes');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const codeObj = tmpCodes[req.body.username];
    if (codeObj && codeObj.code === req.body.code.toString()) {
      res.status(200).json(codeObj.apiKey);
    } else {
      res.status(401).end('Unauthorized');
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
