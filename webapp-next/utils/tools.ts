import { Filters } from './filters-provider';

export function transformFilters(filters: Filters): any[] {
  const transformed: any[] = [];

  if (filters.categories_level_1.length > 0) {
    transformed.push({
      terms: {
        categories_level_1: filters.categories_level_1
      }
    });
  }

  if (filters.age.length > 0) {
    const ageShouldClauses = filters.age.map(age => ({
      range: {
        age: {
          gte: age.min,
          lte: age.max
        }
      }
    }));

    transformed.push({
      bool: {
        should: ageShouldClauses,
        minimum_should_match: 1
      }
    });
  }

  if (filters.sex.length > 0) {
    transformed.push({
      terms: {
        sex: filters.sex
      }
    });
  }

  return transformed;
}
