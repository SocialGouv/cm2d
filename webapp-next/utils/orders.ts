export const sortByOrder = (a: string, b: string, order: string[]): number => {
  if (!order) return 0;

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
export const departmentsOrder = [
  '75',
  'paris',
  '77',
  'seine-et-marne',
  '78',
  'yvelines',
  '91',
  'essonne',
  '92',
  'hauts-de-seine',
  '93',
  'seine-saint-denis',
  '94',
  'val-de-marne',
  '95',
  "val-d 'oise"
];

export const orders = {
  sex: sexOrder,
  death_location: deathLocationOrder,
  department: departmentsOrder
};
