import { Client } from '@elastic/elasticsearch';

const host: string = process.env.ELASTIC_HOST || '';

const connector = (): Client => {
  return new Client({
    node: host
  });
};

const testConn = (client: Client): void => {
  client
    .info()
    .then((response: any) => console.log(response))
    .catch((error: Error) => console.error(error));
};

export { connector, testConn };
