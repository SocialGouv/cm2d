import { ageRanges } from '@/components/layouts/Menu';
import { Cm2dContext, DateInterval, View } from '@/utils/cm2d-provider';
import { getDefaultField, getLabelFromElkField, viewRefs } from '@/utils/tools';
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

export function ChartLineHeader() {
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
    filters,
    dateInterval,
    setDateInterval
  } = context;

  const dateIntervals: { label: string; value: DateInterval }[] = [
    { label: 'Semaine', value: 'week' },
    { label: 'Jour', value: 'day' },
    { label: 'Mois', value: 'month' }
  ];

  const getIntervalLabel = (value: DateInterval) =>
    dateIntervals.find(di => di.value === value)?.label ?? '';

  let availableFields: { label: string; value: Field }[] = [
    { label: 'Sexe', value: 'sex' },
    { label: 'Age', value: 'age' },
    { label: 'Lieu de décès', value: 'death_location' },
    { label: 'Département', value: 'home_department' },
    { label: 'Année', value: 'years' }
  ];

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

  const updateAggregation = () => {
    let aggregation: any = {};

    // Pas de la vue courbe piloté par le dropdown "Granularité".
    const dateAgg = {
      aggregated_date: {
        date_histogram: {
          field: 'date',
          calendar_interval: dateInterval
        }
      }
    };

    if (isAggregated) {
      aggregation = dateAgg;
    } else {
      if (
        ['sex', 'death_location', 'home_department'].includes(aggregateField)
      ) {
        aggregation = {
          aggregated_parent: {
            terms: {
              field: aggregateField,
              size: 100
            },
            aggs: {
              ...dateAgg
            }
          }
        };
      } else if (
        ['categories_level_1', 'categories_level_2'].includes(aggregateField)
      ) {
        aggregation = {
          aggregated_parent: {
            terms: {
              field: aggregateField,
              exclude: filters.categories[0],
              size: 100
            },
            aggs: {
              ...dateAgg
            }
          }
        };
      } else if (['age'].includes(aggregateField)) {
        aggregation = {
          aggregated_parent: {
            range: {
              field: aggregateField,
              ranges: ageRanges
            },
            aggs: {
              ...dateAgg
            }
          }
        };
      } else if (['years'].includes(aggregateField)) {
        aggregation = {
          aggregated_parent: {
            date_histogram: {
              field: 'date',
              calendar_interval: 'year'
            },
            aggs: {
              ...dateAgg
            }
          }
        };
      }
    }

    setAggregations(aggregation);
  };

  useEffect(() => {
    updateAggregation();
  }, [isAggregated, aggregateField, dateInterval]);

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
              src="icons/chart-line.svg"
              width={24}
              height={24}
              alt="vue courbe"
            />
          }
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Vue : <Text as="b">Courbe</Text>
        </MenuButton>
        <MenuList>
          {viewRefs.map((vr, index) => (
            <MenuItem key={index} onClick={() => handleViewChange(vr.value)}>
              <Text as={vr.value === 'line' ? 'b' : 'span'}>{vr.label}</Text>
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
          Granularité : <Text as="b">{getIntervalLabel(dateInterval)}</Text>
        </MenuButton>
        <MenuList>
          {dateIntervals.map(di => (
            <MenuItem key={di.value} onClick={() => setDateInterval(di.value)}>
              <Text as={dateInterval === di.value ? 'b' : 'span'}>
                {di.label}
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
          Courbe :{' '}
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
