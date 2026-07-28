import { orders, sortByOrder } from '../orders';
import {
  capitalizeString,
  departmentRefs,
  getLabelFromKey,
  hexToRGB,
  isNC
} from '../tools';
import { MapConfig } from './type';

export const getMapProps = (
  datasets: { hits: any[]; total?: number }[],
  departments: string[],
  saveAggregateX?: string
): {
  config?: MapConfig;
} => {
  if (!datasets[0]) return {};

  const { hits } = datasets[0];

  let availableKeys: string[] = [];
  if (hits[0].children) {
    availableKeys = hits
      .reduce((acc: string[], h) => {
        h.children.forEach((c: any) => {
          if (acc.indexOf(c.key) === -1) {
            acc.push(c.key);
          }
        });
        return acc;
      }, [])
      .sort((a, b) =>
        sortByOrder(
          a.toString(),
          b.toString(),
          orders[
            (saveAggregateX as 'sex' | 'death_location' | 'department') || 'sex'
          ]
        )
      );
  }

  const stateColors = {
    GREEN: {
      initial: '#c9e7c8',
      hover: '#4daf4a'
    },
    BLUE: {
      initial: '#c3d8e9',
      hover: '#377eb8'
    },
    ORANGE: {
      initial: '#ffd8b2',
      hover: '#ff7f00'
    },
    RED: {
      initial: '#f6baba',
      hover: '#e41a1c'
    },
    NEUTRAL: {
      initial: '#e0e0e0',
      hover: '#999999'
    }
  };

  // Total de décès d'un département (somme des enfants en mode stratifié, sinon
  // doc_count). Sert à la fois à la colorimétrie et au calcul de la médiane.
  const getDeptTotal = (key: string): number => {
    const hit = hits.find(h => h.key === key);
    if (!hit) return 0;
    if (hit.children) {
      return hit.children.reduce(
        (acc: number, child: any) => acc + child.doc_count,
        0
      );
    }
    return hit.doc_count;
  };

  const getCountFromKey = (key: string): number => getDeptTotal(key);

  // Médiane des décès sur les départements affichés AYANT des données (>0).
  // Robuste aux outliers (ex. Paris) et non tirée vers le bas par les zéros.
  const sortedCounts = departments
    .map(getDeptTotal)
    .filter(c => c > 0)
    .sort((a, b) => a - b);
  const n = sortedCounts.length;
  const median = n
    ? n % 2
      ? sortedCounts[(n - 1) / 2]
      : (sortedCounts[n / 2 - 1] + sortedCounts[n / 2]) / 2
    : 0;

  // Colorimétrie ancrée sur la médiane : vert bien en dessous, bleu autour,
  // orange au dessus, rouge très au dessus. Sans données / médiane nulle → gris.
  const getColorFromCount = (
    key: string,
    kind: 'initial' | 'hover'
  ): string => {
    const count = getDeptTotal(key);
    if (!count || !median) return stateColors.NEUTRAL[kind];

    const ratio = count / median;
    if (ratio < 0.5) return stateColors.GREEN[kind];
    if (ratio < 1.5) return stateColors.BLUE[kind];
    if (ratio < 3) return stateColors.ORANGE[kind];
    return stateColors.RED[kind];
  };

  const getFullDescription = (key: string): string => {
    const hit = hits.find(h => h.key === key);
    if (!hit) return '';

    if (hit.children) {
      const totalCount = hit.children.reduce(
        (acc: number, child: any) =>
          // acc + (isNC(child.doc_count) ? 0 : child.doc_count),
          acc + child.doc_count,
        0
      );

      return `Nombre de décès : ${totalCount ? totalCount : 'NC'}
			<div style="padding-left:10px;margin-top:2px">
				${availableKeys
          .map((key: any) => {
            const child = hit.children.find((c: any) => c.key === key);
            const label = getLabelFromKey(key);
            return `<div>${capitalizeString(label)} : ${
              // !child || isNC(child.doc_count) ? 'NC' : child.doc_count
              child ? child.doc_count : 0
            }</div>`;
          })
          .join('')}
			</div>
			`;
    }

    return `Nombre de décès : ${getCountFromKey(key)}`;
  };

  // state_specific est désormais indexé par CODE DÉPARTEMENT (ex "75", "971"),
  // ce qui correspond à la propriété `code` des features GeoJSON rendues par
  // react-simple-maps (métropole + DROM), et alimente aussi l'infobulle (MapTooltip).
  const states: MapConfig['state_specific'] = {};
  departments.forEach(d => {
    states[d] = {
      name: departmentRefs[d] ?? d,
      description: getFullDescription(d),
      color: getColorFromCount(d, 'initial'),
      hover_color: getColorFromCount(d, 'hover')
    };
  });

  return {
    config: { state_specific: states }
  };
};
