import { Client } from '@elastic/elasticsearch';
import type { NextApiRequest, NextApiResponse } from 'next';
const tmpCodes = require('../../../utils/codes');
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const codeObj = tmpCodes[req.body.username];
    if (codeObj && codeObj.code === req.body.code.toString()) {
      let firstLogin = false;

      const client = new Client({
        node: process.env.ELASTIC_HOST,
        auth: {
          apiKey: codeObj.apiKey.encoded
        },
        tls: {
          ca: fs.readFileSync(path.resolve(process.cwd(), './certs/ca/ca.crt')),
          rejectUnauthorized: false
        }
      });

      try {
        await client.get({
          index: 'cm2d_users',
          id: req.body.username
        });
      } catch (e) {
        firstLogin = true;
      }

      res
        .status(200)
        .json({
          apiKey:
            firstLogin && process.env.NODE_ENV !== 'development'
              ? undefined
              : codeObj.apiKey,
          firstLogin
        });
    } else {
      res.status(401).end('Unauthorized');
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
