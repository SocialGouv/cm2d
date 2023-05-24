import { Flex, Box, Text, Image, Wrap, WrapItem } from "@chakra-ui/react";

export default function BlockGaleryimages() {
  return (
    <Flex my={[10, 15, 20]}  flexDir="column">
      <Box mb={5} mx={[5, 20, 36]}>
        <Text fontSize={["20px", "26px", "36px"]} fontWeight="600" mb={4} lineHeight={1.3}>
          Explorez les données sur les causes de décès
        </Text>
        <Text color={"neutral.500"} fontWeight={"400"} fontSize={["14px", "16px", "18px"]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          auctor, est vel ullamcorper accumsan, est mauris fringilla nisi, a
          egestas tellus nisl ac justo.
        </Text>
      </Box>
      
      <Wrap justify="center" w={"full"} >
        <WrapItem>
          <Box mt={10} mx={[5, 10, 28]} >
            <Image src="/placeholder-img.svg" alt="Image 1" />
          </Box>
        </WrapItem>
        <WrapItem>
          <Box mt={10} mx={[5, 10, 28]}>
            <Image src="/placeholder-img.svg" alt="Image 2" />
          </Box>
        </WrapItem>
        <WrapItem>
          <Box mt={10} mx={[5, 10, 28]}>
            <Image src="/placeholder-img.svg" alt="Image 3" />
          </Box>
        </WrapItem>
      </Wrap>
    </Flex>
  );
}
