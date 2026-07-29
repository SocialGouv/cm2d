import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';
import {
  AggregationsAggregate,
  SearchResponseBody
} from '@elastic/elasticsearch/lib/api/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { ELASTIC_API_KEY_NAME } from '@/utils/tools';

type Data =
  | {
      result: SearchResponseBody<unknown, Record<string, AggregationsAggregate>>;
    }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const client = new Client({
    node: process.env.ELASTIC_HOST,
    auth: {
      apiKey: req.cookies[ELASTIC_API_KEY_NAME] as string
    },
    tls: {
      ca: fs.readFileSync(path.resolve(process.cwd(), './certs/ca/ca.crt')),
      rejectUnauthorized: false
    }
  });

  const index = (req.query.index as string) || 'cm2d_certificate';

  try {
    const result = await client.search(
      {
        index: index,
        size: 1,
        sort: [
          {
            date: {
              order: 'asc'
            }
          }
        ]
      },
      { meta: true }
    );

    res.status(200).json({ result: result.body });
  } catch (error: any) {
    // Cf. api/elk/data.ts : key expirée → 401 propre au lieu d'un 500 non géré.
    const statusCode = error?.meta?.statusCode ?? error?.statusCode ?? 500;
    const is401 = statusCode === 401 || statusCode === 403;
    res
      .status(is401 ? 401 : 500)
      .json({ error: is401 ? 'Unauthorized' : 'Internal Server Error' });
  }
}
