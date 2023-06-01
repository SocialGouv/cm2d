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
      username: 'elastic',
      password: process.env.ELASTIC_PASSWORD as string
    },
    tls: {
      ca: fs.readFileSync(path.resolve(process.cwd(), './../certificates/ca.crt')),
      rejectUnauthorized: false
    }
  });

  // Parse the filters, aggregations and index from the query parameters
  const filters = req.query.filters
    ? JSON.parse(req.query.filters as string)
    : [];
  const aggregations = req.query.aggregations
    ? JSON.parse(req.query.aggregations as string)
    : {};
  const index = (req.query.index as string) || 'cm2d_certificate'; // default to 'cm2d_certificate' if no index is provided

  const result = await client.search(
    {
      index: index,
      size: 100,
      track_total_hits: true,
      body: {
        query: {
          bool: {
            filter: filters
          }
        },
        aggs: aggregations
      }
    },
    { meta: true }
  );

  res.status(200).json({ result: result.body });
}
