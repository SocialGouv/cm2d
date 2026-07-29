import { extractDetailsValues } from '@/utils/map/details';
import { MapConfig } from '@/utils/map/type';
import { getFirstIntFromString } from '@/utils/tools';
import { Box, ListItem, Text, UnorderedList } from '@chakra-ui/react';

type StateEntry = MapConfig['state_specific'][string];

type Props = {
  fallbackName: string;
  state?: StateEntry;
  x: number;
  y: number;
};

export function MapTooltip({ fallbackName, state, x, y }: Props) {
  const details = state ? extractDetailsValues(state.description) : [];

  return (
    <Box
      position="fixed"
      left={`${x + 14}px`}
      top={`${y + 14}px`}
      zIndex={20}
      pointerEvents="none"
      bg="white"
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="md"
      px={3}
      py={2}
      maxW="280px"
      fontSize="sm"
    >
      <Text fontWeight="bold">{state ? state.name : fallbackName}</Text>
      {state ? (
        <>
          <Text mt={1}>
            Nombre de décès : {getFirstIntFromString(state.description) ?? 0}
          </Text>
          {details.length > 0 && (
            <UnorderedList mt={1} spacing={0}>
              {details.map((item, index) => (
                <ListItem key={index}>
                  {item.label} : {item.value}
                </ListItem>
              ))}
            </UnorderedList>
          )}
        </>
      ) : (
        <Text mt={1} color="gray.500">
          Aucune donnée sur ce périmètre
        </Text>
      )}
    </Box>
  );
}
