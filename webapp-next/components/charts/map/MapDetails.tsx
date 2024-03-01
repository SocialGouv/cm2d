import { MapConfig } from '@/utils/map/type';
import { getFirstIntFromString } from '@/utils/tools';
import { Box, Flex, ListItem, UnorderedList } from '@chakra-ui/react';

export type Props = {
  mapConfig: MapConfig;
};

export function MapDetails({ mapConfig }: Props) {
  function extractDetailsValues(
    input: string
  ): { label: string; value: number }[] {
    const values: { label: string; value: number }[] = [];

    const regex = /<div>([^:]+)\s*:\s*(\d+)<\/div>/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
      const label = match[1].trim();
      const value = parseInt(match[2], 10);

      values.push({ label, value });
    }

    return values;
  }

  return (
    <Flex direction="column">
      {Object.entries(mapConfig.state_specific).map(([key, value]) => (
        <Flex key={key} mb={3}>
          <Box
            w={4}
            h={4}
            mr={2}
            mt={1.5}
            borderRadius="full"
            borderWidth={1}
            borderColor={value.hover_color}
            bg={value.color}
          />
          <p>
            <strong>{value.name}</strong> :{' '}
            {getFirstIntFromString(value.description)}
            {extractDetailsValues(value.description).map((item, index) => (
              <UnorderedList key={index} spacing={3} fontSize={'sm'}>
                <ListItem>
                  {item.label} : {item.value}
                </ListItem>
              </UnorderedList>
            ))}
          </p>
        </Flex>
      ))}
    </Flex>
  );
}
