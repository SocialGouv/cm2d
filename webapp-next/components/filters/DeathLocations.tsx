import { useDeathLocations } from '@/utils/api';
import { Filters } from '@/utils/cm2d-provider';
import { deathLocationOrder, sortByOrder } from '@/utils/orders';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { MenuSubTitle } from '../layouts/MenuSubTitle';

type DeathLocation = {
  id: number;
  label: string;
};
type DeathLocations = DeathLocation[];

type Props = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};

export const FiltersDeathLocations = (props: Props) => {
  const { filters, setFilters } = props;
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
              } else {
                setFilters({
                  ...filters,
                  death_location: [
                    ...filters.death_location.filter(f => f !== e.target.value)
                  ]
                });
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
              {death_location.label.charAt(0).toUpperCase() +
                death_location.label.substring(1)}
            </Text>
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};
