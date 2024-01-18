import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Box,
  useBreakpointValue,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
  CloseButton,
  Link,
} from "@chakra-ui/react";

import NextLink from "next/link";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { ELASTIC_API_KEY_NAME } from "@/utils/tools";

export default function NavbarLanding() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const hasApiKey = !!cookie.get(ELASTIC_API_KEY_NAME);

  const links = [
    { label: "Accueil", path: "/" },
    { label: "À propos", path: "/about" },
  ];

  return (
    <Flex
      flexDir="column"
      w="full"
      h={[14, 14, 20]}
      py={2}
      px={4}
      direction={["column", "row"]}
      justify="space-between"
      bg="white"
      position="sticky"
      top={0}
      boxShadow="0px 10px 15px -3px rgba(36, 108, 249, 0.04), 0px 4px 6px -2px rgba(36, 108, 249, 0.04);"
      zIndex={1}
    >
      <Flex alignItems="center" wrap="wrap">
        <Flex flexGrow={1} justify="center">
          <Box ml={6} mt={[2, 0, 0]}>
            <NextLink href="/" passHref>
              <Flex alignItems="center">
                <Image src="/CM2D.svg" alt="CM2D Logo" w={24} mr={1.5} />
                x
                <Image
                  src="/ARS_logo.svg.png"
                  alt="ARS Logo"
                  w={16}
                  ml={2}
                  mt={3}
                />
              </Flex>
            </NextLink>
          </Box>
        </Flex>
        {isOpen ? (
          <CloseButton
            size="lg"
            onClick={onClose}
            display={["inline", "none"]}
          />
        ) : (
          <HamburgerIcon onClick={onOpen} display={["inline", "none"]} />
        )}
      </Flex>
      {hasApiKey ? (
        <Flex as="nav" bg="white">
          <Button
            as={NextLink}
            href="/bo"
            variant="ghost"
            bg={"primary.500"}
            color={"white"}
            _hover={{}}
            height={12}
            fontSize={16}
            fontWeight={"600"}
            m={2}
          >
            RETOURNER À L&apos;APPLICATION -&gt;
          </Button>
        </Flex>
      ) : (
        <Flex
          display={[isOpen ? "flex" : "none", "flex", "flex"]}
          bg={"white"}
          as="nav"
        >
          <Wrap
            align="center"
            justify="center"
            mx={[0, 0, 28, 28]}
            spacing={10}
            direction={["column", "column", "row"]}
            flex={1}
          >
            {links.map((link, index) => (
              <WrapItem key={index}>
                <NextLink href={link.path} passHref>
                  <Text
                    variant="ghost"
                    _hover={{ color: "primary.500" }}
                    fontSize={16}
                    color={
                      router.pathname === link.path ? "primary.500" : "inherit"
                    }
                    fontWeight={router.pathname === link.path ? "600" : "400"}
                    m={[2, 2, 4]}
                  >
                    {link.label}
                  </Text>
                </NextLink>
              </WrapItem>
            ))}
            <WrapItem>
              <NextLink href="/login" passHref>
                <Button
                  variant="ghost"
                  bg={"primary.500"}
                  color={"white"}
                  _hover={{}}
                  height={12}
                  width={"40"}
                  fontSize={16}
                  fontWeight={"600"}
                  m={2}
                >
                  CONNEXION
                </Button>
              </NextLink>
            </WrapItem>
          </Wrap>
        </Flex>
      )}
    </Flex>
  );
}
