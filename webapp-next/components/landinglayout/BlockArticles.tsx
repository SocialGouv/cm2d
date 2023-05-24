import {
  Box,
  Button,
  WrapItem,
  Flex,
  Text,
  Wrap,
  Image,
  Stack,
  CardBody,
  Heading,
  CardFooter,
  Card,
} from "@chakra-ui/react";
import NextLink from "next/link";

export const BlockArticles = () => {
  return (
    <Flex>
      <Box mt={[10, 14]} px={[5, 16, 36]}>
        <Text
          fontSize={["20px", "24px", "36px"]}
          fontWeight="600"
          pr={[0, 10, 20]}
          lineHeight={1.3}
        >
          Lorem ipsum
        </Text>

        <Box w={"full"}>
          <Wrap my={[5, 10]} mb={10}>
            <WrapItem flex={1}>
              <Box>
                <Text
                  fontSize={["16px", "18px", "24px"]}
                  fontWeight={500}
                  color={"neutral.600"}
                  mb={[5, 5, 5]}
                >
                  SubTitle Lorem ipsum
                </Text>
                <Text color={"neutral.500"} fontWeight={400} mb={[2, 5, 5]}>
                  Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa
                  biosedore preren. Homode krorad hänåns. Nisade nektig vans.
                  Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.
                </Text>
                <NextLink href={"/landingpage"}>
                  <Button
                    variant="outline"
                    borderRadius={5}
                    borderColor={"neutral.500"}
                    color={"neutral.500"}
                    _hover={{}}
                    height="12"
                    width={"40"}
                  >
                    Button
                  </Button>
                </NextLink>
              </Box>
            </WrapItem>
            <WrapItem>
              <Box>
                <Image src="/PlaceholderImageArticle.svg" />
              </Box>
            </WrapItem>
          </Wrap>
        </Box>
        <Box w={"full"}>
          <Wrap my={[5, 10]} mb={10}>
            <WrapItem flex={1}>
              <Box>
                <Text
                  fontSize={["16px", "18px", "24px"]}
                  fontWeight={500}
                  color={"neutral.600"}
                  mb={[2, 5, 5]}
                >
                  SubTitle Lorem ipsum
                </Text>
                <Text color={"neutral.500"} fontWeight={400} mb={[2, 5, 5]}>
                  Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa
                  biosedore preren. Homode krorad hänåns. Nisade nektig vans.
                  Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.
                </Text>
                <NextLink href={"/landingpage"}>
                  <Button
                    variant="outline"
                    borderRadius={5}
                    borderColor={"neutral.500"}
                    color={"neutral.500"}
                    _hover={{}}
                    height="12"
                    width={"40"}
                  >
                    Button
                  </Button>
                </NextLink>
              </Box>
            </WrapItem>
            <WrapItem>
              <Box>
                <Image src="/PlaceholderImageArticle.svg" />
              </Box>
            </WrapItem>
          </Wrap>
        </Box>
        <Box w={"full"}>
          <Wrap my={[5, 10]} mb={10}>
            <WrapItem flex={1}>
              <Box>
                <Text
                  fontSize={["16px", "18px", "24px"]}
                  fontWeight={500}
                  color={"neutral.600"}
                  mb={[2, 5, 5]}
                >
                  SubTitle Lorem ipsum
                </Text>
                <Text color={"neutral.500"} fontWeight={400} mb={[2, 5, 5]}>
                  Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa
                  biosedore preren. Homode krorad hänåns. Nisade nektig vans.
                  Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.
                </Text>
                <NextLink href={"/landingpage"}>
                  <Button
                    variant="outline"
                    borderRadius={5}
                    borderColor={"neutral.500"}
                    color={"neutral.500"}
                    _hover={{}}
                    height="12"
                    width={"40"}
                  >
                    Button
                  </Button>
                </NextLink>
              </Box>
            </WrapItem>
            <WrapItem>
              <Box>
                <Image src="/PlaceholderImageArticle.svg" />
              </Box>
            </WrapItem>
          </Wrap>
        </Box>
      </Box>
    </Flex>
  );
};
