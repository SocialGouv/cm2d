import { getLabelFromKey, isNC } from '../tools';

export const getMapProps = (
  id: string,
  datasets: { hits: any[]; total?: number }[]
) => {
  if (!datasets[0]) return '';

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
      .sort();
  }

  const stateColors = {
    GREEN: { initial: '#C6F6D5', hover: '#68D391' },
    BLUE: { initial: '#E9F1FF', hover: '#A7C4FD' },
    ORANGE: { initial: '#FEEBCB', hover: '#F8AB4E' },
    RED: { initial: '#FED7D7', hover: '#FC8181' },
    NEUTRAL: { initial: '#EDF2F7', hover: '#CBD5E0' }
  };

  const getCountFromKey = (key: number): number => {
    const hit = hits.find(h => h.key === key);
    return hit ? (isNC(hit.doc_count) ? 'NC' : hit.doc_count) : 0;
  };

  const getColorFromPercentage = (
    key: number,
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

  const getFullDescription = (key: number): string => {
    const hit = hits.find(h => h.key === key);
    if (!hit) return '';

    if (hit.children) {
      const totalCount = hit.children.reduce(
        (acc: number, child: any) =>
          acc + (isNC(child.doc_count) ? 0 : child.doc_count),
        0
      );

      return `Nombre de décès : ${totalCount ? totalCount : 'NC'}
			<div style="padding-left:10px;margin-top:2px">
				${availableKeys
          .map((key: any) => {
            const child = hit.children.find((c: any) => c.key === key);
            const label = getLabelFromKey(key);
            return `<div>${
              label.charAt(0).toUpperCase() + label.substring(1)
            } : ${
              !child || isNC(child.doc_count) ? 'NC' : child.doc_count
            }</div>`;
          })
          .join('')}
			</div>
			`;
    }

    return `Nombre de décès : ${getCountFromKey(key)}`;
  };

  const config = {
    main_settings: {
      //General settings
      width: 700,
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
    state_specific: {
      FRA5289: {
        name: 'Essonne',
        description: getFullDescription(91),
        color: getColorFromPercentage(91, 'initial'),
        hover_color: getColorFromPercentage(91, 'hover')
      },
      FRA5306: {
        name: 'Hauts-de-Seine',
        description: getFullDescription(92),
        color: getColorFromPercentage(92, 'initial'),
        hover_color: getColorFromPercentage(92, 'hover')
      },
      FRA5333: {
        name: 'Paris',
        description: getFullDescription(75),
        color: getColorFromPercentage(75, 'initial'),
        hover_color: getColorFromPercentage(75, 'hover')
      },
      FRA5342: {
        name: 'Seine-et-Marne',
        description: getFullDescription(77),
        color: getColorFromPercentage(77, 'initial'),
        hover_color: getColorFromPercentage(77, 'hover')
      },
      FRA5344: {
        name: 'Seine-Saint-Denis',
        description: getFullDescription(93),
        color: getColorFromPercentage(93, 'initial'),
        hover_color: getColorFromPercentage(93, 'hover')
      },
      FRA5349: {
        name: "Val-d'Oise",
        description: getFullDescription(95),
        color: getColorFromPercentage(95, 'initial'),
        hover_color: getColorFromPercentage(95, 'hover')
      },
      FRA5350: {
        name: 'Val-de-Marne',
        description: getFullDescription(94),
        color: getColorFromPercentage(94, 'initial'),
        hover_color: getColorFromPercentage(94, 'hover')
      },
      FRA5357: {
        name: 'Yvelines',
        description: getFullDescription(78),
        color: getColorFromPercentage(78, 'initial'),
        hover_color: getColorFromPercentage(78, 'hover')
      }
    },
    regions: {
      '0': {
        states: [
          'FRA5333',
          'FRA5342',
          'FRA5357',
          'FRA5289',
          'FRA5306',
          'FRA5344',
          'FRA5350',
          'FRA5349'
        ],
        name: 'Ile-de-France',
        zoomable: 'no'
      }
    }
  };

  return `var simplemaps_countrymap_mapdata=${JSON.stringify(config)}`;
};
