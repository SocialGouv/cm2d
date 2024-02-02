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
  | 'years'
  | 'categories_level_1'
  | 'categories_level_2';

export function ChartMapHeader() {
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

  const [isAggregated, setIsAggregated] = useState<boolean>(
    !isValidField(saveAggregateX)
  );
  const [aggregateField, setAggregateField] = useState<Field>(
    isValidField(saveAggregateX)
      ? saveAggregateX
      : getDefaultField<Field>(selectedFiltersPile, isValidField, 'sex')
  );

  if (!availableFields.map(af => af.value).includes(aggregateField))
    setAggregateField('sex');

  const updateAggregation = () => {
    const xAgg: any = {
      aggregated_x: {
        terms: {
          field: 'home_department'
        }
      }
    };
    if (isAggregated) {
      setAggregations({
        ...xAgg
      });
    } else {
      let yAgg: any = {
        terms: {
          field: aggregateField
        }
      };

      if (
        aggregateField === 'categories_level_1' ||
        aggregateField === 'categories_level_2'
      ) {
        yAgg = {
          terms: {
            field: aggregateField,
            exclude: filters.categories[0]
          }
        };
      }

      if (aggregateField === 'age') {
        yAgg = {
          range: {
            field: 'age',
            ranges: ageRanges
          }
        };
      }

      if (aggregateField === 'years') {
        yAgg = {
          date_histogram: {
            field: 'date',
            calendar_interval: 'year'
          }
        };
      }

      setAggregations({
        aggregated_x: {
          ...xAgg.aggregated_x,
          aggs: {
            aggregated_y: { ...yAgg }
          }
        }
      });
    }
  };

  useEffect(() => {
    updateAggregation();
  }, [isAggregated, aggregateField]);

  useEffect(() => {
    if (!isAggregated) {
      setAggregateField(
        isValidField(saveAggregateX)
          ? saveAggregateX
          : getDefaultField<Field>(selectedFiltersPile, isValidField, 'sex')
      );
    }
    setSaveAggregateX(isAggregated ? undefined : aggregateField);
  }, [isAggregated]);

  const handleViewChange = (view: View) => {
    setView(view);
  };

  const handleAggregationChange = (aggregated: boolean) => {
    setIsAggregated(aggregated);
  };

  const handleLegendChange = (field: Field) => {
    setAggregateField(field);
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
              src="icons/map.svg"
              width={24}
              height={24}
              alt="vue carte"
            />
          }
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Vue : <Text as="b">Carte</Text>
        </MenuButton>
        <MenuList>
          {viewRefs.map((vr, index) => (
            <MenuItem key={index} onClick={() => handleViewChange(vr.value)}>
              <Text as={vr.value === 'map' ? 'b' : 'span'}>{vr.label}</Text>
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
          Carte :{' '}
          <Text as="b">
            {isAggregated ? 'Distribution globale' : 'Distribution stratifiée'}
          </Text>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleAggregationChange(true)}>
            <Text as={isAggregated ? 'b' : 'span'}>Distribution globale</Text>
          </MenuItem>
          <MenuItem onClick={() => handleAggregationChange(false)}>
            <Text as={!isAggregated ? 'b' : 'span'}>
              Distribution stratifiée
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
      {!isAggregated && (
        <Menu>
          <MenuButton
            ml={4}
            as={Button}
            variant="light"
            rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
          >
            Critère : <Text as="b">{getLabelFromElkField(aggregateField)}</Text>
          </MenuButton>
          <MenuList>
            {availableFields.map(field => (
              <MenuItem
                key={field.value}
                onClick={() => handleLegendChange(field.value)}
              >
                <Text as={aggregateField === field.value ? 'b' : 'span'}>
                  {field.label}
                </Text>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}
