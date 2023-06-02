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
} from "@chakra-ui/react";

import NextLink from "next/link";

export default function NavbarLanding() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <Image src="/CM2D.svg" alt="CM2D Logo" w={24} />
          </Box>
        </Flex>
        {isOpen ? (<CloseButton size='lg' onClick={onClose} display={["inline", "none"]}/>) : (
          <HamburgerIcon
          onClick={onOpen}
          display={["inline", "none"]}
          
        />
        )}
      </Flex>
      <Flex
        display={[
          isOpen ? "flex" : "none",
          "flex",
          "flex",
        
        ]}
        bg={"white"}
        as="nav"
      >
        <Wrap
          align="center"
          justify="center"
          mx={[0, 0, 28, 28]}
          spacing={0}
          direction={["column", "column", "row"]}
          flex={1}
        >
          <WrapItem>
            <NextLink href="/" passHref>
              <Text
                variant="ghost"
                _hover={{ color: "primary.500" }}
                fontSize={16}
                fontWeight={"600"}
                m={[2, 2, 4]}
              >
                Accueil
              </Text>
            </NextLink>
          </WrapItem>
          <WrapItem>
            <NextLink href="/" passHref>
              <Text
                variant="ghost"
                _hover={{ color: "primary.500" }}
                fontSize={16}
                fontWeight={"600"}
                m={[2, 2, 4]}
              >
                À propos
              </Text>
            </NextLink>
          </WrapItem>
          <WrapItem>
            <NextLink href="/" passHref>
              <Text
                variant="ghost"
                _hover={{ color: "primary.500" }}
                fontSize={16}
                fontWeight={"600"}
                m={[2, 2, 4]}
              >
                Lorem ipsum
              </Text>
            </NextLink>
          </WrapItem>
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
                CONNEXION -&gt;
              </Button>
            </NextLink>
          </WrapItem>
        </Wrap>
      </Flex>
    </Flex>
  );
}
