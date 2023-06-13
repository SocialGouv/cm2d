import { Dispatch, SetStateAction, useContext } from 'react';
import { MenuSubTitle } from '../layouts/MenuSubTitle';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import { Cm2dContext, Filters } from '@/utils/cm2d-provider';

type Props = {
  ages: { key: string; from: number; to?: number }[];
};

export const FiltersAges = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters, selectedFiltersPile, setSelectedFiltersPile } =
    context;
  const { ages } = props;

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
                if (selectedFiltersPile.at(-1) !== 'age')
                  setSelectedFiltersPile([...selectedFiltersPile, 'age']);
              } else {
                const filterAges = [
                  ...filters.age.filter(a => a.min !== age.from)
                ];
                setFilters({
                  ...filters,
                  age: filterAges
                });
                if (!filterAges.length)
                  setSelectedFiltersPile(
                    selectedFiltersPile.filter(sfp => sfp !== 'age')
                  );
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
