import { swrPOSTFetch } from "@/utils/tools";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import useSWRMutation from "swr/mutation";

type FormResetPassword = {
  password: string;
  confirmPassword: string;
};

export const FormResetPassword = () => {
  const router = useRouter();

  const toast = useToast();

  const [errorForm, setErrorForm] = useState<string | null>(null);

  const { trigger: triggerResetPassword } = useSWRMutation(
    "/api/auth/reset-password",
    swrPOSTFetch<{ password: string; token: string }>
  );

  const {
    handleSubmit,
    register,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormResetPassword>();

  const onSubmit: SubmitHandler<FormResetPassword> = async ({ password }) => {
    if (!router.query.token) setError("password", { message: "Invalid token" });
    const response = await triggerResetPassword({
      password,
      token: router.query.token as string,
    });
    if (response && response.ok) {
      toast({
        title: "Mot de passe réinitialisé",
        description: "Vous pouvez maintenant vous connecter",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      router.push("/login");
    } else {
      if (response?.status === 404) {
        setErrorForm("Le token n'est pas valide");
      } else if (response?.status === 401) {
        setErrorForm("Le token a expiré");
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mx={"auto"}
      mt={[8, 0]}
    >
      <Box w="lg" mx={[10, 20]} p={[0, 2]} bgColor="white">
        <Heading
          as="h1"
          size="lg"
          mb={6}
          fontSize={["32px", "48px"]}
          fontWeight={700}
        >
          Mot de passe oublié
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={[4, 6]} isInvalid={!!errors.password}>
            <FormLabel
              htmlFor="password"
              fontSize={["10px", "12px"]}
              fontWeight={500}
            >
              Nouveau mot de passe
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
                type="password"
                id="password"
                autoFocus
                placeholder="Saisissez votre nouveau mot de passe"
                fontSize={"12px"}
                bg={"secondary.500"}
                {...register("password", {
                  required: "Ce champ est obligatoire",
                  minLength: {
                    value: 12,
                    message:
                      "Le mot de passe doit contenir au moins 12 caractères",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                    message:
                      "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial",
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl mb={[4, 6]} isInvalid={!!errors.confirmPassword}>
            <FormLabel
              htmlFor="confirmPassword"
              fontSize={["10px", "12px"]}
              fontWeight={500}
            >
              Confirmer le mot de passe
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
                type="password"
                id="confirmPassword"
                autoFocus
                placeholder="Saisissez à nouveau votre nouveau mot de passe"
                fontSize={"12px"}
                bg={"secondary.500"}
                {...register("confirmPassword", {
                  required: "Ce champ est obligatoire",
                  validate: (value) =>
                    value === watch("password") ||
                    "Les mots de passe ne correspondent pas",
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.confirmPassword && errors.confirmPassword.message}
            </FormErrorMessage>
          </FormControl>
          {errorForm && (
            <Alert status="error" mb={6}>
              <AlertIcon />
              <AlertTitle>{errorForm}</AlertTitle>
            </Alert>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            colorScheme="primary"
            loadingText="..."
            color="white"
            w="full"
            fontSize={["14px", "16px", "18px"]}
            fontWeight={600}
          >
            Réinitialiser le mot de passe
          </Button>
        </form>
      </Box>
    </Box>
  );
};