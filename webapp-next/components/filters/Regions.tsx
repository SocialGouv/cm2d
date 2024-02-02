import { Cm2dContext } from '@/utils/cm2d-provider';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

type Props = {};

export const RegionFilter = (props: Props) => {
  const context = useContext(Cm2dContext);
  const router = useRouter();
  const { mode } = router.query;

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters } = context;

  const [selectedFilter, setSelectedFilter] = useState<string[]>(
    filters.region_departments
  );

  let regionFilters: { label: string; value: string[] }[] = [
    {
      label: 'Ile-de-France',
      value: ['75', '77', '78', '91', '92', '93', '94', '95']
    },
    { label: 'Normandie', value: ['14', '27', '50', '61', '76'] },
    {
      label: 'Nouvelle-Aquitaine',
      value: [
        '16',
        '17',
        '19',
        '23',
        '24',
        '33',
        '40',
        '47',
        '64',
        '79',
        '86',
        '87'
      ]
    },
    { label: 'Hauts-de-France', value: ['2', '59', '60', '62', '80'] }
  ];

  if (mode === 'dev') {
    regionFilters = [
      ...regionFilters,
      {
        label: 'Auvergne-Rhône-Alpes',
        value: [
          '1',
          '3',
          '7',
          '15',
          '26',
          '38',
          '42',
          '43',
          '63',
          '69',
          '73',
          '74'
        ]
      },
      {
        label: 'Bourgogne-Franche-Comté',
        value: ['21', '25', '39', '58', '70', '71', '89', '90']
      },
      { label: 'Bretagne', value: ['22', '29', '35', '56'] },
      {
        label: 'Centre-Val de Loire',
        value: ['18', '28', '36', '37', '41', '45']
      },
      { label: 'Corse', value: ['2A', '2B'] },
      {
        label: 'Grand Est',
        value: ['8', '10', '51', '52', '54', '55', '57', '67', '68', '88']
      },
      {
        label: 'Occitanie',
        value: [
          '9',
          '11',
          '12',
          '30',
          '31',
          '32',
          '34',
          '46',
          '48',
          '65',
          '66',
          '81',
          '82'
        ]
      },
      { label: 'Pays de la Loire', value: ['44', '49', '53', '72', '85'] },
      {
        label: "Provence-Alpes-Côte d'Azur",
        value: ['4', '5', '6', '13', '83', '84']
      }
    ];
  }

  const getLabelFromValue = (value: string[]) => {
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
