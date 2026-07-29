// Source unique des régions/rôles, importée aussi par scripts/setup-elastic.ts.
// Ne doit AUCUNE dépendance React/Next : doit rester importable depuis un script
// Node autonome.

export type Region = { label: string; role: string; value: string[] };

export const REGIONS: Region[] = [
  {
    label: "Ile-de-France",
    role: "region-ile-de-france",
    value: ["75", "77", "78", "91", "92", "93", "94", "95"],
  },
  {
    label: "Normandie",
    role: "region-normandie",
    value: ["14", "27", "50", "61", "76"],
  },
  {
    label: "Nouvelle-Aquitaine",
    role: "region-nouvelle-aquitaine",
    value: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"],
  },
  {
    label: "Hauts-de-France",
    role: "region-hauts-de-france",
    value: ["02", "59", "60", "62", "80"],
  },
  {
    label: "Auvergne-Rhône-Alpes",
    role: "region-auverge-rhone-alpes",
    value: ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"],
  },
  {
    label: "Bourgogne-Franche-Comté",
    // Rôle en ASCII pur : Elasticsearch interdit les caractères non-ASCII (le
    // "é") dans les noms de rôle. Le label d'affichage conserve l'accent.
    role: "region-bourgogne-franche-comte",
    value: ["21", "25", "39", "58", "70", "71", "89", "90"],
  },
  {
    label: "Bretagne",
    role: "region-bretagne",
    value: ["22", "29", "35", "56"],
  },
  {
    label: "Centre-Val de Loire",
    role: "region-centre-val-de-loire",
    value: ["18", "28", "36", "37", "41", "45"],
  },
  { label: "Corse", role: "region-corse", value: ["2A", "2B"] },
  {
    label: "Grand Est",
    role: "region-grand-est",
    value: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
  },
  {
    label: "Occitanie",
    role: "region-occitanie",
    value: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"],
  },
  {
    label: "Pays de la Loire",
    role: "region-pays-de-la-loire",
    value: ["44", "49", "53", "72", "85"],
  },
  {
    label: "Provence-Alpes-Côte d'Azur",
    role: "region-provence-alpes-cote-dazur",
    value: ["04", "05", "06", "13", "83", "84"],
  },
  { label: "Guadeloupe", role: "region-guadeloupe", value: ["971"] },
  { label: "Martinique", role: "region-martinique", value: ["972"] },
  { label: "Guyane", role: "region-guyane", value: ["973"] },
  { label: "La Réunion", role: "region-la-reunion", value: ["974"] },
  { label: "Mayotte", role: "region-mayotte", value: ["976"] },
];

export const FRANCE_ENTIERE_ROLE = "region-france-entiere";

export const ALL_REGION_ROLES: string[] = [
  FRANCE_ENTIERE_ROLE,
  ...REGIONS.map((r) => r.role),
];
