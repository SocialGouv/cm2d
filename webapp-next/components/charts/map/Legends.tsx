import { Box, Flex, Text } from '@chakra-ui/react';

export function Legends() {
  const legends = [
    {
      color: 'green.100',
      borderColor: 'green.300',
      content: '0-10%'
    },
    {
      color: 'blue.100',
      borderColor: 'blue.300',
      content: '10-20%'
    },
    {
      color: 'orange.100',
      borderColor: 'orange.300',
      content: '20-30%'
    },
    {
      color: 'red.100',
      borderColor: 'red.300',
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
