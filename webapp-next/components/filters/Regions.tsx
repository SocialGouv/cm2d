import { Cm2dContext } from '@/utils/cm2d-provider';
import { ALL_DEPARTMENTS, HEXAGON_DEPARTMENTS, REGIONS } from '@/utils/tools';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

type Props = {};

export const RegionFilter = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters } = context;

  const [selectedFilter, setSelectedFilter] = useState<string[]>(
    filters.region_departments
  );
  const [didInitDefault, setDidInitDefault] = useState<boolean>(false);

  const regionFilters: { label: string; role: string; value: string[] }[] = [
    {
      label: 'France entière',
      role: 'region-france-entiere',
      value: ALL_DEPARTMENTS
    },
    {
      label: 'France hexagonale',
      role: 'region-france-entiere',
      value: HEXAGON_DEPARTMENTS
    },
    ...REGIONS
  ];

  const getLabelFromValue = (value: string[]) => {
    return (
      regionFilters.find(
        df => JSON.stringify(df.value) === JSON.stringify(value)
      )?.label || ''
    );
  };

  const getUserRegions = () => {
    if (
      context.user &&
      context.user.roles &&
      (context.user.roles.includes('region-france-entiere') ||
        !context.user.roles.length)
    )
      return regionFilters;

    return regionFilters.filter(region => {
      return (
        region.role &&
        context.user &&
        context.user.roles &&
        context.user.roles.includes(region.role)
      );
    });
  };

  // Sélection par défaut selon le rôle, une fois les rôles chargés :
  // un utilisateur "region-france-entiere" démarre sur la vue nationale.
  useEffect(() => {
    if (didInitDefault) return;
    if (!context.user || !context.user.roles) return;
    setDidInitDefault(true);
    if (context.user.roles.includes('region-france-entiere')) {
      setSelectedFilter(ALL_DEPARTMENTS);
    }
  }, [context.user?.roles, didInitDefault]);

  useEffect(() => {
    if (selectedFilter)
      setFilters({ ...filters, region_departments: selectedFilter });
  }, [selectedFilter]);

  const userRegions = getUserRegions();

  if (userRegions.length === 1) {
    return <Text as="b">{userRegions[0].label}</Text>;
  }

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
        {getUserRegions().map(filter => (
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
