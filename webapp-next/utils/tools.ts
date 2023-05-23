import { Filters, View } from './cm2d-provider';
import { format } from 'date-fns';

export const departmentRefs = {
  '75': 'Paris',
  '77': 'Seine-et-Marne',
  '78': 'Yvelines',
  '91': 'Essonne',
  '92': 'Hauts-de-Seine',
  '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne',
  '95': "Val-d'Oise"
};

const elkFields = [
  { value: 'sex', label: 'Sexe' },
  { value: 'age', label: 'Age' },
  { value: 'categories_level_1', label: 'Cause' },
  { value: 'categories_level_2', label: 'Comorbidité' },
  { value: 'death_location', label: 'Lieu de décès' },
  { value: 'department', label: 'Département' },
  { value: 'cert_type', label: 'Format' },
  { value: 'start_date', label: 'Période' },
  { value: 'end_date', label: 'Période' },
  { value: 'years', label: 'Années' },
  { value: 'months', label: 'Périodes' }
];

export function getLabelFromElkField(key: string): string {
  const match = elkFields.find(elkf => elkf.value === key);

  if (match) return match.label;

  return key;
}

export const getLabelFromKey = (key: string): string => {
  if (isStringContainingDate(key))
    return new Date(key).getFullYear().toString();

  if (key in departmentRefs)
    return `${departmentRefs[key as keyof typeof departmentRefs]} (${key})`;

  return key;
};

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

  if (filters.death_location.length > 0) {
    transformed.push({
      terms: {
        death_location: filters.death_location
      }
    });
  }

  if (filters.department.length > 0) {
    transformed.push({
      terms: {
        department: filters.department
      }
    });
  }

  if (filters.start_date && filters.end_date) {
    transformed.push({
      range: {
        date: {
          gte: filters.start_date,
          lte: filters.end_date
        }
      }
    });
  }

  return transformed;
}

export function getViewDatasets(data: any, view: View): any {
  if (view === 'line') {
    if (data.result.aggregations.aggregated_date) {
      return [{ hits: data.result.aggregations.aggregated_date.buckets }];
    } else if (data.result.aggregations.aggregated_parent) {
      return data.result.aggregations.aggregated_parent.buckets
        .map((apb: any) => ({
          hits: apb.aggregated_date.buckets,
          label: getLabelFromKey(apb.key)
        }))
        .filter((apb: any) => !!apb.hits.length);
    }
  }

  if (view === 'table') {
    if (
      data.result.aggregations.aggregated_x &&
      data.result.aggregations.aggregated_x.buckets[0].aggregated_y
    ) {
      return data.result.aggregations.aggregated_x.buckets
        .map((apb: any) => ({
          hits: apb.aggregated_y.buckets.filter((b: any) => !!b.doc_count),
          label: getLabelFromKey(apb.key)
        }))
        .filter((apb: any) => !!apb.hits.length);
    }
  }

  if (view === 'histogram') {
    if (data.result.aggregations.aggregated_x) {
      return [
        {
          hits: data.result.aggregations.aggregated_x.buckets.filter(
            (b: any) => !!b.doc_count
          )
        }
      ];
    }
  }
}

export function ISODateToMonthYear(isoDateString: string): string {
  const date = new Date(isoDateString);
  let month = date.getMonth() + 1; // Les mois sont indexés à partir de 0 en JavaScript
  const year = date.getFullYear();

  // Si le mois est un chiffre à un seul chiffre, ajoute un zéro devant
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  return `${monthStr}/${year}`;
}

export function dateToDayMonth(date: Date): string {
  const options = { day: '2-digit', month: 'long' };
  const formatter = new Intl.DateTimeFormat('fr-FR', options as any);
  const parts = formatter.formatToParts(date);
  const formattedDate = `${parts[2].value.trim()} ${parts[0].value.trim()}`;
  return formattedDate;
}

export function dateToMonthYear(date: Date): string {
  const options = { month: 'long', year: 'numeric' };
  const formatter = new Intl.DateTimeFormat('fr-FR', options as any);
  const formattedDate = formatter.format(date);
  return formattedDate;
}

export function dateToWeekYear(date: Date): string {
  const weekNumber: string = format(date, 'w');
  const year: string = format(date, 'yyyy');
  return `S${weekNumber} ${year}`;
}

export function getLastDayOfMonth(date: Date): Date {
  const year: number = date.getFullYear();
  const month: number = date.getMonth();
  const lastDay: Date = new Date(year, month + 1, 0);
  lastDay.setHours(23, 59, 0, 0);
  return lastDay;
}

const availableColors: string[] = [
  '#91B6FC',
  '#A0AEC0',
  '#F56565',
  '#FF943C',
  '#ECC94B',
  '#48BB78',
  '#38B2AC',
  '#4299E1',
  '#0BC5EA',
  '#9F7AEA',
  '#ED64A6'
];
export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
}

export function isStringContainingDate(str: string): boolean {
  // Attempt to parse the string as a date
  const date = new Date(str);

  // Check if the parsed date is valid
  if (!isNaN(date.getTime())) {
    // Check if the original string matches the parsed date
    const dateString = date.toDateString();
    const parsedDateString = new Date(dateString).toDateString();

    return dateString === parsedDateString && date.getFullYear() !== 1970;
  }

  return false;
}
