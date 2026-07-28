export type MapConfig = {
  // Détail par département (clé = code département), consommé par la carte
  // (react-simple-maps) et l'infobulle de survol (MapTooltip).
  state_specific: {
    [key: string]: {
      name: string;
      description: string;
      color: string;
      hover_color: string;
    };
  };
};
