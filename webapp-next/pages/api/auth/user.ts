import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {

    const userCm2dApiKey = req.cookies['cm2d_api_key'];

    if (!userCm2dApiKey) return res.status(401).end('Unauthorized');

    const client = new Client({
      node: process.env.ELASTIC_HOST,
      auth: {
        apiKey: userCm2dApiKey
      },
      tls: {
        ca: fs.readFileSync(
          path.resolve(process.cwd(), './../certificates/ca.crt')
        ),
        rejectUnauthorized: false
      }
    });

    try {
      const user = await client.security.authenticate();

      res.status(200).json(user);
    } catch (error) {
      res.status(401).end('Unauthorized');
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
