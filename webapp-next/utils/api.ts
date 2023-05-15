import useSWR from 'swr';
import { parse as superJSONParse, stringify } from 'superjson';

export function useSexes() {
  const params = {
    index: 'cm2d_sexes'
  };

  const { data, error } = useSWR(
    `/api/elk?${new URLSearchParams(params)}`,
    async function (input: RequestInfo, init?: RequestInit) {
      const res = await fetch(input, init);
      return superJSONParse<any>(stringify(await res.json()));
    }
  );

  return {
    data,
    isError: error,
    isLoading: !error && !data
  };
}

export function useCauses() {
  const params = {
    index: 'cm2d_level_1_categories'
  };

  const { data, error } = useSWR(
    `/api/elk?${new URLSearchParams(params)}`,
    async function (input: RequestInfo, init?: RequestInit) {
      const res = await fetch(input, init);
      return superJSONParse<any>(stringify(await res.json()));
    }
  );

  return {
    data,
    isError: error,
    isLoading: !error && !data
  };
}
