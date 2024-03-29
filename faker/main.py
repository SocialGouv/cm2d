import csv
import random
from faker import Faker
from datetime import date
import numpy as np

fake = Faker('fr_FR')

department_dict = {
    # IDF
    '75': ['Paris', 'Paris 2', 'Paris 3'],
    '77': ['Meaux', 'Chelles', 'Melun'],
    '78': ['Versailles', 'Yvelines', 'Rambouillet'],
    '91': ['Evry', 'Massy', 'Palaiseau'],
    '92': ['Nanterre', 'Boulogne-Billancourt', 'Colombes'],
    '93': ['Saint-Denis', 'Montreuil', 'Aubervilliers'],
    '94': ['Créteil', 'Vincennes', 'Ivry-sur-Seine'],
    '95': ['Cergy', 'Argenteuil', 'Sarcelles'],
    # NORMANDIE
    '14': ['a'],
    '27': ['a'],
    '50': ['a'],
    '61': ['a'],
    '76': ['a'],
    # NOUVELLE AQUITAINE
    '16': ['B'],
    '17': ['B'],
    '19': ['B'],
    '23': ['B'],
    '24': ['B'],
    '33': ['B'],
    '40': ['B'],
    '47': ['B'],
    '64': ['B'],
    '79': ['B'],
    '86': ['B'],
    '87': ['B'],
    # HAUTS DE FRANCE
    '02': ['c'],
    '59': ['c'],
    '60': ['c'],
    '62': ['c'],
    '80': ['c'],
}

category_1 = ['suicide', 'avc', 'cancer', 'tuberculose', 'thrombose']
category_2 = ['vih', 'tuberculose', 'diabete', 'avc', 'cancer']
category_associate = [
	'Maladies infectieuses intestinales à l’exception de la diarrhée',
	'Diarrhée et gastro-entérite d’origine infectieuse présumée',
	'Tuberculose',
	'Septicémie',
	'Maladie au virus de l’immunodéficience humaine [VIH]',
	'Cancer du colon, du rectum ou de l\'anus',
	'Cancer de la trachée, des bonches ou des poumons',
	'Cancer de la peau',
	'Cancer du sein',
	'Cancer de l\'utérus',
	'Cancer des ovaires',
	'Cancer de la prostate',
	'Cancer de la vessie',
	'Cancer primitif inconnu',
  'Diabète',
	'Hypercholestérolémie',
  'Démence',
	'Troubles mentaux et du comportement liés à l\'utilisation d\'alcool',
	'Troubles mentaux et du comportement liés à l\'utilisation de substances psychoactives',
	'Schizophrénie, troubles schizotypiques et délirants',
	'Troubles de l\'humeur [affectifs]',
  'Maladie d\'Alzheimer',
	'Sclérose en plaques',
	'Epilepsie',
	'Accidents ischémiques cérébraux transitoires et syndromes apparentés',
	'Maladies hypertensives',
	'Coronaropathie chronique',
	'Infarctus du myocarde',
	'Affections cardiopulmonaires dont les embolies pulmonaires',
	'Troubles de la conduction et arythmies cardiaques',
	'Insuffisance cardiaque',
	'Maladies cérébrovasculaires dont les avc',
	'Athérosclérose dont les aomi',
	'Insuffisance veineuse des membres inférieurs',
  'Infections aiguës des voies respiratoires supérieures et grippe',
	'Pneumonie',
	'Maladie pulmonaire obstructive chronique et bronchectasie, dont BPCO',
	'Asthme',
	'Covid',
  'Maladies de l\'appendice',
	'Maladie de Crohn et rectocolite hémorragique',
	'Iléus paralytique et occlusion intestinale sans hernie',
	'Maladie alcoolique du foie',
	'Lithiase biliaire',
	'Maladies du pancréas',
	'Avortement médicamenteux',
	'Complications de la grossesse principalement dans la période prénatale',
	'Complications de la grossesse principalement pendant le travail et l\'accouchement',
	'Accouchement spontané',
	'Complications principalement liées à la puerpéralité',
	'Troubles liés à une gestation courte et à un faible poids à la naissance',
	'Malformations congénitales, déformations et anomalies chromosomiques',
	'Douleurs abdominales et pelviennes',
	'Cause de décès inconnue',
	'Blessure intracrânienne',
	'Fracture du fémur',
	'Intoxications par des drogues, des médicaments et des substances biologiques et effets toxiques de substances principalement non médicinales quant à leur origine',
	'Complications des soins chirurgicaux et médicaux, non classées ailleurs',
	'Séquelles de blessures, d\'empoisonnement et d\'autres conséquences de causes externes'
]

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

total_weight = sum(weights)
weights = [weight / total_weight for weight in weights]

def get_multiple_values(category):
    if random.random() < 0.2:
        return random.choice(category)
    else:
        number_of_values = min(random.randint(2, 5), len(category))
        values = random.sample(category, number_of_values)
        return "; ".join(values)

with open('sample_data.csv', mode='w', newline='') as csv_file:
    fieldnames = ['categories_level_1', 'categories_level_2', 'categories_associate', 'age', 'kind', 'sex', 'death_location', 'home_location', 'home_department', 'department', 'coordinates', 'date']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

    writer.writeheader()

    for i in range(100000):
        row = {}
        row['categories_level_1'] = get_multiple_values(category_1)
        row['categories_level_2'] = get_multiple_values(category_2)
        row['categories_associate'] = get_multiple_values(category_associate)
        row['age'] = fake.random_int(min=0, max=100)
        row['kind'] = random.choice(['Electronique', 'Papier'])
        row['sex'] = random.choice(['homme', 'femme', 'indéterminé'])
        row['death_location'] = random.choice(death_locations)
        row['department'] = np.random.choice(departments, p=weights)  # Select department based on weights
        row['home_department'] = np.random.choice(departments, p=weights)  # Select department based on weights
        row['home_location'] = random.choice(department_dict[row['department']])
        row['coordinates'] = f"{fake.latitude()}, {fake.longitude()}"
        row['date'] = fake.date_between(start_date=date(2021, 1, 1), end_date=date(2023, 12, 31)).isoformat()

        writer.writerow(row)
