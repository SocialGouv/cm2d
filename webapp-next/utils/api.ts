import { stringify, parse as superJSONParse } from 'superjson';
import useSWR from 'swr';
import { Filters } from './cm2d-provider';
import { transformFilters } from './tools';

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

export function useDeathLocations() {
  const params = {
    index: 'cm2d_death_locations'
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

export function useDepartments() {
  const params = {
    index: 'cm2d_departments'
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

export function useData(filters: Filters, aggregations: any) {
  const params = {
    index: 'cm2d_certificate',
    filters: JSON.stringify(transformFilters(filters)),
    aggregations: JSON.stringify(aggregations)
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
