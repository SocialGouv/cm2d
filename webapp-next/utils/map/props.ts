import { orders, sortByOrder } from '../orders';
import {
  capitalizeString,
  departmentRefs,
  departmentsCodes,
  getLabelFromKey,
  hexToRGB,
  isNC
} from '../tools';
import { MapConfig } from './type';

export const getMapProps = (
  id: string,
  datasets: { hits: any[]; total?: number }[],
  departments: string[],
  saveAggregateX?: string
): {
  config?: MapConfig;
  injectJs: string;
} => {
  if (!datasets[0]) return { injectJs: '' };

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

  const states: {
    [key: string]: {
      name: string;
      description: string;
      color: string;
      hover_color: string;
    };
  } = {};
  departments.forEach(d => {
    states[departmentsCodes[d.toString()]] = {
      name: `${departmentRefs[d.toString()]} (${getPercentage(d)})`,
      description: getFullDescription(d),
      color: getColorFromPercentage(d, 'initial'),
      hover_color: getColorFromPercentage(d, 'hover')
    };
  });

  const config: MapConfig = {
    main_settings: {
      //General settings
      width: 600,
      background_color: '#FFFFFF',
      background_transparent: 'yes',
      border_color: '#246CF9',

      //State defaults
      state_description: 'State description',
      state_color: '#88A4BC',
      state_hover_color: '#3B729F',
      state_url: '',

      border_size: 1.7,
      all_states_inactive: 'no',
      all_states_zoomable: 'yes',

      //Location defaults
      location_url: '',
      location_color: '#FF0067',
      location_opacity: 0.8,
      location_hover_opacity: 1,
      location_size: 25,
      location_type: 'square',
      location_image_source: 'frog.png',
      location_border_color: '#FFFFFF',
      location_border: 2,
      location_hover_border: 2.5,
      all_locations_inactive: 'no',
      all_locations_hidden: 'no',

      //Label defaults
      label_color: '#d5ddec',
      label_hover_color: '#d5ddec',
      label_size: 22,
      label_font: 'Arial',
      hide_labels: 'no',
      hide_eastern_labels: 'no',

      //Zoom settings
      zoom: 'no',
      manual_zoom: 'no',
      back_image: 'no',
      initial_back: 'no',
      initial_zoom: '0',
      initial_zoom_solo: 'yes',
      region_opacity: 1,
      region_hover_opacity: 0.6,
      zoom_out_incrementally: 'yes',
      zoom_percentage: 0.99,
      zoom_time: 0.5,

      //Popup settings
      popup_color: 'white',
      popup_opacity: 0.9,
      popup_shadow: 1,
      popup_corners: 5,
      popup_font: '12px/1.5 Verdana, Arial, Helvetica, sans-serif',
      popup_nocss: 'no',

      //Advanced settings
      div: id,
      auto_load: 'yes',
      url_new_tab: 'no',
      images_directory: 'default',
      fade_time: 0.1,
      link_text: 'View Website',
      popups: 'detect',
      state_image_url: '',
      state_image_position: '',
      location_image_url: ''
    },
    state_specific: states,
    regions: {
      '0': {
        states: Object.keys(states),
        name: '',
        zoomable: 'no'
      }
    }
  };

  return {
    config: config,
    injectJs: `var simplemaps_countrymap_mapdata=${JSON.stringify(config)}`
  };
};
