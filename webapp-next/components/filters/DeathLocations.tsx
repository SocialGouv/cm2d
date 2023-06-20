import { useDeathLocations } from '@/utils/api';
import { Cm2dContext, Filters } from '@/utils/cm2d-provider';
import { deathLocationOrder, sortByOrder } from '@/utils/orders';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useContext } from 'react';
import { MenuSubTitle } from '../layouts/MenuSubTitle';
import { capitalizeString } from '@/utils/tools';

type DeathLocation = {
  id: number;
  label: string;
};
type DeathLocations = DeathLocation[];

type Props = {};

export const FiltersDeathLocations = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters, selectedFiltersPile, setSelectedFiltersPile } =
    context;
  const { data } = useDeathLocations();

  if (!data) return <>...</>;

  const death_locations: DeathLocations = data.result.hits.hits
    .map((d: any) => ({
      id: d._id,
      label: d._source.death_location
    }))
    .sort((a: DeathLocation, b: DeathLocation) =>
      sortByOrder(a.label, b.label, deathLocationOrder)
    );

  return (
    <Box>
      <MenuSubTitle title="Lieu de décès" />
      <Flex gap={4} flexDirection="column" wrap="wrap">
        {death_locations.map(death_location => (
          <Checkbox
            key={death_location.id}
            borderColor="primary.500"
            colorScheme="primary"
            value={death_location.label}
            isChecked={filters.death_location.includes(death_location.label)}
            onChange={e => {
              if (e.target.checked) {
                setFilters({
                  ...filters,
                  death_location: [...filters.death_location, e.target.value]
                });
                if (selectedFiltersPile.at(-1) !== 'death_location')
                  setSelectedFiltersPile([
                    ...selectedFiltersPile,
                    'death_location'
                  ]);
              } else {
                const filterDeathLocations = [
                  ...filters.death_location.filter(f => f !== e.target.value)
                ];
                setFilters({
                  ...filters,
                  death_location: filterDeathLocations
                });
                if (!filterDeathLocations.length)
                  setSelectedFiltersPile(
                    selectedFiltersPile.filter(sfp => sfp !== 'death_location')
                  );
              }
            }}
          >
            <Text
              as={
                filters.death_location.includes(death_location.label)
                  ? 'b'
                  : 'span'
              }
            >
              {capitalizeString(death_location.label)}
            </Text>
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};
