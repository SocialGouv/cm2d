export const getTitleGptPrompt = (json: string) => {
  return `
			Écris une phrase a l'indicatif qui va titrer mon graphique. 
			Elle ne doit pas faire plus de 120 caractères, mais peut faire moins. 
			La phrase doit commencer par une majuscule, mais ne met pas d'autres majuscule après la première lettre. 
			Ne met pas de point à la fin du titre.
			À la fin du titre, ajoute la periode de date à la fin : entre parenthèses, en toutes lettre en français mois et année en minuscule.

			Voici le contexte :
			- Mes données concernent des causes de décès, mon titre doit donc commencer par "Décès" ou "Nombre de décès" ou assimilé
			- L'utilisateur selectionne un ensemble de filtres, donc voici une explication : categories_level_1 est la ou les causes de décès, sex est le sexe des défunts, age est l'age des défunts, death_location est la zone institutionnelle du décès (domicile, hopital etc...)
			- Attention : ces filtres filtrent les résultats et ne sont pas un motif de distribution de la donnée.
			- Attention : lorsqu'il y des tranches d'ages différentes non continues, tu n'as pas le droit de résumé en une tranche. Si ces tranches d'age son continues, rapproche les pour n'en faire qu'une seule.

			Voici l'objet json contenant les filtres, rédige moi le titre adéquat : 
			${json}

			ta réponse doit contenir uniquement le titre que tu as imaginé sans guillemets
		`;
};
