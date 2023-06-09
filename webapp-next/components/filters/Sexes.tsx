import { useSexes } from '@/utils/api';
import { Cm2dContext, Filters } from '@/utils/cm2d-provider';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useContext } from 'react';
import { MenuSubTitle } from '../layouts/MenuSubTitle';
import { sexOrder, sortByOrder } from '@/utils/orders';

type Sex = {
  id: number;
  label: string;
};
type Sexes = Sex[];

type Props = {};

export const FiltersSexes = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters, selectedFiltersPile, setSelectedFiltersPile } =
    context;
  const { data } = useSexes();

  if (!data) return <>...</>;

  const sexes: Sexes = data.result.hits.hits
    .map((d: any) => ({
      id: d._id,
      label: d._source.sex
    }))
    .sort((a: Sex, b: Sex) => sortByOrder(a.label, b.label, sexOrder));

  return (
    <Box>
      <MenuSubTitle title="Sexe" />
      <Flex gap={4} flexDirection="row" wrap="wrap">
        {sexes.map(sex => (
          <Checkbox
            key={sex.id}
            borderColor="primary.500"
            colorScheme="primary"
            value={sex.label}
            isChecked={filters.sex.includes(sex.label)}
            onChange={e => {
              if (e.target.checked) {
                setFilters({
                  ...filters,
                  sex: [...filters.sex, e.target.value]
                });
                if (selectedFiltersPile.at(-1) !== 'sex')
                  setSelectedFiltersPile([...selectedFiltersPile, 'sex']);
              } else {
                const filterSexes = [
                  ...filters.sex.filter(f => f !== e.target.value)
                ];
                setFilters({
                  ...filters,
                  sex: filterSexes
                });
                if (!filterSexes.length)
                  setSelectedFiltersPile(
                    selectedFiltersPile.filter(sfp => sfp !== 'sex')
                  );
              }
            }}
          >
            <Text
              as={filters.sex.includes(sex.label) ? 'b' : 'span'}
              textTransform="capitalize"
            >
              {sex.label}
            </Text>
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};
