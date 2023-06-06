import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';
import {
  AggregationsAggregate,
  SearchResponseBody
} from '@elastic/elasticsearch/lib/api/types';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  result: SearchResponseBody<unknown, Record<string, AggregationsAggregate>>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const client = new Client({
    node: process.env.ELASTIC_HOST,
    auth: {
      apiKey: req.cookies.cm2d_api_key as string
    },
    tls: {
      ca: fs.readFileSync(path.resolve(process.cwd(), './../certificates/ca.crt')),
      rejectUnauthorized: false
    }
  });

  const index = (req.query.index as string) || 'cm2d_certificate';

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
}
