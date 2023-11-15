export type MapConfig = {
  main_settings: {
    width: number;
    background_color: string;
    background_transparent: 'yes' | 'no';
    border_color: string;
    state_description: string;
    state_color: string;
    state_hover_color: string;
    state_url: string;
    border_size: number;
    all_states_inactive: 'yes' | 'no';
    all_states_zoomable: 'yes' | 'no';
    location_url: string;
    location_color: string;
    location_opacity: number;
    location_hover_opacity: number;
    location_size: number;
    location_type: string;
    location_image_source: string;
    location_border_color: string;
    location_border: number;
    location_hover_border: number;
    all_locations_inactive: 'yes' | 'no';
    all_locations_hidden: 'yes' | 'no';
    label_color: string;
    label_hover_color: string;
    label_size: number;
    label_font: string;
    hide_labels: 'yes' | 'no';
    hide_eastern_labels: 'yes' | 'no';
    zoom: 'yes' | 'no';
    manual_zoom: 'yes' | 'no';
    back_image: 'yes' | 'no';
    initial_back: 'yes' | 'no';
    initial_zoom: string;
    initial_zoom_solo: 'yes' | 'no';
    region_opacity: number;
    region_hover_opacity: number;
    zoom_out_incrementally: 'yes' | 'no';
    zoom_percentage: number;
    zoom_time: number;
    popup_color: string;
    popup_opacity: number;
    popup_shadow: number;
    popup_corners: number;
    popup_font: string;
    popup_nocss: 'yes' | 'no';
    div: any; // Should be replaced with the proper type, e.g., HTMLElement
    auto_load: 'yes' | 'no';
    url_new_tab: 'yes' | 'no';
    images_directory: string;
    fade_time: number;
    link_text: string;
    popups: string;
    state_image_url: string;
    state_image_position: string;
    location_image_url: string;
  };
  state_specific: {
    [key: string]: {
      name: string;
      description: string;
      color: string;
      hover_color: string;
    };
  };
  regions: {
    [key: string]: {
      states: string[];
      name: string;
      zoomable: 'yes' | 'no';
    };
  };
};
