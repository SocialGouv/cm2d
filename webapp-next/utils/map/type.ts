export type MapConfig = {
  // Clé = code département (doit matcher la propriété `code` du GeoJSON).
  state_specific: {
    [key: string]: {
      name: string;
      description: string;
      color: string;
      hover_color: string;
    };
  };
};
