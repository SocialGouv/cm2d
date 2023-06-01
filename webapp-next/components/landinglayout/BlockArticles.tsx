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

type Articles = {
  title: string;
  description: string;
  image: string;
};
interface Article {
  article: Articles[];
}

export const BlockArticles: React.FC<Article> = ({ article }) => {
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

        {article.map((art, index) => (
          <Box w={"full"} key={index}>
            <Wrap my={[5, 10]} mb={10}>
              <WrapItem flex={1}>
                <Box>
                  <Text
                    fontSize={["16px", "18px", "24px"]}
                    fontWeight={500}
                    color={"neutral.600"}
                    mb={[5, 5, 5]}
                  >
                    {art.title}
                  </Text>
                  <Text color={"neutral.500"} fontWeight={400} mb={[2, 5, 5]}>
                    {art.description}
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
                  <Image src={art.image} />
                </Box>
              </WrapItem>
            </Wrap>
          </Box>
        ))}
      </Box>
    </Flex>
  );
};
