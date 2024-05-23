import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
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
  useDisclosure,
} from "@chakra-ui/react";
import cookie from "js-cookie";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";
import { ELASTIC_API_KEY_NAME } from "@/utils/tools";
import { ContentCGU } from "@/pages/legals/cgu";

export async function auth<T>(url: string, { arg }: { arg: T }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: { "Content-Type": "application/json" },
  });
}

export const FormLogin = () => {
  const router = useRouter();

  const {
    isOpen: isOpenTerms,
    onOpen: onOpenTerms,
    onClose: onCloseTerms,
  } = useDisclosure();
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cm2dApiKeyEncoded, setCm2dApiKeyEncoded] = useState(null);
  const [code, setCode] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);

  const [remaningRequestsLogin, setRemaningRequestsLogin] = useState(0);
  const [remaningRequestsOTP, setRemaningRequestsOTP] = useState(0);

  const [timer, setTimer] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | undefined>();

  const { isOpen, onToggle } = useDisclosure();
  const [formError, setFormError] = useState(false);

  const { trigger: triggerLogin } = useSWRMutation(
    "/api/auth",
    auth<{ username: string; password: string }>
  );
  const { trigger: triggerVerify } = useSWRMutation(
    "/api/auth/verify-code",
    auth<{ username: string; code: string }>
  );
  const { trigger: triggerCreateUser } = useSWRMutation(
    "/api/auth/create-user",
    auth<{ username: string; versionCGU: string }>
  );

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(30);
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
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

  const handleModalTermsAccept = async () => {
    if (code) {
      await triggerCreateUser({ username, versionCGU: "1" });
      const res = (await triggerVerify({
        username: username,
        code: code.toString(),
      })) as any;
      const result = await res.json();
      cookie.set(ELASTIC_API_KEY_NAME, result.apiKey.encoded, {
        expires: 1,
      });
      onCloseTerms();
      router.push("/bo");
    }
  };

  const handleCodeSubmit = async (e: any) => {
    e.preventDefault();
    if (code) {
      setIsLoading(true);

      const res = (await triggerVerify({
        username: username,
        code: code.toString(),
      })) as any;

      if (res.ok) {
        const result = await res.json();
        if (result.firstLogin) {
          onOpenTerms();
        } else {
          cookie.set(ELASTIC_API_KEY_NAME, result.apiKey.encoded, {
            expires: 1,
          });
          router.push("/bo");
        }
        setIsLoading(false);
      } else {
        setTimeout(() => {
          setRemaningRequestsOTP(
            parseInt(res.headers.get("X-RateLimit-Remaining") as string) || 0
          );
          setFormError(true);
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError(false);
    if (username !== "" && password !== "") {
      setIsLoading(true);
      const res = (await triggerLogin({ username, password })) as any;
      if (res.ok) {
        const result = await res.json();
        if (process.env.NODE_ENV === "development") {
          cookie.set(ELASTIC_API_KEY_NAME, result.encoded, {
            expires: 1,
          });
          router.push("/bo");
        }
        startTimer();
        setShowCodeForm(true);
        setIsLoading(false);
      } else {
        setTimeout(() => {
          setRemaningRequestsLogin(
            parseInt(res.headers.get("X-RateLimit-Remaining") as string) || 0
          );
          setFormError(true);
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const CodeForm = (
    <form
      onSubmit={(e) => handleCodeSubmit(e)}
      onChange={() => {
        setFormError(false);
      }}
    >
      <FormControl mb={[4, 6]}>
        <FormLabel htmlFor="code" fontSize={["10px", "12px"]} fontWeight={500}>
          Code
        </FormLabel>
        <InputGroup mb={2}>
          <InputLeftElement pointerEvents="none">
            <Image src={"/icons/lock.svg"} alt="Code Icon" boxSize={9} pt={2} />
          </InputLeftElement>
          <Input
            type="number"
            id="code"
            autoFocus
            placeholder="Saisissez votre code"
            fontSize={"12px"}
            bg={"secondary.500"}
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
          cursor={timer === 0 ? "pointer" : "not-allowed"}
          color={timer === 0 ? "inherit" : "gray"}
          onClick={(e) => {
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
            <Box>
              <AlertTitle>
                {remaningRequestsOTP === 0
                  ? "Taux de limite atteint"
                  : "Code incorrect"}
              </AlertTitle>
              {remaningRequestsOTP === 0 ? (
                <AlertDescription>
                  Vous avez atteint le nombre maximum de tentatives, veuillez
                  réessayer dans 1 minute.
                </AlertDescription>
              ) : (
                <AlertDescription>
                  Il vous reste {remaningRequestsOTP} essai
                  {remaningRequestsOTP > 1 && "s"} !
                </AlertDescription>
              )}
            </Box>
          </Alert>
        </Box>
      )}
      <Button
        type="submit"
        isDisabled={isLoading}
        colorScheme="primary"
        loadingText="Connexion en cours..."
        color={"white"}
        w={"full"}
        fontSize={["14px", "16px", "18px"]}
        fontWeight={600}
      >
        {isLoading ? <Spinner color="primary.500" /> : <>Je valide -&gt;</>}
      </Button>
    </form>
  );

  const EmailPasswordForm = (
    <form
      onSubmit={(e) => handleSubmit(e)}
      onChange={() => {
        setFormError(false);
      }}
    >
      <FormControl mb={[4, 6]}>
        <FormLabel
          htmlFor="username"
          fontSize={["10px", "12px"]}
          fontWeight={500}
        >
          Identifiant
        </FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Image src={"/icons/user.svg"} alt="User Icon" boxSize={9} pt={2} />
          </InputLeftElement>
          <Input
            type="text"
            id="username"
            autoFocus
            placeholder="Saisissez votre adresse email"
            fontSize={"12px"}
            bg={"secondary.500"}
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </InputGroup>
      </FormControl>
      <FormControl mb={[4, 6]}>
        <FormLabel
          htmlFor="password"
          fontSize={["10px", "12px"]}
          fontWeight={500}
        >
          Mot de passe
        </FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Image src={"/icons/lock.svg"} alt="Lock Icon" boxSize={9} pt={2} />
          </InputLeftElement>
          <Input
            type={isOpen ? "text" : "password"}
            id="password"
            placeholder="Saisissez votre mot de passe"
            fontSize={"12px"}
            bg={"secondary.500"}
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <InputRightElement>
            <IconButton
              aria-label={
                isOpen ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              icon={
                <Image
                  src={isOpen ? "/icons/eye.svg" : "/icons/eye.svg"}
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
            <Box>
              <AlertTitle>
                {remaningRequestsLogin === 0
                  ? "Taux de limite atteint"
                  : "Erreurs dans les identifiants !"}
              </AlertTitle>
              {remaningRequestsLogin === 0 ? (
                <AlertDescription>
                  Vous avez atteint le nombre maximum de tentatives, veuillez
                  réessayer dans 1 minute.
                </AlertDescription>
              ) : (
                <AlertDescription>
                  Il vous reste {remaningRequestsLogin} essai
                  {remaningRequestsLogin > 1 && "s"} !
                </AlertDescription>
              )}
            </Box>
          </Alert>
        </Box>
      )}
      <Button
        type="submit"
        isDisabled={isLoading}
        colorScheme="primary"
        loadingText="Connexion en cours..."
        color={"white"}
        w={"full"}
        fontSize={["14px", "16px", "18px"]}
        fontWeight={600}
      >
        {isLoading ? (
          <Spinner color="primary.500" />
        ) : (
          <>Je me connecte -&gt;</>
        )}
      </Button>
      <Divider my={4} />
      <Text fontSize={["xs", "sm"]} color="neutral.500">
        <Link as={NextLink} href="/login/forgot-password">
          Mot de passe oublié ?
        </Link>
      </Text>
    </form>
  );

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mx={"auto"}
        mt={[8, 0]}
      >
        <Box mx={[10, 20]} p={[0, 2]} bgColor="white">
          <Heading
            as="h1"
            size="lg"
            mb={6}
            fontSize={["32px", "48px"]}
            fontWeight={700}
          >
            Connexion 👋
          </Heading>
          <Text
            mb={6}
            fontSize={["14px", "16px"]}
            fontWeight={400}
            color={"neutral.500"}
          >
            {showCodeForm
              ? "Vous avez reçu un code par email, merci de le saisir ci-dessous."
              : "Veuillez vous connecter pour accéder à votre compte."}
          </Text>
          {showCodeForm ? CodeForm : EmailPasswordForm}
        </Box>
      </Box>
      <Modal
        isOpen={isOpenTerms}
        onClose={onCloseTerms}
        closeOnOverlayClick={false}
        scrollBehavior="inside"
        size="6xl"
      >
        <ModalOverlay bg="primaryOverlay" />
        <ModalTermsContent
          modalBodyRef={modalBodyRef}
          onClose={() => router.push("/")}
          onAccept={() => handleModalTermsAccept()}
        />
      </Modal>
    </>
  );
};

function ModalTermsContent({
  modalBodyRef,
  onClose,
  onAccept,
}: {
  modalBodyRef: any;
  onClose: () => void;
  onAccept: () => void;
}) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const modalBody = modalBodyRef.current;

    if (modalBody) {
      const checkScrolledToBottom = () => {
        const scrolledToBottom =
          modalBody.scrollTop + modalBody.clientHeight >=
          modalBody.scrollHeight;
        setHasScrolledToBottom(scrolledToBottom);
      };

      checkScrolledToBottom();

      modalBody.addEventListener("scroll", checkScrolledToBottom);

      return () => {
        modalBody.removeEventListener("scroll", checkScrolledToBottom);
      };
    }
  }, [modalBodyRef]);

  return (
    <ModalContent>
      <ModalHeader>Conditions générales d&apos;utilisation</ModalHeader>
      <ModalBody ref={modalBodyRef}>
        <ContentCGU />
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={4} w="full">
          Refuser
        </Button>
        <Button
          colorScheme="primary"
          w="full"
          onClick={onAccept}
          // Remove for now, issue with some users who can't accept
          // isDisabled={!hasScrolledToBottom}
        >
          Accepter
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}
