import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';
import { ELASTIC_API_KEY_NAME } from '@/utils/tools';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
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

    try {
      await adminClient.create({
        index: 'cm2d_users',
        id: req.body.username,
        document: {
          username: req.body.username,
          versionCGU: req.body.versionCGU
        }
      });

      res.status(200).json('OK');
    } catch (error) {
      res.status(401).end('Unauthorized');
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
