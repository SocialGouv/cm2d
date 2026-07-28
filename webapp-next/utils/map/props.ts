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

  const { hits, total } = datasets[0];

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

  const getCountFromKey = (key: string): number => {
    const hit = hits.find(h => h.key === key);
    // return hit ? (isNC(hit.doc_count) ? 'NC' : hit.doc_count) : 0;
    return hit ? hit.doc_count : 0;
  };

  const getPercentage = (key: string): string => {
    const hit = hits.find(h => h.key === key);
    if (!hit || !total) return '0%';
    // if (isNC(hit.doc_count)) return 'NC';
    return `${Math.round((hit.doc_count / total) * 10000) / 100}%`;
  };

  const getColorFromPercentage = (
    key: string,
    kind: 'initial' | 'hover'
  ): string => {
    const hit = hits.find(h => h.key === key);
    if (!hit || !total) return stateColors.NEUTRAL[kind];

    const percentage = hit.doc_count / total;
    if (percentage < 0.1) return stateColors.GREEN[kind];
    if (percentage < 0.2) return stateColors.BLUE[kind];
    if (percentage < 0.3) return stateColors.ORANGE[kind];
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
  // react-simple-maps (métropole + DROM), et alimente aussi MapDetails.
  const states: MapConfig['state_specific'] = {};
  departments.forEach(d => {
    states[d] = {
      name: `${departmentRefs[d] ?? d} (${getPercentage(d)})`,
      description: getFullDescription(d),
      color: getColorFromPercentage(d, 'initial'),
      hover_color: getColorFromPercentage(d, 'hover')
    };
  });

  return {
    config: { state_specific: states }
  };
};
