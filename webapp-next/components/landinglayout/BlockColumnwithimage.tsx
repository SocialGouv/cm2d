import {
  Box,
  Flex,
  Image,
  Button,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import NextLink from "next/link";
export default function ColumnWithImage() {
  return (
    <Flex>
      <Wrap py={[5, 12, 12]}>
        <WrapItem flex={1}>
          <Box mt={[10, 44]} px={[5, 10, 20]}>
            <Box pl={[5, 10, 20]}>
              <Text
                fontSize={["20px", "30px", "48px"]}
                fontWeight="700"
                mb={4}
                pr={[0, 10, 20]}
                lineHeight={1.3}
              >
                Explorez les données sur les causes de décès
              </Text>
              <Text
                mb={5}
                fontWeight={"400"}
                fontSize={["14px", "16px", "18px"]}
                color={"neutral.500"}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                auctor, est vel ullamcorper accumsan, est mauris fringilla nisi,
                a egestas tellus nisl ac justo.
              </Text>
              <NextLink href={"/login"}>
                <Button
                  variant="ghost"
                  bg={"primary.500"}
                  color={"white"}
                  _hover={{}}
                  height="12"
                  width={"40"}
                >
                  CONNEXION -&gt;
                </Button>
              </NextLink>
            </Box>
          </Box>
        </WrapItem>
        <WrapItem >
          <Box position="relative" display="inline-block" pb={[5, 12, 15]}>
          <Box
            position="absolute"
            top={0}
            left="80%"
            transform="translate(-50%, -50%)"
            width="750px"
            height="8xl"
            backgroundColor="primary.50"
            zIndex={-1}
            pb={5}
          />
          
            <Image
              src="/dashboard.svg"
              alt="Image"
              objectFit="cover"
              w="full"
              h="full"
              float="right"
              pt={2} 
            />
          </Box>
          
        </WrapItem>
      </Wrap>
    </Flex>
  );
}
