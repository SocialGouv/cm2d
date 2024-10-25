import { LegalLinks } from "@/components/legals/LegalLinks";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function MentionsLegales() {
  return (
    <Container maxW="container.lg" my={10} lineHeight="taller">
      <LegalLinks />
      <Box mb={24}>
        <Heading mb={6}>Mentions légales</Heading>
        <Heading size="md" as="h3" mb={2.5}>
          Éditeur de la plateforme
        </Heading>
        <Text>
          La plateforme Causes médicales de décès est éditée par :<br />
          L’Agence Régionale de Santé Ile-de-France : <br />
          Immeuble &quot;Le Curve&quot; - 13 rue du Landy <br />
          93200 Saint-Denis
          <br />
          01 44 02 00 00
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Directeur de la publication
        </Heading>
        <Text>
          Le directeur de la publication est Denis Robin – Directeur
          Général
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Hébergement de la plateforme
        </Heading>
        <Text>
          Cette application est hébergée par : <br />
          ClaraNet SAS <br />
          2 rue des Landelles, <br />
          CS 87739, <br />
          35577 Cesson Sévigné Cedex <br />
          Tél : 02 99 12 57 57 <br />
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Accessibilité
        </Heading>
        <Text>
          La conformité aux normes d’accessibilité numérique est un objectif
          ultérieur mais nous tâchons de rendre cette application accessible à
          toutes et à tous.
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Signaler un dysfonctionnement
        </Heading>
        <Text>
          Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder
          à un contenu ou une fonctionnalité de la plateforme, merci de nous en
          faire part. Vous pouvez nous joindre à ars-idf-cm2d@ars.sante.fr
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Sécurité
        </Heading>
        <Text>
          La plateforme est protégée par un certificat électronique, matérialisé
          pour la grande majorité des navigateurs par un cadenas. Cette
          protection participe à la confidentialité des échanges. En aucun cas
          les services associés à l’application ne seront à l’origine d’envoi de
          courriels pour demander la saisie d’informations personnelles.
        </Text>
      </Box>
    </Container>
  );
}
