import { ageRanges } from '@/components/layouts/Menu';
import { Cm2dContext, View } from '@/utils/cm2d-provider';
import {
  concatAdditionnalFields,
  getDefaultField,
  getLabelFromElkField,
  viewRefs
} from '@/utils/tools';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { useContext, useEffect, useState } from 'react';

type Field =
  | 'sex'
  | 'age'
  | 'death_location'
  | 'home_department'
  | 'years'
  | 'categories_level_1'
  | 'categories_level_2';

export function ChartDoughnutHeader() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const {
    setAggregations,
    setView,
    saveAggregateX,
    setSaveAggregateX,
    selectedFiltersPile,
    filters
  } = context;

  let availableFields: { label: string; value: Field }[] = [
    { label: 'Sexe', value: 'sex' },
    { label: 'Age', value: 'age' },
    { label: 'Lieu de décès', value: 'death_location' },
    { label: 'Département', value: 'home_department' },
    { label: 'Année', value: 'years' }
  ];

  if (!!filters.categories.length)
    availableFields = concatAdditionnalFields<Field>(
      availableFields,
      filters.categories_search,
      filters.categories_associate
    );

  const isValidField = (field?: string): field is Field =>
    field ? availableFields.some(({ value }) => value === field) : false;

  const [aggregateX, setAggregateX] = useState<Field>(
    isValidField(saveAggregateX)
      ? saveAggregateX
      : getDefaultField<Field>(selectedFiltersPile, isValidField, 'sex')
  );

  if (!availableFields.map(af => af.value).includes(aggregateX))
    setAggregateX('sex');

  const updateAggregation = () => {
    let xAgg: any = {
      terms: {
        field: aggregateX,
        size: 100
      }
    };

    if (
      aggregateX === 'categories_level_1' ||
      aggregateX === 'categories_level_2'
    ) {
      xAgg = {
        terms: {
          field: aggregateX,
          exclude: filters.categories[0],
          size: 100
        }
      };
    }

    if (aggregateX === 'age') {
      xAgg = {
        range: {
          field: aggregateX,
          ranges: ageRanges
        }
      };
    }

    if (aggregateX === 'years') {
      xAgg = {
        date_histogram: {
          field: 'date',
          calendar_interval: 'year'
        }
      };
    }

    setAggregations({
      aggregated_x: {
        ...xAgg
      }
    });
  };

  useEffect(() => {
    updateAggregation();
  }, [aggregateX]);

  const handleViewChange = (view: View) => {
    setView(view);
  };

  const handleXAxisChange = (field: Field) => {
    setAggregateX(field);
    setSaveAggregateX(field);
  };

  return (
    <Flex flexDir="row" w="full">
      <Menu>
        <MenuButton
          as={Button}
          variant="light"
          leftIcon={
            <NextImage
              src="icons/chart-pie.svg"
              width={24}
              height={24}
              alt="vue doughnut"
            />
          }
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Vue : <Text as="b">Donut</Text>
        </MenuButton>
        <MenuList>
          {viewRefs.map((vr, index) => (
            <MenuItem key={index} onClick={() => handleViewChange(vr.value)}>
              <Text as={vr.value === 'doughnut' ? 'b' : 'span'}>
                {vr.label}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          ml={4}
          as={Button}
          variant="light"
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Critère : <Text as="b">{getLabelFromElkField(aggregateX)}</Text>
        </MenuButton>
        <MenuList>
          {availableFields.map(field => (
            <MenuItem
              key={field.value}
              onClick={() => handleXAxisChange(field.value)}
            >
              <Text as={aggregateX === field.value ? 'b' : 'span'}>
                {field.label}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
}
