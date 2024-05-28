import {
  Alert,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import type { User } from "@/utils/cm2d-provider";
import { type SubmitHandler, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { useState } from "react";

type SettingsProps = {
  user: User;
  onClose: () => void;
};

type FormChangePassword = {
  password: string;
  confirmPassword: string;
};

export async function auth<T>(url: string, { arg }: { arg: T }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: { "Content-Type": "application/json" },
  });
}

export default function SettingsModal({ user, onClose }: SettingsProps) {
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormChangePassword>();

  const [isSuccessUpdateUser, setIsSuccessUpdateUser] = useState(false);

  const onSubmit: SubmitHandler<FormChangePassword> = async ({ password }) => {
    const response = await triggerUpdateUser({
      username: user.username as string,
      password,
    });
    if (response?.ok) {
      setIsSuccessUpdateUser(true);
      reset();
    }
  };

  const { trigger: triggerUpdateUser } = useSWRMutation(
    "/api/auth/update-user",
    auth<{ username: string; password: string }>
  );

  return (
    <ModalContent>
      <ModalHeader>Paramètres</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form id="account-form" onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="Saisissez votre adresse email"
                fontSize={"12px"}
                bg={"secondary.500"}
                value={user.username}
                isDisabled
              />
            </InputGroup>
          </FormControl>
          <Divider my={6} />
          <Heading size="sm" mb={6}>
            Changer de mot de passe
          </Heading>
          <FormControl mb={[4, 6]} isInvalid={!!errors.password}>
            <FormLabel
              htmlFor="password"
              fontSize={["2xs", "xs"]}
              fontWeight={500}
            >
              Nouveau mot de passe
            </FormLabel>
            <Input
              type="password"
              id="password"
              placeholder="Saisissez votre nouveau mot de passe"
              fontSize="xs"
              bg="secondary.500"
              autoComplete="new-password"
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
            <FormErrorMessage fontSize="xs">
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl mb={[4, 6]} isInvalid={!!errors.password}>
            <FormLabel
              htmlFor="confirmPassword"
              fontSize={["2xs", "xs"]}
              fontWeight={500}
            >
              Nouveau mot de passe (confirmation)
            </FormLabel>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Saisissez à nouveau votre nouveau mot de passe"
              fontSize="xs"
              bg="secondary.500"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Ce champ est obligatoire",
                validate: (value) =>
                  value === watch("password") ||
                  "Les mots de passe ne correspondent pas",
              })}
            />
            <FormErrorMessage fontSize="xs">
              {errors.confirmPassword && errors.confirmPassword.message}
            </FormErrorMessage>
          </FormControl>
          <Text fontSize="xs" color="gray.400">
            Les mots de passe doivent contenir au moins 12 caractères, dont une
            majuscule, une minuscule, un chiffre et un caractère spécial.
          </Text>
          {isSuccessUpdateUser && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              <Box>Votre mot de passe a bien été modifié !</Box>
              <CloseButton
                alignSelf="flex-start"
                position="absolute"
                // align center vertically
                top="50%"
                transform="translateY(-50%)"
                right={2}
                onClick={() => setIsSuccessUpdateUser(false)}
              />
            </Alert>
          )}
        </form>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button colorScheme="gray" onClick={onClose}>
            Fermer
          </Button>
          <Button
            colorScheme="primary"
            type="submit"
            isLoading={isSubmitting}
            form="account-form"
          >
            Enregistrer
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </ModalContent>
  );
}
