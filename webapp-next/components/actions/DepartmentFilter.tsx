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

type DepartmentFilterValue = 'department' | 'home_department';

export const DepartmentFilter = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters } = context;

  const [selectedFilter, setSelectedFilter] = useState<DepartmentFilterValue>(
    filters.department_filter
  );

  const departmentFilters: { label: string; value: DepartmentFilterValue }[] = [
    { label: 'Décès enregistrés en IDF', value: 'department' },
    { label: 'Décès domiciliés en IDF', value: 'home_department' }
  ];

  const getLabelFromValue = (
    value: 'department' | 'home_department'
  ): string => {
    return departmentFilters.find(df => df.value === value)?.label || '';
  };

  useEffect(() => {
    if (selectedFilter)
      setFilters({ ...filters, department_filter: selectedFilter });
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
      <MenuList>
        {departmentFilters.map(filter => (
          <MenuItem
            key={`option-${filter.value}`}
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
