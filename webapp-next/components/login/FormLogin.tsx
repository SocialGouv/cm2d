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
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { ELASTIC_API_KEY_NAME } from '@/utils/tools';

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

  const { isOpen: isOpenTerms, onOpen: onOpenTerms, onClose: onCloseTerms } = useDisclosure();
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cm2dApiKeyEncoded, setCm2dApiKeyEncoded] = useState(null);
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

  const handleModalTermsAccept = () => {
    if (cm2dApiKeyEncoded) {
      cookie.set(ELASTIC_API_KEY_NAME, cm2dApiKeyEncoded);
      onCloseTerms();
      router.push('/bo');
    }
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
        if (result.firstLogin) {
          setCm2dApiKeyEncoded(result.apiKey.encoded);
          onOpenTerms();
        } else {
          cookie.set(ELASTIC_API_KEY_NAME, result.apiKey.encoded);
          router.push('/bo');
        }
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
          cookie.set(ELASTIC_API_KEY_NAME, result.encoded);
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
    <>
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
      <Modal isOpen={isOpenTerms} onClose={onCloseTerms} closeOnOverlayClick={false} scrollBehavior="inside" size="6xl">
        <ModalOverlay bg="primaryOverlay" />
        <ModalTermsContent modalBodyRef={modalBodyRef} onClose={() => router.push('/')} onAccept={() => handleModalTermsAccept()} />
      </Modal>
    </>
  );
};

function ModalTermsContent({ modalBodyRef, onClose, onAccept }: { modalBodyRef: any, onClose: () => void, onAccept: () => void }) {

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const modalBody = modalBodyRef.current;

    if (modalBody) {
      const handleScroll = () => {
        if (!hasScrolledToBottom) {
          const scrolledToBottom = modalBody.scrollTop + modalBody.clientHeight >= modalBody.scrollHeight;
          setHasScrolledToBottom(scrolledToBottom);
        }
      };
  
      modalBody.addEventListener("scroll", handleScroll);
  
      return () => {
        modalBody.removeEventListener("scroll", handleScroll);
      };
    }
  }, [modalBodyRef, hasScrolledToBottom]);

  return (
    <ModalContent>
      <ModalHeader>Conditions générales d&apos;utilisation</ModalHeader>
      <ModalBody ref={modalBodyRef}>
        <p>
          Donec quis mauris id mauris ultricies pulvinar. Phasellus ex libero, tristique eu odio eu, imperdiet rutrum tortor. Pellentesque pulvinar nulla dolor, ut ultrices nulla pretium sed. Ut nec molestie dolor. Donec et molestie lectus. Vestibulum posuere iaculis justo sit amet tristique. Integer a ullamcorper elit. Mauris rhoncus sed metus quis fringilla. Nam egestas elementum justo in fermentum.
        </p>
        <br/>
        <p>
          Integer augue odio, tincidunt ac magna eget, consequat auctor ante. Proin pretium urna sem, a volutpat libero malesuada quis. Nam a fermentum urna, quis ultrices justo. Donec eu volutpat enim. Nulla facilisi. Pellentesque tincidunt ex in dui lacinia placerat. Morbi luctus iaculis ante, sit amet porttitor lacus convallis sed. Etiam mollis semper massa ac posuere. Proin mi magna, bibendum vel mattis non, iaculis faucibus ex. In tristique lacinia nisi, ut laoreet augue venenatis egestas.
        </p>
        <br/>
        <p>
          In iaculis, est at imperdiet vehicula, quam ipsum dapibus augue, non mattis tortor nisi ac nunc. Curabitur in elementum augue. Nulla consectetur quis leo quis faucibus. Integer et dolor vitae mi efficitur cursus. Curabitur massa neque, pretium id porta eget, pretium non odio. Suspendisse potenti. Integer malesuada eros eu augue accumsan, fermentum auctor eros condimentum. Phasellus ut massa diam. Vestibulum sed porttitor leo. Nulla a pharetra lectus. Vestibulum ut mauris blandit, ultrices libero ornare, molestie nulla. Aenean tincidunt libero vitae tellus sagittis, eu porta massa venenatis. Aliquam sit amet neque eu felis sodales rhoncus non mollis neque.
        </p>
        <br/>
        <p>
          Fusce tempor metus non nibh lobortis sagittis. Donec viverra vestibulum convallis. Nulla non augue in libero commodo dapibus. Duis in malesuada ipsum, et efficitur nulla. Donec scelerisque vestibulum lacus, eget mollis massa ultricies quis. Aliquam eu massa turpis. Pellentesque egestas risus in aliquet facilisis. Nam eu odio sit amet massa suscipit sagittis sit amet non neque. Etiam dolor est, interdum congue risus vel, commodo interdum risus.
        </p>
        <br/>
        <p>
          Suspendisse non risus odio. Etiam aliquet bibendum mi, eu dapibus velit dapibus sit amet. Etiam a tincidunt elit. Donec sit amet lectus tellus. Praesent pulvinar porta vestibulum. In tristique, justo eget porta aliquam, odio massa tempus nisi, sed imperdiet diam dolor ut libero.
        </p>
        <br/>
        <p>
          Morbi tincidunt elit consectetur diam ultricies, et maximus tellus condimentum. Sed sit amet lorem libero. Aliquam rhoncus venenatis velit, quis faucibus lorem porttitor non. Mauris ac tortor et ante facilisis laoreet ac a ante. Nullam consequat sem nisl, a cursus arcu euismod quis.
        </p>
        <br/>
        <p>
          Praesent fringilla massa velit, id efficitur lacus pulvinar eget. Donec sit amet vehicula ex. Etiam a est sit amet metus porttitor molestie non luctus arcu. Duis pulvinar malesuada dui, ac euismod est lobortis vel. Pellentesque porttitor magna ut nisi eleifend pellentesque.
        </p>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onClose} mr={4} w="full">
          Refuser
        </Button>
        <Button colorScheme="primary" w="full" onClick={onAccept} isDisabled={!hasScrolledToBottom}>
          Accepter
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}
