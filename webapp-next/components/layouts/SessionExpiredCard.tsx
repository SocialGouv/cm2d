import { Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
  // true = session expirée (401/403) ; false = autre erreur serveur.
  expired: boolean;
};

// Affiché à la place du dashboard quand les requêtes ES échouent. Auparavant un
// échec (typiquement une API key expirée pendant la nuit) laissait la page en
// spinner infini, sans aucune porte de sortie. Ce panneau donne une action
// claire : effacer le cookie et revenir à l'écran de connexion.
export function SessionExpiredCard({ expired }: Props) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const reconnect = () => {
    setIsLoggingOut(true);
    fetch('/api/auth/invalidate-api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
      .catch(() => {})
      .finally(() => {
        window.location.href = '/';
      });
  };

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
      py={12}
      px={6}
      borderRadius={16}
      bg="white"
      w="full"
      boxShadow="0px 8px 15px -4px rgba(36, 108, 249, 0.08), 0px 4px 6px -2px rgba(36, 108, 249, 0.08);"
    >
      <Text fontSize="3xl" role="img" aria-label="Session expirée">
        🔒
      </Text>
      <Text textAlign="center" fontWeight={600} fontSize="lg">
        {expired
          ? 'Votre session a expiré'
          : 'Une erreur est survenue lors du chargement des données'}
      </Text>
      <Text textAlign="center" color="gray.600">
        {expired
          ? 'Pour des raisons de sécurité, votre connexion a expiré. Veuillez vous reconnecter.'
          : 'Merci de vous reconnecter. Si le problème persiste, contactez un administrateur.'}
      </Text>
      <Button
        onClick={reconnect}
        isLoading={isLoggingOut}
        loadingText="Reconnexion..."
        bg="primary.500"
        color="white"
        _hover={{ bg: 'primary.600' }}
      >
        Se reconnecter
      </Button>
    </Flex>
  );
}
