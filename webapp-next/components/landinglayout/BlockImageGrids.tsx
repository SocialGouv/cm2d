import {
  Grid,
  GridItem,
  Image,
  Box,
  Flex,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

type ContentsGrids = {
  title: string;
  description: string;
};

type ContentsImage = {
  image: string;
};

interface Contentsofpage {
  contentimage: ContentsImage;
  contentsgrids: ContentsGrids[];
}

export const BlockImageGrids: React.FC<Contentsofpage> = ({
  contentimage,
  contentsgrids,
}) => {
  return (
    <Flex flexDir="column" mb={16} pt={[5, 10, 14]} px={[5, 20, 36]}>
      <Box mb={[2, 4, 2]}>
        <Text fontSize={["20px", "26px", "36px"]} fontWeight="600" mb={4}>
          Explorez les données sur les causes de décès
        </Text>
        <Text
          fontSize={["14px", "16px", "18px"]}
          fontWeight={"400"}
          color={"neutral.500"}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          auctor, est vel ullamcorper accumsan, est mauris fringilla nisi, a
          egestas tellus nisl ac justo.
        </Text>
      </Box>

      <Box alignItems={"left"}>
        <Image
          src={contentimage.image}
          alt="image"
          height={["sm", "md", "xl"]}
          width={"100%"}
          my={[2, 5, 6]}
        />
      </Box>
      <Wrap justify="left" w={"full"}>
        {contentsgrids.map((content, index) => (
          <WrapItem flex={2} key={index}>
            <Box>
              <Text fontSize={["14px", "18px", "24px"]} mb={4}>
                {content.title}
              </Text>
              <Text
                fontSize={["14px", "16px", "18px"]}
                fontWeight={400}
                color={"neutral.500"}
              >
                {content.description}
              </Text>
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
};
