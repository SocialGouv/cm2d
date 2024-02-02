import { Cm2dContext } from '@/utils/cm2d-provider';
import { ChevronDownIcon, StarIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

type Props = {};

export const RegionFilter = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters } = context;

  const [selectedFilter, setSelectedFilter] = useState<number[]>(
    filters.region_departments
  );

  console.log(filters);
  console.log(selectedFilter);

  const regionFilters: { label: string; value: number[] }[] = [
    { label: 'Ile-de-France', value: [75, 77, 78, 91, 92, 93, 94, 95] },
    { label: 'Normandie', value: [14, 27, 50, 61, 76] },
    {
      label: 'Nouvelle-Aquitaine',
      value: [16, 17, 19, 23, 24, 33, 40, 47, 64, 79, 86, 87]
    },
    { label: 'Hauts-de-France', value: [2, 59, 60, 62, 80] }
  ];

  const getLabelFromValue = (value: number[]): string => {
    return (
      regionFilters.find(
        df => JSON.stringify(df.value) === JSON.stringify(value)
      )?.label || ''
    );
  };

  useEffect(() => {
    if (selectedFilter)
      setFilters({ ...filters, region_departments: selectedFilter });
  }, [selectedFilter]);

  return (
    <Menu>
      <MenuButton
        px={4}
        py={3}
        w="full"
        textAlign="left"
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
      >
        <Flex alignItems={'center'}>
          {getLabelFromValue(selectedFilter)}
          <ChevronDownIcon ml="auto" fontSize="2xl" />
        </Flex>
      </MenuButton>
      <MenuList zIndex={999}>
        {regionFilters.map(filter => (
          <MenuItem
            key={`option-${filter.value}`}
            defaultChecked={
              JSON.stringify(filter.value) === JSON.stringify(selectedFilter)
            }
            onClick={e => {
              setSelectedFilter(filter.value);
            }}
          >
            {filter.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
