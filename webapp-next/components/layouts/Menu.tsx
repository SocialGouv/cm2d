import { Cm2dContext } from '@/utils/cm2d-provider';
import { Box, Flex, Image, Stack } from '@chakra-ui/react';
import { useContext } from 'react';
import { FiltersAges } from '../filters/Ages';
import { FilterCauses } from '../filters/Causes';
import { FiltersDeathLocations } from '../filters/DeathLocations';
import { FiltersSexes } from '../filters/Sexes';
import { MenuTitle } from './MenuTitle';
import { SubMenu } from './SubMenu';
import { FilterDates } from '../filters/Dates';

export const ageRanges = [
  { from: 0, to: 10, key: '0-10 ans' },
  { from: 11, to: 20, key: '11-20 ans' },
  { from: 21, to: 30, key: '21-30 ans' },
  { from: 31, to: 40, key: '31-40 ans' },
  { from: 41, to: 50, key: '41-50 ans' },
  { from: 51, to: 60, key: '51-60 ans' },
  { from: 61, to: 70, key: '61-70 ans' },
  { from: 71, key: '71 ans et +' }
];

export function Menu() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters } = context;

  return (
    <Flex
      flexDir={'column'}
      py={8}
      borderRadius={16}
      bg="white"
      w={80}
      minH={'calc(100vh - 2.5rem)'}
      position="sticky"
      top={0}
      boxShadow="box-shadow: 0px 10px 15px -3px rgba(36, 108, 249, 0.04), 0px 4px 6px -2px rgba(36, 108, 249, 0.04);"
    >
      <Box pl={4} px={8}>
        <Image src="/CM2D.svg" alt="CM2D Logo" w={24} />
      </Box>
      <Box mt={5} h="3px" w="full" bg="gray.50" />
      <Box mt={10} px={8}>
        <MenuTitle title="Cause de décès" />
        <FilterCauses filters={filters} setFilters={setFilters} />
      </Box>
      <Box mt={10} px={8}>
        <MenuTitle title="Période" />
        <FilterDates />
      </Box>
      <Box mt={10} px={8}>
        <MenuTitle title="Filtres" />
        <SubMenu
          title="Démographie"
          icon={{
            src: 'icons/user-search-blue.svg',
            srcOpen: 'icons/user-search.svg',
            alt: 'Onglet démographie'
          }}
        >
          <Stack dir="column" spacing={4}>
            <FiltersSexes filters={filters} setFilters={setFilters} />
            <FiltersAges
              filters={filters}
              setFilters={setFilters}
              ages={ageRanges}
            />
          </Stack>
        </SubMenu>
        <SubMenu
          title="Données du décès"
          icon={{
            src: 'icons/file-list-search-blue.svg',
            srcOpen: 'icons/file-list-search.svg',
            alt: 'Onglet données du décès'
          }}
        >
          <Stack dir="column" spacing={4}>
            <FiltersDeathLocations filters={filters} setFilters={setFilters} />
          </Stack>
        </SubMenu>
      </Box>
    </Flex>
  );
}
