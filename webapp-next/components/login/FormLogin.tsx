import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Spinner,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import NextLink from 'next/link';

async function auth(
  url: string,
  { arg }: { arg: { username?: string; password?: string; code?: string } }
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
  const [code, setCode] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);

  const [timer, setTimer] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | undefined>();

  const { isOpen, onToggle } = useDisclosure();
  const [formError, setFormError] = useState(false);

  const { trigger: triggerLogin } = useSWRMutation('/api/auth', auth);
  const { trigger: triggerVerify } = useSWRMutation(
    '/api/auth/verify-code',
    auth
  );

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(30);
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          return 0;
        }
      });
    }, 1000);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(parseInt(event.target.value));
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleCodeSubmit = async (e: any) => {
    e.preventDefault();
    if (code) {
      try {
        setIsLoading(true);
        const result = await triggerVerify({
          username: username,
          code: code.toString()
        });
        cookie.set('cm2d_api_key', result.encoded);
        router.push('/bo');
      } catch (e) {
        setFormError(true);
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError(false);
    if (username !== '' && password !== '') {
      try {
        setIsLoading(true);
        const result = await triggerLogin({ username, password });
        if (process.env.NODE_ENV === 'development') {
          cookie.set('cm2d_api_key', result.encoded);
          router.push('/bo');
        }
        startTimer();
        setShowCodeForm(true);
      } catch (e) {
        setFormError(true);
      }

      setIsLoading(false);
    }
  };

  const CodeForm = (
    <form
      onSubmit={e => handleCodeSubmit(e)}
      onChange={() => {
        setFormError(false);
      }}
    >
      <FormControl mb={[4, 6]}>
        <FormLabel htmlFor="code" fontSize={['10px', '12px']} fontWeight={500}>
          Code
        </FormLabel>
        <InputGroup mb={2}>
          <InputLeftElement pointerEvents="none">
            <Image src={'/icons/lock.svg'} alt="Code Icon" boxSize={9} pt={2} />
          </InputLeftElement>
          <Input
            type="number"
            id="code"
            autoFocus
            placeholder="Saisissez votre code"
            fontSize={'12px'}
            bg={'secondary.500'}
            value={code}
            onChange={handleCodeChange}
            required
          />
        </InputGroup>
        <Link
          fontSize="xs"
          href="#"
          display="block"
          textAlign="right"
          cursor={timer === 0 ? 'pointer' : 'not-allowed'}
          color={timer === 0 ? 'inherit' : 'gray'}
          onClick={e => {
            if (timer === 0) handleSubmit(e);
          }}
        >
          {timer !== 0 && `(${timer}s)`} Non reçu ? Renvoyer un nouveau code
        </Link>
      </FormControl>
      <FormControl mb={[4, 6]}>
        <Checkbox required>
          <Text fontSize="xs">
            J&apos;ai lu et j&apos;accepte les{' '}
            <Link
              as={NextLink}
              href="/legals/cgu"
              target="_blank"
              textDecor="underline"
            >
              conditions générales d&apos;utilisation
            </Link>
          </Text>
        </Checkbox>{' '}
      </FormControl>
      {formError && (
        <Box mb={8}>
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertTitle>Code incorrect</AlertTitle>
          </Alert>
        </Box>
      )}
      <Button
        type="submit"
        isDisabled={isLoading}
        bg="primary.500"
        _hover={{}}
        loadingText="Connexion en cours..."
        color={'white'}
        w={'full'}
        fontSize={['14px', '16px', '18px']}
        fontWeight={600}
      >
        {isLoading ? <Spinner color="primary.500" /> : <>Je valide -&gt;</>}
      </Button>
    </form>
  );

  const EmailPasswordForm = (
    <form
      onSubmit={e => handleSubmit(e)}
      onChange={() => {
        setFormError(false);
      }}
    >
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
            <Image src={'/icons/user.svg'} alt="User Icon" boxSize={9} pt={2} />
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
            <Image src={'/icons/lock.svg'} alt="Lock Icon" boxSize={9} pt={2} />
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
                isOpen ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
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
        isDisabled={isLoading}
        bg="primary.500"
        _hover={{}}
        loadingText="Connexion en cours..."
        color={'white'}
        w={'full'}
        fontSize={['14px', '16px', '18px']}
        fontWeight={600}
      >
        {isLoading ? (
          <Spinner color="primary.500" />
        ) : (
          <>Je me connecte -&gt;</>
        )}
      </Button>
    </form>
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mx={'auto'}
      mt={[8, 0]}
    >
      <Box maxW="sm" mx={[10, 20]} p={[0, 2]} bgColor="white">
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
          {showCodeForm
            ? 'Vous avez reçu un code par email, merci de le saisir ci-dessous.'
            : 'Veuillez vous connecter pour accéder à votre compte.'}
        </Text>
        {showCodeForm ? CodeForm : EmailPasswordForm}
      </Box>
    </Box>
  );
};
