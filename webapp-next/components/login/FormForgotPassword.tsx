import { swrPOSTFetch } from "@/utils/tools";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
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
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import useSWRMutation from "swr/mutation";

type FormForgotPassword = {
  username: string;
};

export const FormForgotPassword = () => {
  const { trigger: triggerForgotPassword, isMutating } = useSWRMutation(
    "/api/auth/forgot-password",
    swrPOSTFetch<{ username: string }>
  );

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormForgotPassword>();

  const onSubmit: SubmitHandler<FormForgotPassword> = ({ username }) => {
    triggerForgotPassword({ username });
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
        {!isSubmitSuccessful ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={[4, 6]} isInvalid={!!errors.username}>
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
                  {...register("username", {
                    required: "Ce champ est obligatoire",
                  })}
                />
              </InputGroup>
            </FormControl>
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
            <Button
              type="submit"
              isLoading={isSubmitting || isMutating}
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
        ) : (
          <Text fontSize={["sm", "md"]} color="neutral.500">
            <CheckCircleIcon w={5} h={5} mb={1} color="green.500" /> Un email de
            réinitialisation de mot de passe a été envoyé à
            <br />
            l'adresse email associée à votre compte.
          </Text>
        )}
        <Divider my={4} />
        <Text fontSize={["xs", "sm"]} color="neutral.500">
          <Link as={NextLink} href="/login">
            Retour à la connexion
          </Link>
        </Text>
      </Box>
    </Box>
  );
};
