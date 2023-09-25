import { sendMail } from '@/utils/mailter';
import {
  generateCode,
  getCodeEmailHtml,
  ELASTIC_API_KEY_NAME
} from '@/utils/tools';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import rateLimit from '@/utils/rate-limit';
const tmpCodes = require('../../../utils/codes');

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 50 // Max 50 users per second
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const forwarded = req.headers['x-forwarded-for'];

    const userIp =
      typeof forwarded === 'string'
        ? forwarded.split(/, /)[0]
        : req.socket.remoteAddress;

    // Rate limiting to prevent brute force auth
    await limiter.check(res, 5, userIp as string); // 5 requests max per minute

    const client = new Client({
      node: process.env.ELASTIC_HOST,
      auth: {
        username,
        password
      },
      tls: {
        ca: fs.readFileSync(path.resolve(process.cwd(), './certs/ca/ca.crt')),
        rejectUnauthorized: false
      }
    });

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
      await client.security.authenticate();

      const securityToken = await adminClient.security.grantApiKey({
        grant_type: 'password',
        api_key: {
          name: ELASTIC_API_KEY_NAME,
          expiration: '1d'
        },
        username,
        password
      });

      if (process.env.NODE_ENV === 'development') {
        res.status(200).json(securityToken);
      } else {
        tmpCodes[username] = { code: generateCode(), apiKey: securityToken };

        await sendMail(
          "Votre code d'authentification",
          username,
          getCodeEmailHtml(tmpCodes[username].code),
          `Code de vérification : ${tmpCodes[username].code}`
        );

        res.status(200).send({ response: 'ok' });
      }
    } catch (error: any) {
      console.log(error);
      if (error.statusCode === 401) {
        res.status(401).end();
      } else {
        res.status(500).end();
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
