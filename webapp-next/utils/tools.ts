import { Filters, SearchCategory, View } from './cm2d-provider';
import { format } from 'date-fns';
import moment from 'moment';

export const viewRefs: { label: string; value: View }[] = [
  { label: 'Vue courbe', value: 'line' },
  { label: 'Vue carte', value: 'map' },
  { label: 'Vue histogramme', value: 'histogram' },
  { label: 'Vue donut', value: 'doughnut' },
  { label: 'Vue tableau', value: 'table' }
];

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
  { value: 'categories', label: 'Cause' },
  { value: 'categories_associate', label: 'Cause associée' },
  { value: 'categories_level_2', label: 'Comorbidité' },
  { value: 'death_location', label: 'Lieu de décès' },
  { value: 'department', label: 'Département' },
  { value: 'cert_type', label: 'Format' },
  { value: 'start_date', label: 'Période' },
  { value: 'end_date', label: 'Période' },
  { value: 'years', label: 'Année' },
  { value: 'months', label: 'Mois' }
];

export function getLabelFromElkField(key: string): string {
  const match = elkFields.find(elkf => elkf.value === key);

  if (match) return match.label;

  return key;
}

export const getLabelFromKey = (
  key: string,
  dateFormat: 'year' | 'month' | 'week' = 'year'
): string => {
  if (key in departmentRefs)
    return `${departmentRefs[key as keyof typeof departmentRefs]} (${key})`;

  if (isStringContainingDate(key)) {
    if (dateFormat === 'year')
      return capitalizeString(new Date(key).getFullYear().toString());
    if (dateFormat === 'week')
      return capitalizeString(dateToWeekYear(new Date(key)));
    if (dateFormat === 'month')
      return capitalizeString(dateToMonthYear(new Date(key)));
  }

  return capitalizeString(key);
};

export function hasAtLeastOneFilter(filters: Filters): boolean {
  return (
    !!filters.sex.length ||
    !!filters.death_location.length ||
    !!filters.department.length ||
    !!filters.age.length
  );
}

export function transformFilters(filters: Filters): any[] {
  const transformed: any[] = [];

  if (filters.categories.length > 0) {
    switch (filters.categories_search) {
      case 'full':
        transformed.push({
          bool: {
            should: [
              {
                terms: {
                  categories_level_1: filters.categories
                }
              },
              {
                terms: {
                  categories_level_2: filters.categories
                }
              }
            ],
            minimum_should_match: 1
          }
        });
        break;
      case 'category_1':
        transformed.push({
          terms: {
            categories_level_1: filters.categories
          }
        });
        break;
      case 'category_2':
        transformed.push({
          terms: {
            categories_level_2: filters.categories
          }
        });
        break;
    }
  }

  if (filters.categories_associate.length > 0) {
    transformed.push({
      bool: {
        should: filters.categories_associate.map(ca => {
          return {
            match: {
              categories_associate: ca
            }
          };
        }),
        minimum_should_match: 1
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

export function isNC(count: number): boolean {
  const minimumForNC = 5;
  return count !== 0 && count <= minimumForNC;
}

export type Datasets = { hits: any[]; label?: string; total?: number };

export function getCSVDataFromDatasets(
  datasets: Datasets[],
  view: View
): string[][] {
  let csvData: string[][] = [];
  if (!datasets.length) return csvData;

  if (datasets.length === 1) {
    csvData.push(
      datasets[0].hits.map(hit => {
        return getLabelFromKey(
          hit.key,
          view === 'line' ? 'week' : view === 'table' ? 'month' : 'year'
        );
      })
    );
    csvData.push(
      datasets[0].hits.map(hit => {
        return hit.doc_count;
      })
    );
  } else {
    csvData.push([
      '',
      ...datasets[0].hits.map(h =>
        getLabelFromKey(
          h.key,
          view === 'line' ? 'week' : view === 'table' ? 'month' : 'year'
        )
      )
    ]);
    datasets.forEach(ds => {
      csvData.push([ds.label, ...ds.hits.map(h => h.doc_count)]);
    });
  }

  return csvData;
}

export function getViewDatasets(data: any, view: View): Datasets[] {
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
      !!data.result.aggregations.aggregated_x.buckets.length &&
      data.result.aggregations.aggregated_x.buckets[0].aggregated_y
    ) {
      return data.result.aggregations.aggregated_x.buckets
        .map((apb: any) => ({
          hits: apb.aggregated_y.buckets.filter((b: any) => !!b.doc_count),
          label: getLabelFromKey(apb.key, 'month')
        }))
        .filter((apb: any) => !!apb.hits.length);
    }
  }

  if (view === 'histogram' || view === 'doughnut') {
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

  if (view === 'map') {
    if (data.result.aggregations.aggregated_x) {
      return [
        {
          hits: data.result.aggregations.aggregated_x.buckets
            .filter((b: any) => !!b.doc_count)
            .map((x: any) =>
              x.aggregated_y
                ? {
                    key: x.key,
                    doc_count: x.doc_count,
                    children: x.aggregated_y.buckets.filter(
                      (y: any) => !!y.doc_count
                    )
                  }
                : x
            ),
          total: data.result.aggregations.aggregated_x.buckets.reduce(
            (acc: number, b: any) => acc + b.doc_count,
            0
          )
        }
      ];
    }
  }

  return [];
}

export function getDefaultField<T extends string | undefined>(
  pile: string[],
  isValid: (field?: string) => field is T,
  defaultField: T,
  indexToCheck: number = -1
): T {
  const lastField = pile.at(indexToCheck);
  if (lastField && isValid(lastField)) return lastField as T;

  return defaultField;
}

export function concatAdditionnalFields<T extends string | undefined>(
  availableFields: { label: string; value: T }[],
  categories_search: SearchCategory,
  categories_associate: string[]
): { label: string; value: T }[] {
  if (categories_search === 'full' && categories_associate.length > 1) {
    return [
      ...availableFields,
      {
        label: 'Cause associée',
        value: 'categories_associate' as T
      }
    ];
  } else {
    return availableFields;
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

export function isRangeContainsLastSixMonths(
  startDate?: string,
  endDate?: string
): boolean {
  if (!startDate) return true;

  const now = moment();
  const sixMonthsAgo = moment().subtract(6, 'months');

  const start = new Date(startDate);
  let end;

  if (!endDate) {
    end = now.toDate();
  } else {
    end = new Date(endDate);
  }

  const startMoment = moment(start);
  const endMoment = moment(end);

  return (
    (startMoment.isSameOrBefore(sixMonthsAgo) &&
      endMoment.isSameOrAfter(sixMonthsAgo)) ||
    (startMoment.isAfter(sixMonthsAgo) && startMoment.isSameOrBefore(now))
  );
}

export function getSixMonthAgoDate() {
  return moment().subtract(6, 'months').format('DD/MM/YYYY');
}

export function generateCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000);

  return code.toString();
}

export function getCodeEmailHtml(code: string) {
  return `
		<!DOCTYPE html>
		<html>
			<head>
				<style>
					body {
						font-family: Arial, sans-serif;
					}
					.container {
						max-width: 600px;
						margin: 0 auto;
						padding: 20px;
					}
					.code {
						font-size: 24px;
						font-weight: bold;
						margin: 20px 0;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<p>Bonjour,</p>

					<p>
						Vous vous êtes récemment connecté(e) à votre compte CM2D. Pour terminer le processus, 
						veuillez entrer le code de vérification suivant dans le formulaire de connexion :
					</p>

					<p class="code">${code}</p>

					<p>
						Ce code est valable pour les 10 prochaines minutes. Si vous n'avez pas demandé ce
						code, veuillez ignorer cet e-mail.
					</p>

					<p>
						Merci,<br/>
						L'équipe CM2D
					</p>
				</div>
			</body>
		</html>
	`;
}

export function capitalizeString(str: string): string {
  if (str.length <= 1) return str;

  return str.toString().charAt(0).toUpperCase() + str.toString().substring(1);
}

export function addMissingSizes(obj: any, size: number): any {
  if (typeof obj === 'object') {
    if (obj.terms && obj.terms.field === 'categories_associate') {
      return {
        ...obj,
        terms: {
          ...obj.terms,
          size: size
        }
      };
    }
    const newObj: typeof obj = {};
    if (!Array.isArray(obj)) {
      for (const key in obj) {
        newObj[key] = addMissingSizes(obj[key], size);
      }
      return newObj;
    } else {
      return obj;
    }
  }
  return obj;
}

export function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const ELASTIC_API_KEY_NAME =
  (process.env.NEXT_PUBLIC_ELASTIC_API_KEY_NAME as string) || 'cm2d_api_key';
