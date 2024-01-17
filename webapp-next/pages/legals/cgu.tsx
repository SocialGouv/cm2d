import { LegalLinks } from "@/components/legals/LegalLinks";
import {
  Box,
  Container,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

export default function CGU() {
  return (
    <Container maxW="container.lg" my={10} lineHeight="taller">
      <LegalLinks />
      <Box mb={24}>
        <Heading mb={6}>Conditions générales d&apos;utilisation</Heading>
        <ContentCGU />
      </Box>
    </Container>
  );
}

export const ContentCGU = () => (
  <>
    <Text>
      Les présentes conditions générales d’utilisation (dites « CGU ») fixent le
      cadre juridique de la Plateforme « Cause médicales de décès » et
      définissent les conditions d’accès et d’utilisation des services par
      l’Utilisateur.
    </Text>
    <Heading size="md" as="h3" mt={4} mb={2.5}>
      Article 1 - Champ d’application
    </Heading>
    <Text>
      Le service est ouvert à toute personne habilitée au sein des Agences
      Régionales de Santé à accéder aux données relatives aux causes de décès,
      conformément aux articles L.1461-3 du code de la santé publique et
      L.2223-42 du code général des collectivités territoriales. Les personnes
      ont accès au service via un compte dédié.
    </Text>
    <Heading size="md" as="h3" mt={4} mb={2.5}>
      Article 2 – Objet
    </Heading>
    <Text>
      Le service numérique poursuit l’objectif de permettre aux agents des
      Agence régionales de santé, pour des motifs de santé publique, d’évaluer
      et orienter leurs actions en facilitant l’accès et l’interprétation des
      données de mortalité. Il participe également à l’aide à la décision et
      l’évaluation dans le domaine de la veille et la sécurité sanitaires, la
      définition, le financement et l’évaluation des actions de prévention et de
      promotion de la santé, l’anticipation, la préparation et la gestion des
      crises sanitaires.
    </Text>
    <Heading size="md" as="h3" mt={4} mb={2.5}>
      Article 3 – Définitions
    </Heading>
    <Text>
      « L’Administrateur » : est un agent de l’Agence régionale de Santé
      exerçant au sein de la DIRECTION DE L’INNOVATION, DE LA RECHERCHE ET DE LA
      TRANSFORMATION NUMERIQUE (DIRNOV).
    </Text>
    <Text mt={3}>
      « L’Utilisateur » : est tout agent habilité d’une Agence régionale de
      Santé
    </Text>
    <Text mt={3}>
      Données de cause médicale de décès : sont les informations comprises dans
      les certificats désignés par l’article L.2223-42 du code général des
      collectivités territoriales.
    </Text>
    <Text mt={3}>
      Services : sont l’ensemble des services proposés par l’application «
      Causes médicales de décès ».
    </Text>
    <Heading size="md" as="h3" mt={4} mb={2.5}>
      Article 4 - Fonctionnalités
    </Heading>
    <Heading size="sm" as="h3" mt={4} mb={2.5}>
      A – Création du compte
    </Heading>
    <Text>
      La création du compte est autorisée par un administrateur, désigné par
      l’Agence Régionale de Santé. Celui-ci se connecte via un login mot de
      passe qui lui a été communiqué par l’administrateur. Une fois ces
      informations inscrites, un code secret de validation est envoyée par
      e-mail et doit être utilisé dans un temps imparti de 30 secondes.
    </Text>
    <Heading size="sm" as="h3" mt={4} mb={2.5}>
      B – Autres fonctionnalités
    </Heading>
    <Heading size="xs" as="h3" mt={4} mb={2.5}>
      1 – Visualisation des informations figurant sur les certificats de causes
      de décès
    </Heading>
    <Text>
      Le service permet à l’Utilisateur de filtrer ses recherches en fonction de
      plusieurs critères pertinents pour les missions des agents de l’Agence
      régionale de Santé en entrant une « cause de décès » :
    </Text>
    <List ml={8} my={3}>
      <ListItem>- Types de décès, via la partie cause de décès</ListItem>
      <ListItem>- Lieu</ListItem>
      <ListItem>- Données socio-démographiques</ListItem>
      <ListItem>- Semestre via la partie période</ListItem>
    </List>
    <Text>
      L’Utilisateur peut également avoir accès aux autres informations contenues
      sur le certificat de causes de décès. Il peut également établir et
      recevoir des listes de recherches favorites.
    </Text>
    <Heading size="xs" as="h3" mt={4} mb={2.5}>
      2 – Export des informations
    </Heading>
    <Text>
      L’Utilisateur peut exporter les informations contenues dans le service, en
      cliquant sur le bouton « Export ». Il s’engage à ne pas exporter des
      informations dans un environnement non sécurisé ou permettant la
      réidentification des personnes par des personnes non habilitées.
    </Text>
    <Heading size="md" as="h3" mt={4} mb={2.5}>
      Article 5 - Responsabilités
    </Heading>
    <Heading size="sm" as="h3" mt={4} mb={2.5}>
      5.1 L’éditeur
    </Heading>
    <Text>
      Les sources des informations diffusées sur la Plateforme sont réputées
      fiables mais le site ne garantit pas qu’il soit exempt de défauts,
      d’erreurs ou d’omissions.
    </Text>
    <Text mt={3}>
      L’éditeur s&apos;autorise à suspendre ou révoquer n&apos;importe quel
      compte et toutes les actions réalisées par ce biais, s’il estime que
      l’usage réalisé du service porte préjudice à son image ou ne correspond
      pas aux exigences de sécurité.
    </Text>
    <Text mt={3}>
      L’éditeur s’engage à la sécurisation de la Plateforme, notamment en
      prenant toutes les mesures nécessaires permettant de garantir la sécurité
      et la confidentialité des informations fournies.
    </Text>
    <Text mt={3}>
      L’éditeur fournit les moyens nécessaires et raisonnables pour assurer un
      accès continu, sans contrepartie financière, à la Plateforme. Il se
      réserve la liberté de faire évoluer, de modifier ou de suspendre, sans
      préavis, la plateforme pour des raisons de maintenance ou pour tout autre
      motif jugé nécessaire.
    </Text>
    <Heading size="sm" as="h3" mt={4} mb={2.5}>
      5.2 L’Utilisateur
    </Heading>
    <Text>
      Chaque Utilisateur veille à la sécurité de ses identifiants (identifiant
      et mot de passe) et s’engage à utiliser un mot de passe robuste. Une fois
      connecté, l’Utilisateur s’engage à modifier son mot de passe de nature à
      le rendre sécurisé, conformément aux dispositions de la CNIL et de
      l’ANSSI.
    </Text>
    <Text mt={3}>
      L’Utilisateur s’engage également à ne jamais usurper l&apos;identité
      d&apos;un tiers en se faisant passer pour celui-ci vis à vis de la
      plateforme au risque d’encourir un an d’emprisonnement et 15 000 euros
      d’amende sur la base de l’article 226-4-1 du Code pénal.
    </Text>
    <Text mt={3}>
      L’Utilisateur s&apos;engage à ne pas mettre en ligne de contenus ou
      informations contraires aux dispositions légales et réglementaires en
      vigueur. Il est tenu à la confidentialité des données auxquelles il a
      accès et s’engage à ne jamais diffuser de données non anonymes. Il n’est
      autorisé qu’à extraire des données du service, que pour des motifs de
      santé publique et notamment à des fins de veille et d’alerte.
    </Text>
    <Text mt={3}>L’Utilisateur est informé que ses actions sont tracées.</Text>
    <Text mt={3}>
      Le non-respect de ces dispositions entraine des sanctions civiles et
      pénales, notamment le fait de collecter des données à caractère personnel
      par un moyen frauduleux, déloyal ou illicite est puni de cinq
      d’emprisonnement et de 300 000 euros d’amende.
    </Text>
    <Heading size="md" as="h3" mt={4} mb={2.5}>
      Article 6 - Mise à jour des conditions d’utilisation
    </Heading>
    <Text>
      Les termes des présentes conditions d’utilisation peuvent être amendés à
      tout moment, sans préavis, en fonction des modifications apportées à la
      plateforme, de l’évolution de la législation ou pour tout autre motif jugé
      nécessaire. Chaque modification des CGU donne lieu à une nouvelle version
      qui doit être acceptée par les parties.
    </Text>
    <Text mt={3}>Vous pouvez avoir accès à un versionnage des CGU ici :</Text>
    <Text mt={3}>Dernière version des CGU : 15/06/2023</Text>
  </>
);
