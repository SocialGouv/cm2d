import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const client = new Client({
      node: process.env.ELASTIC_HOST,
      auth: {
        username,
        password
      },
      tls: {
        ca: fs.readFileSync(path.resolve(process.cwd(), './../certificates/ca.crt')),
        rejectUnauthorized: false
      }
    });

    try {
      await client.security.authenticate();

      const securityToken = await client.security.grantApiKey({
        grant_type: 'password',
        api_key: {
          name: "cm2d_api_key",
          expiration: "1d",
        },
        username,
        password
      })

      res.status(200).json(securityToken);
    } catch (error: any) {
      if (error.statusCode === 401) {
        res.status(401).end('Unauthorized')
      } else {
        console.log(error);
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
