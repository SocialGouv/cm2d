import { Dispatch, SetStateAction } from 'react';
import { MenuSubTitle } from '../layouts/MenuSubTitle';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import { Filters } from '@/utils/filters-provider';

type Props = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  ages: { id: number; label: string; minAge: number; maxAge?: number }[];
};

export const FiltersAges = (props: Props) => {
  const { filters, setFilters, ages } = props;

  return (
    <Box>
      <MenuSubTitle title="Ages" />
      <Flex gap={4} flexDirection="column">
        {ages.map((age, index) => (
          <Checkbox
            key={index}
            borderColor="primary.500"
            colorScheme="primary"
            value={age.id}
            isChecked={filters.age.some(a => a.min === age.minAge)}
            onChange={e => {
              if (e.target.checked) {
                setFilters({
                  ...filters,
                  age: [...filters.age, { min: age.minAge, max: age.maxAge }]
                });
              } else {
                setFilters({
                  ...filters,
                  age: [...filters.age.filter(a => a.min !== age.minAge)]
                });
              }
            }}
          >
            <Text
              as={filters.age.some(a => a.min === age.minAge) ? 'b' : 'span'}
            >
              {age.label}
            </Text>
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};
