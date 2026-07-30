import { stringify, parse as superJSONParse } from 'superjson';
import useSWR from 'swr';
import { Filters } from './cm2d-provider';
import { transformFilters } from './tools';

export class FetchError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message || `Request failed with status ${status}`);
    this.name = 'FetchError';
    this.status = status;
  }
}

export function isSessionExpired(error: unknown): boolean {
  return error instanceof FetchError && (error.status === 401 || error.status === 403);
}

async function elkFetcher(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  // Sans ce garde, un 401/500 finissait parsé comme donnée et SWR ne remontait
  // aucune erreur → chargement infini côté /bo.
  if (!res.ok) {
    throw new FetchError(res.status);
  }
  return superJSONParse<any>(stringify(await res.json()));
}

export function useSexes() {
  const params = {
    index: 'cm2d_sexes'
  };

  const { data, error } = useSWR(
    `/api/elk/data?${new URLSearchParams(params)}`,
    elkFetcher
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
    `/api/elk/data?${new URLSearchParams(params)}`,
    elkFetcher
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
    `/api/elk/data?${new URLSearchParams(params)}`,
    elkFetcher
  );

  return {
    data,
    isError: error,
    isLoading: !error && !data
  };
}

export function useAssociateCauses() {
  const params = {
    index: 'cm2d_associate_categories'
  };

  const { data, error } = useSWR(
    `/api/elk/data?${new URLSearchParams(params)}`,
    elkFetcher
  );

  return {
    data,
    isError: error,
    isLoading: !error && !data
  };
}

export function useDepartments(departments: string[]) {
  const params = {
    index: 'cm2d_departments',
    filters: JSON.stringify({
      terms: {
        home_department: departments
      }
    })
  };

  const { data, error } = useSWR(
    `/api/elk/data?${new URLSearchParams(params)}`,
    elkFetcher
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
    `/api/elk/data?${new URLSearchParams(params)}`,
    elkFetcher
  );

  const paramsKind = {
    index: 'cm2d_certificate',
    filters: JSON.stringify(transformFilters(filters)),
    aggregations: JSON.stringify({
      aggregated_x: { terms: { field: 'kind', size: 100 } }
    })
  };
  const { data: dataKind, error: errorKind } = useSWR(
    `/api/elk/data?${new URLSearchParams(paramsKind)}`,
    elkFetcher
  );

  return {
    data,
    dataKind,
    isErrorKind: errorKind,
    isError: error,
    isLoading: !error && !data && !errorKind && !dataKind
  };
}
