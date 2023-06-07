export const sortByOrder = (a: string, b: string, order: string[]) => {
  const indexA = order.findIndex(label => a.toLowerCase().includes(label));
  const indexB = order.findIndex(label => b.toLowerCase().includes(label));

  if (indexA === -1 && indexB === -1) {
    return 0;
  } else if (indexA === -1) {
    return 1;
  } else if (indexB === -1) {
    return -1;
  }

  return indexA - indexB;
};

export const sexOrder = ['homme', 'femme', 'indéterminé'];
export const deathLocationOrder = [
  'domicile',
  'ehpad',
  'voie publique',
  'etablissement de santé public',
  'etablissement de santé privé',
  'etablissement pénitentiaire',
  'autre'
];
