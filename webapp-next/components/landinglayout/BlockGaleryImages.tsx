import { Flex, Box, Text, Image, Wrap, WrapItem } from "@chakra-ui/react";

type Images = {
  imagelink: string;
};

interface Imagescontents {
  Imagescontent: Images[];
}

const BlockGaleryimages: React.FC<Imagescontents> = ({ Imagescontent }) => {
  return (
    <Flex my={[10, 15, 20]} flexDir="column">
      <Box mb={5} mx={[5, 20, 36]}>
        <Text
          fontSize={["20px", "26px", "36px"]}
          fontWeight="600"
          mb={4}
          lineHeight={1.3}
        >
          Explorez les données sur les causes de décès
        </Text>
        <Text
          color={"neutral.500"}
          fontWeight={"400"}
          fontSize={["14px", "16px", "18px"]}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          auctor, est vel ullamcorper accumsan, est mauris fringilla nisi, a
          egestas tellus nisl ac justo.
        </Text>
      </Box>

      <Wrap justify="center" w={"full"}>
        {Imagescontent.map((image, index) => (
          <WrapItem key={index}>
            <Box mt={10} mx={[5, 10, 28]}>
              <Image src={image.imagelink ? image.imagelink : ""} alt="Image 1" />
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
};

export default BlockGaleryimages;
