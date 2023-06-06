import {
  Box,
  Flex,
  Text,
  Slide,
  SlideFade,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface SlideContent {
  title: string;
  description: string;
}

interface SlideDetails {
  slideContents: SlideContent[];
}

const Slider: React.FC<SlideDetails> = ({ slideContents }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % slideContents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideContents.length]);

  const SliderText = ({
    title,
    description
  }: {
    title: string;
    description: string;
  }) => {
    return (
      <Box pl={[0, 0, 0, 0, 0, 30]}>
        <Text
          fontSize={['lg', 'lg', 'lg', 'lg', 'lg', '2xl']}
          fontWeight="600"
          mb="4"
        >
          {title}
        </Text>
        <Text
          fontSize={['sm', 'sm', 'sm', 'sm', 'sm', 'md']}
          fontWeight={400}
          color={'neutral.500'}
        >
          {description}
        </Text>
      </Box>
    );
  };

  if (slideContents.length === 1)
    return (
      <Flex justify="center" position="relative" w={'80%'}>
        <Flex flex="1">
          <SliderText
            title={slideContents[0].title}
            description={slideContents[0].description}
          />
        </Flex>
      </Flex>
    );

  return (
    <Flex justify="center" position="relative" pl={[0, 20, 46]} w={'80%'}>
      <Flex flex="1">
        <SlideFade in={true}>
          <SliderText
            title={slideContents[activeIndex].title}
            description={slideContents[activeIndex].description}
          />
          <UnorderedList display="flex" listStyleType="none" pt={10}>
            {slideContents.map((_, index) => (
              <ListItem
                key={index}
                w="3"
                h="3"
                borderRadius="full"
                bg={activeIndex === index ? 'primary.500' : 'primary.200'}
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
