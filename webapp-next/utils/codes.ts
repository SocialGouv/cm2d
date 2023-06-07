import { SecurityGrantApiKeyResponse } from '@elastic/elasticsearch/lib/api/types';

let tmpCodes: {
  [key: string]: { code: string; apiKey: SecurityGrantApiKeyResponse };
} = {};

module.exports = tmpCodes;
