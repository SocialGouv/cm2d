import { ageRanges } from '@/components/layouts/Menu';
import { Cm2dContext, View } from '@/utils/cm2d-provider';
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

export function ChartMapHeader() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { setAggregations, setView } = context;

  const [isAggregated, setIsAggregated] = useState<boolean>(true);
  const [aggregateField, setAggregateField] = useState<string>('sex');

  const updateAggregation = () => {
    const xAgg: any = {
      aggregated_x: {
        terms: {
          field: 'department'
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
              src="icons/map.svg"
              width={24}
              height={24}
              alt="vue map"
            />
          }
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Vue : <Text as="b">Carte</Text>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleViewChange('line')}>
            Vue courbe
          </MenuItem>
          <MenuItem>
            <Text as="b">Vue carte</Text>
          </MenuItem>
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
              <Text as={aggregateField === 'age' ? 'b' : 'span'}>Age</Text>
            </MenuItem>
            <MenuItem onClick={() => handleLegendChange('death_location')}>
              <Text as={aggregateField === 'death_location' ? 'b' : 'span'}>
                Lieu de décès
              </Text>
            </MenuItem>
            <MenuItem onClick={() => handleLegendChange('years')}>
              <Text as={aggregateField === 'years' ? 'b' : 'span'}>Année</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}
