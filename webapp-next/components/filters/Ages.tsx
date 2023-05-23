import { Dispatch, SetStateAction } from 'react';
import { MenuSubTitle } from '../layouts/MenuSubTitle';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import { Filters } from '@/utils/cm2d-provider';

type Props = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  ages: { key: string; from: number; to?: number }[];
};

export const FiltersAges = (props: Props) => {
  const { filters, setFilters, ages } = props;

  return (
    <Box>
      <MenuSubTitle title="Age" />
      <Flex gap={4} flexDirection="column">
        {ages.map((age, index) => (
          <Checkbox
            key={index}
            borderColor="primary.500"
            colorScheme="primary"
            value={age.key}
            isChecked={filters.age.some(a => a.min === age.from)}
            onChange={e => {
              if (e.target.checked) {
                setFilters({
                  ...filters,
                  age: [...filters.age, { min: age.from, max: age.to }]
                });
              } else {
                setFilters({
                  ...filters,
                  age: [...filters.age.filter(a => a.min !== age.from)]
                });
              }
            }}
          >
            <Text as={filters.age.some(a => a.min === age.from) ? 'b' : 'span'}>
              {age.key}
            </Text>
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};
