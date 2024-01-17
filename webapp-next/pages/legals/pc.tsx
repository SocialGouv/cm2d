import { LegalLinks } from "@/components/legals/LegalLinks";
import {
  Box,
  Container,
  Heading,
  List,
  Link,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function PC() {
  return (
    <Container maxW="container.lg" my={10} lineHeight="taller">
      <LegalLinks />
      <Box mb={24}>
        <Heading mb={6}>Politique de confidentialité</Heading>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Qui est responsable de traitement de Cause médicales de décès ?
        </Heading>
        <Text>
          La plateforme numérique « Causes médicales de décès » est développée
          au sein de la Fabrique numérique des ministères sociaux. Le
          responsable de traitement est l’ARS Ile de France.
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Pourquoi manipulons-nous des données ?
        </Heading>
        <Text>
          Nous manipulons la donnée à caractère personnel pour permettre l’accès
          des personnes autorisées à la plateforme numérique. Celle-ci vise
          notamment à faciliter l’analyse et le retraitement des informations
          contenues par les certificats de décès pour des motifs de santé
          public.
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Quelles sont les données que nous manipulons ?
        </Heading>
        <Text>
          Seules sont traitées les données, des agents autorisés, suivantes :
        </Text>
        <List ml={8} my={3}>
          <ListItem>- Adresse e-mail ;</ListItem>
          <ListItem>- Nom, Prénom</ListItem>
        </List>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Qu’est-ce qui nous autorise à manipuler ces données ?
        </Heading>
        <Text>
          Ces données sont traitées car elles participe de la mission d’intérêt
          public de l’ARS Ile de France, conformément notamment à l’article
          L.2223-42 du code général des collectivités territoriales.
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Pendant combien de temps conservons-nous ces données ?
        </Heading>
        <TableContainer my={6}>
          <Table>
            <Thead bgColor="gray.300">
              <Tr>
                <Th borderRight="1px" borderColor="gray.100">
                  Types de données
                </Th>
                <Th>Durée de conservation</Th>
              </Tr>
            </Thead>
            <Tbody border="1px" borderColor="gray.100">
              <Tr>
                <Td borderRight="1px" borderColor="gray.100">
                  Données de compte
                </Td>
                <Td>6 mois à compter de la dernière utilisation du compte</Td>
              </Tr>
              <Tr>
                <Td borderRight="1px" borderColor="gray.100">
                  Cookies
                </Td>
                <Td>13 mois</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Quels droits avez-vous ?
        </Heading>
        <Text>
          Vous disposez des droits suivants concernant vos données à caractère
          personnel :
        </Text>
        <List ml={8} my={3}>
          <ListItem>
            - Droit d’information et droit d’accès aux données ;
          </ListItem>
          <ListItem>- Droit de rectification des données ;</ListItem>
          <ListItem>- Droit à la limitation des données ;</ListItem>
          <ListItem>- Droit d’opposition au traitement de données ;</ListItem>
        </List>
        <Text mt={3}>
          Pour exercer vos droits, contactez-nous à : <br />
          Ars-idf-cm2d@ars.sante.fr
        </Text>
        <Text mt={3}>
          Ou par voie postale :<br />
          ARS Ile de France
        </Text>
        <Text mt={3}>
          Immeuble &quot;Le Curve&quot; - 13 rue du Landy <br />
          93200 Saint-Denis <br />
          01 44 02 00 00
        </Text>
        <Text mt={3}>
          Puisque ce sont des droits personnels, nous ne traiterons votre
          demande que si nous sommes en mesure de vous identifier. Dans le cas
          où nous ne parvenons pas à vous identifier, nous pouvons être amenés à
          vous demander une preuve de votre identité.
        </Text>
        <Text mt={3}>
          Pour vous aider dans votre démarche, vous trouverez un modèle de
          courrier élaboré par la CNIL ici :<br />
          <Link
            as={NextLink}
            color="blue"
            href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces"
            target="_blank"
          >
            https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
          </Link>
        </Text>
        <Text mt={3}>
          Nous nous engageons à vous répondre dans un délai raisonnable qui ne
          saurait dépasser un mois à compter de la réception de votre demande.
        </Text>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Qui va avoir accès à ces données ?
        </Heading>
        <Text>Auront accès aux données :</Text>
        <List ml={8} my={3}>
          <ListItem>
            - Les agents de l’ARS Ile de France, habilités, dans le cadre de
            leur mission de service public.
          </ListItem>
        </List>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Quelles mesures de sécurité mettons-nous en place ?
        </Heading>
        <Text>
          Les mesures techniques et organisationnelles de sécurité adoptées pour
          assurer la confidentialité, l’intégrité et protéger l’accès des
          données sont notamment :
        </Text>
        <List ml={8} my={3}>
          <ListItem>- Stockage des données en base de données ;</ListItem>
          <ListItem>
            - Stockage des mots de passe en base sont hachés ;
          </ListItem>
          <ListItem>- Cloisonnement des données ;</ListItem>
          <ListItem>- Mesures de traçabilité ;</ListItem>
          <ListItem>- Surveillance ;</ListItem>
          <ListItem>
            - Protection contre les virus, malwares et logiciels espions ;
          </ListItem>
          <ListItem>- Protection des réseaux ;</ListItem>
          <ListItem>- Sauvegarde ;</ListItem>
          <ListItem>
            - Mesures restrictives limitant l’accès physiques aux données à
            caractère personnel.
          </ListItem>
        </List>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Qui nous aide à manipuler vos données ?
        </Heading>
        <Text>
          Certaines des données sont envoyées à des sous-traitants pour réaliser
          certaines missions. Le responsable de traitement s&apos;est assuré de
          la mise en œuvre par ses sous-traitants de garanties adéquates et du
          respect de conditions strictes de confidentialité, d’usage et de
          protection des données.
        </Text>
        <TableContainer my={6}>
          <Table>
            <Thead bgColor="gray.300">
              <Tr>
                <Th borderRight="1px" borderColor="gray.100">
                  Partenaires
                </Th>
                <Th borderRight="1px" borderColor="gray.100">
                  Pays destinataire
                </Th>
                <Th borderRight="1px" borderColor="gray.100">
                  Traitement réalisé
                </Th>
                <Th>Garanties</Th>
              </Tr>
            </Thead>
            <Tbody border="1px" borderColor="gray.100">
              <Tr>
                <Td borderRight="1px" borderColor="gray.100">
                  Claranet SAS
                </Td>
                <Td borderRight="1px" borderColor="gray.100">
                  Europe
                </Td>
                <Td borderRight="1px" borderColor="gray.100">
                  Hébergement
                </Td>
                <Td>
                  <Link
                    as={NextLink}
                    color="blue"
                    href="https://www.claranet.fr/expertises/mise-en-conformite/donnees-de-sante-hds"
                    target="_blank"
                  >
                    https://www.claranet.fr/expertises/mise-en-conformite/donnees-de-sante-hds
                  </Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Heading size="md" as="h3" mt={4} mb={2.5}>
          Qu’est-ce qu’un cookie ?
        </Heading>
        <Text>
          Un cookie est un fichier déposé sur votre terminal lors de la visite
          d’un site. Il a pour but de collecter des informations relatives à
          votre navigation et de vous adresser des services adaptés à votre
          terminal (ordinateur, mobile ou tablette).
          <br />
          En application de l’article 5(3) de la directive 2002/58/CE modifiée
          concernant le traitement des données à caractère personnel et la
          protection de la vie privée dans le secteur des communications
          électroniques, transposée à l’article 82 de la loi n°78-17 du 6
          janvier 1978 relative à l’informatique, aux fichiers et aux libertés,
          les traceurs ou cookies suivent deux régimes distincts :
        </Text>
        <List ml={8} my={3}>
          <ListItem>
            - Les cookies strictement nécessaires au service ou ayant pour
            finalité exclusive de faciliter la communication par voie
            électronique sont dispensés de consentement préalable au titre de
            l’article 82 de la LIL ;
          </ListItem>
          <ListItem>
            - Les cookies n’étant pas strictement nécessaires au service ou
            n’ayant pas pour finalité exclusive de faciliter la communication
            par voie électronique doivent être consenti par l’utilisateur. Ce
            consentement de la personne concernée pour une ou plusieurs
            finalités spécifiques constitue une base légale au sens du RGPD et
            doit être entendu au sens de l’article 6-a du RGPD.
          </ListItem>
        </List>
        <TableContainer my={6}>
          <Table>
            <Thead bgColor="gray.300">
              <Tr>
                <Th borderRight="1px" borderColor="gray.100">
                  Cookies
                </Th>
                <Th borderRight="1px" borderColor="gray.100">
                  Pays destinataire
                </Th>
                <Th borderRight="1px" borderColor="gray.100">
                  Base juridique
                </Th>
                <Th borderRight="1px" borderColor="gray.100">
                  Utilisation
                </Th>
                <Th>Garanties</Th>
              </Tr>
            </Thead>
            <Tbody border="1px" borderColor="gray.100">
              <Tr>
                <Td borderRight="1px" borderColor="gray.100">
                  ElasticSearch
                </Td>
                <Td borderRight="1px" borderColor="gray.100">
                  Etats-Unis
                </Td>
                <Td borderRight="1px" borderColor="gray.100">
                  Exemption de consentement
                </Td>
                <Td borderRight="1px" borderColor="gray.100">
                  Cookie technique de création de compte « administrateur »
                </Td>
                <Td>
                  <Link
                    as={NextLink}
                    color="blue"
                    href="https://www.elastic.co/fr/legal/privacy-statement#international-data-transfers"
                    target="_blank"
                  >
                    https://www.elastic.co/fr/legal/privacy-statement#international-data-transfers
                  </Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Text>
          Pour aller plus loin, vous avez la possibilité de consulter les fiches
          proposées par la CNIL grâce aux liens suivants :
        </Text>
        <Link
          as={NextLink}
          color="blue"
          href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi"
          target="_blank"
        >
          Cookies & traceurs : que dit la loi ?
        </Link>
        <br />
        <Link
          as={NextLink}
          color="blue"
          href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur"
          target="_blank"
        >
          Cookies : les outils pour les maîtriser
        </Link>
      </Box>
    </Container>
  );
}
