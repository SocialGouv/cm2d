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
        ca: fs.readFileSync(path.resolve(process.cwd(), './certs/ca/ca.crt')),
        rejectUnauthorized: false
      }
    });

    try {
      const user = await client.security.authenticate();

      const adminClient = new Client({
        node: process.env.ELASTIC_HOST,
        auth: {
          username: process.env.ELASTIC_USERNAME as string,
          password: process.env.ELASTIC_PASSWORD as string
        },
        tls: {
          ca: fs.readFileSync(path.resolve(process.cwd(), './certs/ca/ca.crt')),
          rejectUnauthorized: false
        }
      });

      const userDetails = await adminClient.security.getUser({
        username: user.username
      });

      let roles: string[] = [];
      if (user.email && userDetails[user.email])
        roles = userDetails[user.email].roles;

      res.status(200).json({ ...user, roles });
    } catch (error) {
      res.status(401).end('Unauthorized');
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
