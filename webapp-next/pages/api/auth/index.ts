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
const tmpCodes = require('../../../utils/codes');

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
        res.status(401).end('Unauthorized');
      } else {
        console.log(error);
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
