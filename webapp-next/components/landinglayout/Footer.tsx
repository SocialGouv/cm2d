import { Divider, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const Footer = () => {
  return (
    <Stack
      marginInline="auto"
      p={8}
      spacing={{ base: 8, md: 0 }}
      justifyContent="space-between"
      alignItems="center"
      mt={10}
      bg={"neutral.900"}
    >
      <Stack alignItems="center" color={"white"}>
        <HStack alignItems="center">
          <NextLink href={"/landingpage"}>
            <Text fontSize={["12px", "14px", "16px"]} fontWeight={500} mx={[6, 1, 2]}>Mentions légales</Text>
          </NextLink>
          
          <NextLink href={"/landingpage"}>
            <Text fontSize={["12px", "14px", "16px"]} fontWeight={500} mx={[6, 1, 2]}>Conditions générales d'utilisation</Text>
          </NextLink>
          
          <NextLink href={"/landingpage"}>
            <Text fontSize={["12px", "14px", "16px"]} fontWeight={500} mx={[6, 1, 2]}>Politique de confidentialité</Text>
          </NextLink>
        </HStack>
      </Stack>
    </Stack>
  );
};
