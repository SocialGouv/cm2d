import {
  Container,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function About() {
  return (
    <Container maxW="container.lg" my={10}>
      <Heading as="h1" mb={8}>
        À propos
      </Heading>
      <Heading size={"md"} mb={4}>
        Présentation
      </Heading>
      <Text>
        Les causes médicales de décès sont le premier indicateur de l&apos;état
        de santé de la population selon l&apos;OMS et l&apos;OCDE. A ce titre,
        l’INSERM-CépiDc met à disposition de l’ARS Ile de France la base de
        données des causes brutes et calculées.
      </Text>
      <Text mt={2}>
        L’exploration de ces données contribue à la réalisation des missions des
        ARS : la veille sanitaire, le diagnostic territorial et
        l&apos;évaluation des plans de santé. Pour remplir ces objectifs,
        l&apos;ARS Ile de France a développé l’application CM2D. La cible :
        permettre aux agents des ARS d’accéder et d’interpréter plus simplement
        les données de mortalité.
      </Text>
      <Text mt={4}>Ce que nous faisons :</Text>
      <UnorderedList mt={2} spacing={2}>
        <ListItem>
          Exploiter tous les champs du certificat de décès, y compris les
          données textuelles. Les résultats que vous visualisez sont ainsi le
          reflet des termes mentionnés dans le certificat, aussi bien les termes
          spécifiés dans le processus morbide par le médecin qu’au niveau de la
          partie relative aux comorbidités.
        </ListItem>
        <ListItem>
          Vous fournir des données agrégées, sur des échelles territoriales
          variables (régions, départements), avec des systèmes de filtres et de
          visualisations adaptés aux causes que vous recherchez, et sans risque
          de ré-identification.
        </ListItem>
      </UnorderedList>
      <Text mt={4}>Ce que nous ne faisons pas :</Text>
      <UnorderedList mt={2} spacing={2}>
        <ListItem>
          Coder les certificats de décès : il s&apos;agit de la mission du{" "}
          <Link
            as={NextLink}
            color="blue"
            href="https://www.cepidc.inserm.fr/"
            target="_blank"
          >
            CépiDc
          </Link>
          . Celui-ci code tous les certificats et extrait la cause initiale de
          décès en suivant les règles de l&apos;OMS pour garantir une
          comparabilité internationale et temporelle.
        </ListItem>
        <ListItem>
          De l&apos;épidémiologie à l&apos;échelle nationale : il s&apos;agit de
          la mission de{" "}
          <Link
            as={NextLink}
            color="blue"
            href="https://www.santepubliquefrance.fr/"
            target="_blank"
          >
            Santé publique France
          </Link>
          , en recherchant par exemple des facteurs de risques de pathologies.
        </ListItem>
      </UnorderedList>

      <Heading size={"md"} mt={8} mb={4}>
        L&apos;application CM2D
      </Heading>
      <Text>
        Cette première version a été conçue et développée en 2023 en partenariat
        avec la Direction générale de la Santé et la Fabrique numérique des
        ministères sociaux.
      </Text>
      <Text mt={2}>
        Aujourd&apos;hui, vous trouvez 3 cas d&apos;usage dans cette version de
        l&apos;application : le suicide, la tuberculose et les AVC seuls ou
        associés au diabète. Au fil du temps, d’autres cas d’usage seront
        proposés, vous permettant une exploitation optimale de toutes les causes
        de décès.
      </Text>
      <Text mt={2}>
        Nous utilisons la technologie de traitement automatisé du langage (TAL)
        pour catégoriser les décès et donner des résultats le plus précis
        possible pour le cas d&apos;usage souhaité. Cette première approche
        permet de standardiser le texte des certificats et nécessite le recours
        à des algorithmes intelligents
      </Text>
      <Text mt={2}>
        <Text as="b">Le code source de l’application est disponible sur </Text>{" "}
        :{" "}
        <Link href="https://github.com/SocialGouv/cm2d" target="_blank">
          https://github.com/SocialGouv/cm2d
        </Link>{" "}
        (Licence MIT). L’application front-end mobilise le framework NextJS,
        langage typescript.
      </Text>

      <Heading size={"md"} mt={8} mb={4}>
        Les données
      </Heading>
      <Text fontWeight={"bold"}>
        Qualité des données et limites des analyses
      </Text>
      <Text mt={2}>
        La donnée de mortalité est de qualité variable car elle dépend
        exclusivement de la certification des médecins tant en termes de contenu
        qu&apos;en termes de quantité de causes certifiées. En moyenne, 3,4
        causes figurent sur le certificat; ceci pourra expliquer qu’en
        travaillant sur ces causes associées, vous trouverez plus de causes que
        de décès.
      </Text>
      <Text mt={2}>
        Pour les données relatives à l&apos;état civil (date de naissance, date
        de décès, sexe, commune de décès, commune de résidence), elles sont
        alignées avec l&apos;Insee tous les mois et annuellement quand la base
        codée d&apos;une année à l&apos;Insee est finalisée. Cette étape permet
        aussi de récupérer certaines données manquantes ou certificats
        manquants.
      </Text>
      <Text mt={2}>
        l&apos;ARS se charge d&apos;appliquer aussi un contrôle qualité à
        l&apos;intégration des données pour détecter les doublons de
        certification notamment.
      </Text>
      <Text mt={2}>
        S’agissant de la technologie de TAL, comme pour tous les outils de
        détection, des faux positifs et négatifs peuvent être présents dans les
        résultats de recherche. Des contrôles qualité sont donc également
        nécessaires sur ce type d’algorithmes.
      </Text>
      <Text fontWeight={"bold"} mt={4}>
        Temporalité
      </Text>
      <Text mt={2}>
        L&apos;ARS intègre les données de décès envoyées par l’Inserm dans sa
        base deux fois par jour : à 6h et à 15h.
      </Text>
      <Text mt={2}>
        Un décès certifié à un instant T sera disponible dans l&apos;outil entre
        quelques heures et jusqu’à 6 mois au regard de la modalité de
        certification.
      </Text>
      <Text mt={2}>
        Cette différence de temporalité s&apos;explique par la coexistence de
        deux circuits :
      </Text>
      <UnorderedList mt={2} spacing={2}>
        <ListItem>
          Le circuit électronique : lorsque le médecin certifie le décès dans
          l&apos;application{" "}
          <Link
            as={NextLink}
            color="blue"
            href="https://certdc.inserm.fr/auth/realms/certdc/protocol/openid-connect/auth?response_type=code&client_id=certdc&scope=openid profile email&state=JbFSjE_q2QFvLBJlf4RE-hxpRm0IST7clPZz0ILxg8g%3D&redirect_uri=https://certdc.inserm.fr/certdc-front/login/oauth2/code/certdc&nonce=d4cMnHfpFZhmvQ645C-1DtaT9N-3b9YUBzP3RXuNq5Q"
            target="_blank"
          >
            CertDc
          </Link>
          , le volet médical du certificat est envoyé en quelques minutes à
          l&apos;Inserm-CépiDc
        </ListItem>
        <ListItem>
          Le circuit papier : lorsque le médecin utilise un certificat papier,
          ce dernier est envoyé à la mairie, puis à la délégation départementale
          de l&apos;ARS puis au prestataire de saisie de l&apos;Inserm avant
          récupération par l&apos;Inserm-CépiDc. Celui-ci considère qu&apos;en 6
          mois, 97% des décès du mois de décès sont obtenus (ainsi au mois de
          juillet, nous avons 97% des décès du mois de janvier).
        </ListItem>
      </UnorderedList>
      <Text mt={4}>
        Aujourd’hui, 60% des décès sont encore certifiés par voie papier.
      </Text>
      <Text fontWeight={"bold"} mt={4}>
        Stockage
      </Text>
      <Text mt={2}>
        Les données sont hébergées sur les serveurs Claranet certifié hébergeur
        de données de santé.
      </Text>
      <Heading size={"md"} mt={8} mb={4}>
        Contact
      </Heading>
      <Text>
        Si vous avez des questions ou si vous souhaitez aller plus loin sur les
        causes médicales de décès, vous pouvez nous contacter à{" "}
        <Link href="mailto:ars-idf-cm2d@ars.sante.fr">
          ars-idf-cm2d@ars.sante.fr
        </Link>
      </Text>
    </Container>
  );
}
