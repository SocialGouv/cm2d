import { useDepartments } from '@/utils/api';
import { Cm2dContext, Filters } from '@/utils/cm2d-provider';
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useContext } from 'react';
import { MenuSubTitle } from '../layouts/MenuSubTitle';
import { departmentRefs } from '@/utils/tools';

type HomeDepartments = {
  id: number;
  label: string;
}[];

type Props = {};

export const FiltersHomeDepartments = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters, selectedFiltersPile, setSelectedFiltersPile } =
    context;
  const { data } = useDepartments();

  if (!data) return <>...</>;

  const home_department: HomeDepartments = data.result.hits.hits.map(
    (d: any) => ({
      id: d._id,
      label: d._source.department.toString()
    })
  );

  return (
    <Box>
      <MenuSubTitle title="Domicile du défunt" />
      <Flex gap={4} flexDirection="column" wrap="wrap">
        {home_department.map(home_department => (
          <Checkbox
            key={home_department.id}
            borderColor="primary.500"
            colorScheme="primary"
            value={home_department.label}
            isChecked={filters.home_department.includes(home_department.label)}
            onChange={e => {
              if (e.target.checked) {
                setFilters({
                  ...filters,
                  home_department: [...filters.home_department, e.target.value]
                });
                if (selectedFiltersPile.at(-1) !== 'home_department')
                  setSelectedFiltersPile([
                    ...selectedFiltersPile,
                    'home_department'
                  ]);
              } else {
                const filterHomeDepartments = [
                  ...filters.home_department.filter(f => f !== e.target.value)
                ];
                setFilters({
                  ...filters,
                  home_department: filterHomeDepartments
                });
                if (!filterHomeDepartments.length)
                  setSelectedFiltersPile(
                    selectedFiltersPile.filter(sfp => sfp !== 'home_department')
                  );
              }
            }}
          >
            <Text
              as={
                filters.home_department.includes(home_department.label)
                  ? 'b'
                  : 'span'
              }
              textTransform="capitalize"
            >
              {home_department.label in departmentRefs
                ? `${
                    departmentRefs[
                      home_department.label as keyof typeof departmentRefs
                    ]
                  } (${home_department.label})`
                : `Inconnu (${home_department.label})`}
            </Text>
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};
