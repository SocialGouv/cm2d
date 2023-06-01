import {
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
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

export const FormLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onToggle } = useDisclosure();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={["full", "100vh"]}
      mx={[0, 32, 44]}
      mt={[8, 0]}
    >
      <Box maxW="sm" mx={[10, 20]} p={[0, 6]} bgColor="white">
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
          Veuillez vous connecter pour accéder à votre compte.
        </Text>
        <form>
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
                <Image
                  src={"/icons/user.svg"}
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
                <Image
                  src={"/icons/lock.svg"}
                  alt="Lock Icon"
                  boxSize={9}
                  pt={2}
                />
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
                    isOpen
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
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
          <Button
            type="submit"
            bg="primary.500"
            _hover={{}}
            loadingText="Connexion en cours..."
            color={"white"}
            w={"full"}
            fontSize={["14px", "16px", "18px"]}
            fontWeight={600}
            
           
          >
            Je me connecte -&gt;
          </Button>
        </form>
      </Box>
    </Box>
  );
};
