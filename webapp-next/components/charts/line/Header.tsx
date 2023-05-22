import { Cm2dContext, baseAggregation } from '@/utils/cm2d-provider';
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
    if (isAggregated) {
      setAggregations(baseAggregation);
    } else if (['sex', 'death_location'].includes(aggregateField)) {
      setAggregations({
        [`aggregated_parent`]: {
          terms: {
            field: aggregateField
          },
          aggs: {
            ...baseAggregation
          }
        }
      });
    } else if (['age'].includes(aggregateField)) {
      setAggregations({
        [`aggregated_parent`]: {
          range: {
            field: aggregateField,
            ranges: [
              { to: 10, key: '0-10 ans' },
              { from: 11, to: 20, key: '11-20 ans' },
              { from: 21, to: 30, key: '21-30 ans' },
              { from: 31, to: 40, key: '31-40 ans' },
              { from: 41, to: 50, key: '41-50 ans' },
              { from: 51, to: 60, key: '51-60 ans' },
              { from: 61, to: 70, key: '61-70 ans' },
              { from: 71, key: '71 ans et +' }
            ]
          },
          aggs: {
            ...baseAggregation
          }
        }
      });
    } else if (['years'].includes(aggregateField)) {
      setAggregations({
        [`aggregated_parent`]: {
          date_histogram: {
            field: 'date',
            calendar_interval: 'year'
          },
          aggs: {
            ...baseAggregation
          }
        }
      });
    }
  };

  useEffect(() => {
    if (aggregateField) updateAggregation();
  }, [aggregateField, isAggregated]);

  return (
    <Flex flexDir={'row'} w="full">
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
          <MenuItem
            onClick={() => {
              setView('histogram');
            }}
          >
            Vue histogramme
          </MenuItem>
          <MenuItem
            onClick={() => {
              setView('table');
            }}
          >
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
          <MenuItem
            onClick={() => {
              setIsAggregated(true);
            }}
          >
            <Text as={isAggregated ? 'b' : 'span'}>Vue agrégée</Text>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsAggregated(false);
            }}
          >
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
            <MenuItem
              onClick={() => {
                setAggregateField('sex');
              }}
            >
              Sexe
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAggregateField('age');
              }}
            >
              Ages
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAggregateField('death_location');
              }}
            >
              Lieu de décès
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAggregateField('years');
              }}
            >
              Années
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}
