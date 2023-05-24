import csv
import random
from faker import Faker
from datetime import date

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

category_1 = ['suicide', 'avc', 'cancer', 'tuberculose']
category_2 = ['vih', 'tuberculose', 'diabete']

with open('sample_data.csv', mode='w', newline='') as csv_file:
    fieldnames = ['categories_level_1', 'categories_level_2', 'age', 'sex', 'death_location', 'home_location', 'department', 'coordinates', 'date']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

    writer.writeheader()

    for i in range(100000):
        row = {}
        row['categories_level_1'] = random.choice(category_1)
        row['categories_level_2'] = random.choice(category_2)
        row['age'] = fake.random_int(min=1, max=100)
        row['sex'] = random.choice(['homme', 'femme', 'indéterminé'])
        row['death_location'] = random.choice(['domicile', 'hopital', 'autre'])
        row['department'] = random.choice(list(department_dict.keys()))
        row['home_location'] = random.choice(department_dict[row['department']])
        row['coordinates'] = f"{fake.latitude()}, {fake.longitude()}"
        row['date'] = fake.date_between(start_date=date(2021, 1, 1), end_date=date(2023, 12, 31)).isoformat()

        writer.writerow(row)
