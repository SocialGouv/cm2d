import { ELASTIC_API_KEY_NAME } from '@/utils/tools';
import { Client, TransportResult } from '@elastic/elasticsearch';
import {
  AggregationsAggregate,
  SearchResponse,
  SearchResponseBody
} from '@elastic/elasticsearch/lib/api/types';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

type Data =
  | {
      result: SearchResponseBody<unknown, Record<string, AggregationsAggregate>>;
    }
  | { error: string };

// HANDLE ASSOCIATE CAUSES FILTER RESULT
const transformResult = (
  result: TransportResult<
    SearchResponse<unknown, Record<string, AggregationsAggregate>>,
    unknown
  >,
  aggregations: any,
  filters: any
): TransportResult<
  SearchResponse<unknown, Record<string, AggregationsAggregate>>,
  unknown
> => {
  let tmpResult = result;
  if (aggregations.aggregated_x?.terms?.field === 'categories_associate') {
    filters.forEach((filter: any) => {
      const filterCategoriesAssociate = filter.bool?.should
        ?.filter(
          (should: any) =>
            !!(should.match && should.match['categories_associate'])
        )
        .map((r: any) => r.match['categories_associate']) as any[];

      if (filterCategoriesAssociate && !!filterCategoriesAssociate.length) {
        const responseAggregateX: any = result.body.aggregations?.aggregated_x;
        if (responseAggregateX) {
          tmpResult = {
            ...result,
            body: {
              ...result.body,
              aggregations: {
                ...result.body.aggregations,
                aggregated_x: {
                  buckets: responseAggregateX.buckets?.filter((bucket: any) => {
                    return filterCategoriesAssociate.includes(bucket.key);
                  })
                }
              }
            }
          };
        }
      }
    });
  }
  return tmpResult;
};

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

  // Parse the filters, aggregations and index from the query parameters
  const filters = req.query.filters
    ? JSON.parse(req.query.filters as string)
    : [];
  const aggregations = req.query.aggregations
    ? JSON.parse(req.query.aggregations as string)
    : {};
  const index = (req.query.index as string) || 'cm2d_certificate'; // default to 'cm2d_certificate' if no index is provided

  try {
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

    res
      .status(200)
      .json({ result: transformResult(result, aggregations, filters).body });
  } catch (error: any) {
    // API key expirée / invalide → ES renvoie 401. On propage ce 401 tel quel
    // pour que le client distingue "session expirée" d'une erreur serveur, au
    // lieu d'un 500 non géré qui laissait la page en chargement infini.
    const statusCode = error?.meta?.statusCode ?? error?.statusCode ?? 500;
    res
      .status(statusCode === 401 || statusCode === 403 ? 401 : 500)
      .json({ error: statusCode === 401 || statusCode === 403 ? 'Unauthorized' : 'Internal Server Error' });
  }
}
