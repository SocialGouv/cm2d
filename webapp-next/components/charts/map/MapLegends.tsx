import { Box, Flex, Text } from '@chakra-ui/react';

export function MapLegends() {
  // Colorimétrie relative à la médiane des décès des départements affichés
  // (cf. utils/map/props.ts).
  const legends = [
    {
      color: '#c9e7c8',
      borderColor: '#4daf4a',
      content: '< ½ médiane'
    },
    {
      color: '#c3d8e9',
      borderColor: '#377eb8',
      content: '≈ médiane'
    },
    {
      color: '#ffd8b2',
      borderColor: '#ff7f00',
      content: '> médiane'
    },
    {
      color: '#f6baba',
      borderColor: '#e41a1c',
      content: '≫ médiane'
    },
    {
      color: '#e0e0e0',
      borderColor: '#999999',
      content: 'sans donnée'
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
          <Text as="span" fontSize="sm">
            {legend.content}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
