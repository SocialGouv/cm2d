import { ageRanges } from '@/components/layouts/Menu';
import { Cm2dContext, View, baseAggregation } from '@/utils/cm2d-provider';
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
  | 'department'
  | 'months'
  | 'categories_level_1'
  | 'categories_level_2';

export function ChartTableHeader() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const {
    setAggregations,
    setView,
    saveAggregateX,
    setSaveAggregateX,
    saveAggregateY,
    setSaveAggregateY,
    selectedFiltersPile,
    filters
  } = context;

  let availableFields: { label: string; value: Field }[] = [
    { label: 'Sexe', value: 'sex' },
    { label: 'Age', value: 'age' },
    { label: 'Lieu de décès', value: 'death_location' },
    { label: 'Département', value: 'department' },
    { label: 'Mois', value: 'months' }
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
  const [aggregateY, setAggregateY] = useState<Field>(
    isValidField(saveAggregateY)
      ? saveAggregateY
      : getDefaultField<Field>(selectedFiltersPile, isValidField, 'age', -2)
  );

  if (!availableFields.map(af => af.value).includes(aggregateX))
    setAggregateX('sex');
  if (!availableFields.map(af => af.value).includes(aggregateY))
    setAggregateY('age');

  const updateAggregation = () => {
    let xAgg: any = {
      terms: {
        field: aggregateX
      }
    };
    let yAgg: any = {
      terms: {
        field: aggregateY
      }
    };

    if (aggregateX === 'age' || aggregateY === 'age') {
      const rangeAgg = {
        range: {
          field: 'age',
          ranges: ageRanges
        }
      };

      xAgg = aggregateX === 'age' ? rangeAgg : xAgg;
      yAgg = aggregateY === 'age' ? rangeAgg : yAgg;
    }

    if (aggregateX === 'months' || aggregateY === 'months') {
      const dateAgg = {
        date_histogram: {
          field: 'date',
          calendar_interval: 'month'
        }
      };

      xAgg = aggregateX === 'months' ? dateAgg : xAgg;
      yAgg = aggregateY === 'months' ? dateAgg : yAgg;
    }

    if (
      aggregateX === 'categories_level_1' ||
      aggregateY === 'categories_level_1'
    ) {
      const categoriesAgg = {
        terms: {
          field: 'categories_level_1',
          exclude: filters.categories[0]
        }
      };

      xAgg = aggregateX === 'categories_level_1' ? categoriesAgg : xAgg;
      yAgg = aggregateY === 'categories_level_1' ? categoriesAgg : yAgg;
    }

    if (
      aggregateX === 'categories_level_2' ||
      aggregateY === 'categories_level_2'
    ) {
      const categoriesAgg = {
        terms: {
          field: 'categories_level_2',
          exclude: filters.categories[0]
        }
      };

      xAgg = aggregateX === 'categories_level_2' ? categoriesAgg : xAgg;
      yAgg = aggregateY === 'categories_level_2' ? categoriesAgg : yAgg;
    }

    setAggregations({
      aggregated_x: {
        ...xAgg,
        aggs: {
          aggregated_y: {
            ...yAgg
          }
        }
      }
    });
  };

  useEffect(() => {
    if (aggregateX && aggregateY) updateAggregation();
  }, [aggregateX, aggregateY]);

  const handleViewChange = (view: View) => {
    setView(view);
  };

  const handleXAxisChange = (field: Field) => {
    if (aggregateY === field) {
      setAggregateY(aggregateX);
      setSaveAggregateY(aggregateX);
    }
    setAggregateX(field);
    setSaveAggregateX(field);
  };

  const handleYAxisChange = (field: Field) => {
    if (aggregateX === field) {
      setAggregateX(aggregateY);
      setSaveAggregateX(aggregateY);
    }
    setAggregateY(field);
    setSaveAggregateY(field);
  };

  return (
    <Flex flexDir="row" w="full">
      <Menu>
        <MenuButton
          as={Button}
          variant="light"
          leftIcon={
            <NextImage
              src="icons/table.svg"
              width={24}
              height={24}
              alt="vue table"
            />
          }
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Vue : <Text as="b">Tableau</Text>
        </MenuButton>
        <MenuList>
          {viewRefs.map((vr, index) => (
            <MenuItem key={index} onClick={() => handleViewChange(vr.value)}>
              <Text as={vr.value === 'table' ? 'b' : 'span'}>{vr.label}</Text>
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
          Lignes : <Text as="b">{getLabelFromElkField(aggregateX)}</Text>
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
      <Menu>
        <MenuButton
          ml={4}
          as={Button}
          variant="light"
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Colonnes : <Text as="b">{getLabelFromElkField(aggregateY)}</Text>
        </MenuButton>
        <MenuList>
          {availableFields.map(field => (
            <MenuItem
              key={field.value}
              onClick={() => handleYAxisChange(field.value)}
            >
              <Text as={aggregateY === field.value ? 'b' : 'span'}>
                {field.label}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
}
