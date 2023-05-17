import csv
import random
from faker import Faker
from datetime import date

fake = Faker()

with open('sample_data.csv', mode='w', newline='') as csv_file:
    fieldnames = ['categories_level_1', 'categories_level_2', 'age', 'sex', 'death_location', 'home_location', 'coordinates', 'date']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

    writer.writeheader()

    for i in range(100000):
        row = {}
        row['categories_level_1'] = random.choice(['suicide', 'avc', 'cancer', 'tuberculose'])
        row['categories_level_2'] = random.choice(['vih', 'tuberculose', 'diabete'])
        row['age'] = fake.random_int(min=1, max=100)
        row['sex'] = random.choice(['homme', 'femme'])
        row['death_location'] = random.choice(['domicile', 'hopital', 'autre'])
        row['home_location'] = fake.city()
        row['coordinates'] = f"{fake.latitude()}, {fake.longitude()}"
        row['date'] = fake.date_between(start_date=date(2021, 1, 1), end_date=date(2023, 12, 31)).isoformat()

        writer.writerow(row)