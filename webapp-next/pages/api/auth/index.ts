import { generateCode, getCodeEmailHtml, ELASTIC_API_KEY_NAME } from '@/utils/tools';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
const tmpCodes = require('../../../utils/codes');
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2012-10-17' });

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
        ca: fs.readFileSync(
          path.resolve(process.cwd(), './../certificates/ca.crt')
        ),
        rejectUnauthorized: false
      }
    });

    try {
      await client.security.authenticate();

      const securityToken = await client.security.grantApiKey({
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

        await ses
          .sendEmail({
            Destination: {
              ToAddresses: [username]
            },
            Message: {
              Body: {
                Text: {
                  Data: `Code de vérification : ${tmpCodes[username].code}`
                },
                Html: { Data: getCodeEmailHtml(tmpCodes[username].code) }
              },
              Subject: {
                Data: `Votre code d\'authentification`
              }
            },
            Source: process.env.EMAIL_SOURCE as string
          })
          .promise();

        res.status(200).send({ response: 'ok' });
      }
    } catch (error: any) {
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
