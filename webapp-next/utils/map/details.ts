// Extrait les couples { label, value } de la description HTML d'un département
// (ex. `<div>Homme : 12</div>`), présents uniquement en mode stratifié.
// Utilisé par l'infobulle de la carte (MapTooltip) pour afficher la ventilation
// par valeur en mode stratifié.
export function extractDetailsValues(
  input: string
): { label: string; value: number }[] {
  const values: { label: string; value: number }[] = [];
  const regex = /<div>([^:]+)\s*:\s*(\d+)<\/div>/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    values.push({ label: match[1].trim(), value: parseInt(match[2], 10) });
  }

  return values;
}
