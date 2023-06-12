import csv
import random
from faker import Faker
from datetime import date
import numpy as np

fake = Faker('fr_FR')

department_dict = {
    '75': ['Paris', 'Paris 2', 'Paris 3'],
    '77': ['Meaux', 'Chelles', 'Melun'],
    '78': ['Versailles', 'Yvelines', 'Rambouillet'],
    '91': ['Evry', 'Massy', 'Palaiseau'],
    '92': ['Nanterre', 'Boulogne-Billancourt', 'Colombes'],
    '93': ['Saint-Denis', 'Montreuil', 'Aubervilliers'],
    '94': ['Créteil', 'Vincennes', 'Ivry-sur-Seine'],
    '95': ['Cergy', 'Argenteuil', 'Sarcelles'],
}

category_1 = ['suicide', 'avc', 'cancer', 'tuberculose', 'trombose']
category_2 = ['vih', 'tuberculose', 'diabete', 'avc', 'cancer']
death_locations = [
  'Domicile',
  'EHPAD, Maison de retraite',
  'Voie publique',
  'Etablissement de santé public',
  'Etablissement de santé privé',
  'Etablissement pénitentiaire',
  'Autre lieu ou indéterminé'
]

# Maintain a list of departments for random choice
departments = list(department_dict.keys())

# Add weighted probabilities for departments
weights = [0.15 if dept == '75' else 0.4 if dept == '77' else 0.2 if dept == '95' else 0.05 for dept in departments]

def get_multiple_values(category):
    if random.random() < 0.2:
        return random.choice(category)
    else:
        number_of_values = min(random.randint(2, 5), len(category))
        values = random.sample(category, number_of_values)
        return ", ".join(values)

with open('sample_data.csv', mode='w', newline='') as csv_file:
    fieldnames = ['categories_level_1', 'categories_level_2', 'age', 'kind', 'sex', 'death_location', 'home_location', 'department', 'coordinates', 'date']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

    writer.writeheader()

    for i in range(100000):
        row = {}
        row['categories_level_1'] = get_multiple_values(category_1)
        row['categories_level_2'] = get_multiple_values(category_2)
        row['age'] = fake.random_int(min=1, max=100)
        row['kind'] = random.choice(['Electronique', 'Papier'])
        row['sex'] = random.choice(['homme', 'femme', 'indéterminé'])
        row['death_location'] = random.choice(death_locations)
        row['department'] = np.random.choice(departments, p=weights)  # Select department based on weights
        row['home_location'] = random.choice(department_dict[row['department']])
        row['coordinates'] = f"{fake.latitude()}, {fake.longitude()}"
        row['date'] = fake.date_between(start_date=date(2021, 1, 1), end_date=date(2023, 12, 31)).isoformat()

        writer.writerow(row)
