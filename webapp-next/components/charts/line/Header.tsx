import { ageRanges } from '@/components/layouts/Menu';
import { Cm2dContext, View, baseAggregation } from '@/utils/cm2d-provider';
import { getLabelFromElkField } from '@/utils/tools';
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

export function ChartLineHeader() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { setAggregations, setView } = context;

  const [isAggregated, setIsAggregated] = useState<boolean>(true);
  const [aggregateField, setAggregateField] = useState<string>('sex');

  const updateAggregation = () => {
    let aggregation: any = {};

    if (isAggregated) {
      aggregation = baseAggregation;
    } else {
      if (['sex', 'death_location', 'department'].includes(aggregateField)) {
        aggregation = {
          aggregated_parent: {
            terms: {
              field: aggregateField
            },
            aggs: {
              ...baseAggregation
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
              ...baseAggregation
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
              ...baseAggregation
            }
          }
        };
      }
    }

    setAggregations(aggregation);
  };

  useEffect(() => {
    updateAggregation();
  }, [isAggregated, aggregateField]);

  const handleViewChange = (view: View) => {
    setView(view);
  };

  const handleAggregationChange = (aggregated: boolean) => {
    setIsAggregated(aggregated);
  };

  const handleLegendChange = (field: string) => {
    setAggregateField(field);
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
          <MenuItem>
            <Text as="b">Vue courbe</Text>
          </MenuItem>
          <MenuItem onClick={() => handleViewChange('map')}>Vue carte</MenuItem>
          <MenuItem onClick={() => handleViewChange('histogram')}>
            Vue histogramme
          </MenuItem>
          <MenuItem onClick={() => handleViewChange('doughnut')}>
            Vue donut
          </MenuItem>
          <MenuItem onClick={() => handleViewChange('table')}>
            Vue tableau
          </MenuItem>
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
          <Text as="b">{isAggregated ? 'Vue agrégée' : 'Vue distribuée'}</Text>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleAggregationChange(true)}>
            <Text as={isAggregated ? 'b' : 'span'}>Vue agrégée</Text>
          </MenuItem>
          <MenuItem onClick={() => handleAggregationChange(false)}>
            <Text as={!isAggregated ? 'b' : 'span'}>Vue distribuée</Text>
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
            Légende : <Text as="b">{getLabelFromElkField(aggregateField)}</Text>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleLegendChange('sex')}>
              <Text as={aggregateField === 'sex' ? 'b' : 'span'}>Sexe</Text>
            </MenuItem>
            <MenuItem onClick={() => handleLegendChange('age')}>
              <Text as={aggregateField === 'age' ? 'b' : 'span'}>Ages</Text>
            </MenuItem>
            <MenuItem onClick={() => handleLegendChange('department')}>
              <Text as={aggregateField === 'department' ? 'b' : 'span'}>
                Départements
              </Text>
            </MenuItem>
            <MenuItem onClick={() => handleLegendChange('death_location')}>
              <Text as={aggregateField === 'death_location' ? 'b' : 'span'}>
                Lieu de décès
              </Text>
            </MenuItem>
            <MenuItem onClick={() => handleLegendChange('years')}>
              <Text as={aggregateField === 'years' ? 'b' : 'span'}>Années</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}
