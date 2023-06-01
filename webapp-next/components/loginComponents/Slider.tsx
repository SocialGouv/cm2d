import { Box, Flex, Text, Slide, SlideFade, UnorderedList, ListItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface SlideContent {
  title: string;
  description: string;

}

interface SlideDetails {
    slideContents: SlideContent[]
}

const Slider: React.FC<SlideDetails> = ({slideContents}) => {
  const [activeIndex, setActiveIndex] = useState(0);
 

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slideContents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideContents.length]);

  return (
    <Flex justify="center"  height="10vh" position="relative" pl={[0, 20, 46]} w={"80%"}>
      <Flex flex="1" >
        <SlideFade in={true}>
          <Box pl={[0, 20, 30]}>
            <Text fontSize="24px" fontWeight="600" mb="4">
              {slideContents[activeIndex].title}
            </Text>
            <Text fontSize="14px" fontWeight={400} color={"neutral.500"}>{slideContents[activeIndex].description}</Text>
          </Box>
          <UnorderedList display="flex" listStyleType="none" pt={10}>
          {slideContents.map((_, index) => (
            <ListItem
              key={index}
              w="3"
              h="3"
              borderRadius="full"
              bg={activeIndex === index ? "primary.500" : "primary.200"}
              mx="2"
              cursor="pointer"
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </UnorderedList>
        </SlideFade>
      </Flex>
      
    </Flex>
  );
};

export default Slider;
