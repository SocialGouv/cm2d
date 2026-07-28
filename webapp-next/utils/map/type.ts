export type MapConfig = {
  // Détail par département (clé = code département), consommé par la carte
  // (react-simple-maps) et le panneau de détails (MapDetails).
  state_specific: {
    [key: string]: {
      name: string;
      description: string;
      color: string;
      hover_color: string;
    };
  };
};
