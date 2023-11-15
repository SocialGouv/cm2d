import { Box, Flex, Text } from '@chakra-ui/react';

export function MapLegends() {
  const legends = [
    {
      color: '#c9e7c8',
      borderColor: '#4daf4a',
      content: '0-10%'
    },
    {
      color: '#c3d8e9',
      borderColor: '#377eb8',
      content: '10-20%'
    },
    {
      color: '#ffd8b2',
      borderColor: '#ff7f00',
      content: '20-30%'
    },
    {
      color: '#f6baba',
      borderColor: '#e41a1c',
      content: '30%+'
    }
  ];

  return (
    <Flex justifyContent="right">
      {legends.map((legend, index) => (
        <Flex key={index} alignItems={'center'} mr={4}>
          <Box
            w={4}
            h={4}
            mr={2}
            borderRadius="full"
            borderWidth={1}
            borderColor={legend.borderColor}
            bg={legend.color}
          />
          <Text as="span" fontSize="lg">
            {legend.content}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
