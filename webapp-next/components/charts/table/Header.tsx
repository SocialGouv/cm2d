import { ageRanges } from '@/components/layouts/Menu';
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

export function ChartTableHeader() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { setAggregations, setView } = context;

  const [aggregateX, setAggregateX] = useState<string>('sex');
  const [aggregateY, setAggregateY] = useState<string>('age');

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

    if (aggregateX === 'age') {
      xAgg = {
        range: {
          field: aggregateX,
          ranges: ageRanges
        }
      };
    }

    if (aggregateY === 'age') {
      yAgg = {
        range: {
          field: aggregateY,
          ranges: ageRanges
        }
      };
    }

    setAggregations({
      [`aggregated_x`]: {
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

  return (
    <Flex flexDir={'row'} w="full">
      <Menu>
        <MenuButton
          as={Button}
          variant="light"
          leftIcon={
            <NextImage
              src="icons/table.svg"
              width={24}
              height={24}
              alt="vue courbe"
            />
          }
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Vue : <Text as="b">Tableau</Text>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              setView('line');
            }}
          >
            Vue courbe
          </MenuItem>
          <MenuItem
            onClick={() => {
              setView('histogram');
            }}
          >
            Vue histogramme
          </MenuItem>
          <MenuItem>
            <Text as="b">Vue tableau</Text>
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
          Abscisse : <Text as="b">{getLabelFromElkField(aggregateX)}</Text>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              if (aggregateY === 'sex') setAggregateY(aggregateX);
              setAggregateX('sex');
            }}
          >
            <Text as={aggregateX === 'sex' ? 'b' : 'span'}>Sexe</Text>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (aggregateY === 'age') setAggregateY(aggregateX);
              setAggregateX('age');
            }}
          >
            <Text as={aggregateX === 'age' ? 'b' : 'span'}>Age</Text>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (aggregateY === 'death_location') setAggregateY(aggregateX);
              setAggregateX('death_location');
            }}
          >
            <Text as={aggregateX === 'death_location' ? 'b' : 'span'}>
              Lieu de décès
            </Text>
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
          Abscisse : <Text as="b">{getLabelFromElkField(aggregateY)}</Text>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              if (aggregateX === 'sex') setAggregateX(aggregateY);
              setAggregateY('sex');
            }}
          >
            <Text as={aggregateY === 'sex' ? 'b' : 'span'}>Sexe</Text>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (aggregateX === 'age') setAggregateX(aggregateY);
              setAggregateY('age');
            }}
          >
            <Text as={aggregateY === 'age' ? 'b' : 'span'}>Age</Text>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (aggregateX === 'death_location') setAggregateX(aggregateY);
              setAggregateY('death_location');
            }}
          >
            <Text as={aggregateY === 'death_location' ? 'b' : 'span'}>
              Lieu de décès
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
