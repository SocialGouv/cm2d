import { useAssociateCauses } from '@/utils/api';
import { Cm2dContext } from '@/utils/cm2d-provider';
import { Box, Link } from '@chakra-ui/react';
import { useContext } from 'react';
import { MultiSelect } from 'chakra-multiselect';
import { MenuSubTitle } from '../layouts/MenuSubTitle';

type AssociateCauses = {
  value: number;
  label: string;
}[];

type Props = {};

export const FilterAssociateCauses = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters } = context;
  const { data } = useAssociateCauses();

  if (!data) return <>...</>;

  const associateCauses: AssociateCauses = data.result.hits.hits.map(
    (d: any) => ({
      value: d._source.categories_associate,
      label: d._id
    })
  );

  return (
    <Box>
      <MenuSubTitle title="Associer une ou plusieurs causes" />
      <MultiSelect
        options={associateCauses}
        value={filters.categories_associate}
        onChange={values => {
          setFilters({ ...filters, categories_associate: values as string[] });
        }}
      />
      {filters.categories_associate.length > 1 && (
        <Link
          color="primary.500"
          textDecor={'underline'}
          mt={3}
          display="block"
        >
          Voir la distribution
        </Link>
      )}
    </Box>
  );
};
