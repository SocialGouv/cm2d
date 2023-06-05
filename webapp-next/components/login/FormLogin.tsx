import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { use, useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import cookie from 'js-cookie';

async function login(
  url: string,
  { arg }: { arg: { username: string; password: string } }
) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
}

export const FormLogin = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isOpen, onToggle } = useDisclosure();

  const [formError, setFormError] = useState(false);

  const { trigger } = useSWRMutation('/api/auth', login);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (username !== '' && password !== '') {
      try {
        const result = await trigger({ username, password });
        cookie.set('cm2d_api_key', result.encoded);
        router.push('/bo');
      } catch (e) {
        setFormError(true);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mx={'auto'}
      mt={[8, 0]}
    >
      <Box maxW="sm" mx={[10, 20]} p={[0, 6]} bgColor="white">
        <Heading
          as="h1"
          size="lg"
          mb={6}
          fontSize={['32px', '48px']}
          fontWeight={700}
        >
          Connexion 👋
        </Heading>
        <Text
          mb={6}
          fontSize={['14px', '16px']}
          fontWeight={400}
          color={'neutral.500'}
        >
          Veuillez vous connecter pour accéder à votre compte.
        </Text>
        <form onSubmit={e => handleSubmit(e)}>
          <FormControl mb={[4, 6]}>
            <FormLabel
              htmlFor="username"
              fontSize={['10px', '12px']}
              fontWeight={500}
            >
              Identifiant
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Image
                  src={'/icons/user.svg'}
                  alt="User Icon"
                  boxSize={9}
                  pt={2}
                />
              </InputLeftElement>
              <Input
                type="text"
                id="username"
                autoFocus
                placeholder="Saisissez votre adresse email"
                fontSize={'12px'}
                bg={'secondary.500'}
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </InputGroup>
          </FormControl>
          <FormControl mb={[4, 6]}>
            <FormLabel
              htmlFor="password"
              fontSize={['10px', '12px']}
              fontWeight={500}
            >
              Mot de passe
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Image
                  src={'/icons/lock.svg'}
                  alt="Lock Icon"
                  boxSize={9}
                  pt={2}
                />
              </InputLeftElement>
              <Input
                type={isOpen ? 'text' : 'password'}
                id="password"
                placeholder="Saisissez votre mot de passe"
                fontSize={'12px'}
                bg={'secondary.500'}
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    isOpen
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  }
                  icon={
                    <Image
                      src={isOpen ? '/icons/eye.svg' : '/icons/eye.svg'}
                      alt="Show/Hide Password Icon"
                      boxSize={9}
                      pt={2}
                    />
                  }
                  variant="ghost"
                  colorScheme="gray"
                  _hover={{}}
                  onClick={onToggle}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {formError && (
            <Box mb={4}>
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Erreurs dans les identifiants !</AlertTitle>
              </Alert>
            </Box>
          )}
          <Button
            type="submit"
            bg="primary.500"
            _hover={{}}
            loadingText="Connexion en cours..."
            color={'white'}
            w={'full'}
            fontSize={['14px', '16px', '18px']}
            fontWeight={600}
          >
            Je me connecte -&gt;
          </Button>
        </form>
      </Box>
    </Box>
  );
};
