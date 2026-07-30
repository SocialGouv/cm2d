// Re-parse la description HTML produite par getMapProps (couplage à surveiller).
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
