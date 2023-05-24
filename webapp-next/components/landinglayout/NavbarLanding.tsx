import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Box,
  useBreakpointValue,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";

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
          <Box ml={6} mt={[2, 0, 0]}><Image src="/CM2D.svg" alt="CM2D Logo" w={24} /></Box>
        </Flex>
        <HamburgerIcon
          onClick={isOpen ? onClose : onOpen}
          display={["inline", "none"]}
        />
      </Flex>
      <Flex
        display={[isOpen ? "flex" : "none", "flex"]}
        bg={"white"}
        
      >
        <Stack align="center" direction={["column", "row"]} mx={28} >
          <Button
            variant="ghost"
            mr={3}
            _hover={{ color: "primary.500" }}
            fontSize={16}
            fontWeight={"600"}
          >
            Acceuil
          </Button>
          <Button
            variant="ghost"
            mr={3}
            _hover={{ color: "primary.500" }}
            fontSize={16}
            fontWeight={"600"}
          >
            A propos
          </Button>
          <Button
            variant="ghost"
            mr={3}
            _hover={{ color: "primary.500" }}
            fontSize={16}
            fontWeight={"600"}
          >
            Lorem ipsum
          </Button>
          <Button
            variant="ghost"
            bg={"primary.500"}
            color={"white"}
            _hover={{}}
            height="12"
            width={"40"}
            fontSize={16}
            fontWeight={"600"}
          >
            CONNEXION -&gt;
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
}
