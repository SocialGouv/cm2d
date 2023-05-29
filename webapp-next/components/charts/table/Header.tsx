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

  const handleXAxisChange = (field: string) => {
    if (aggregateY === field) setAggregateY(aggregateX);
    setAggregateX(field);
  };

  const handleYAxisChange = (field: string) => {
    if (aggregateX === field) setAggregateX(aggregateY);
    setAggregateY(field);
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
          <MenuItem onClick={() => handleViewChange('line')}>
            Vue courbe
          </MenuItem>
          <MenuItem onClick={() => handleViewChange('map')}>Vue carte</MenuItem>
          <MenuItem onClick={() => handleViewChange('histogram')}>
            Vue histogramme
          </MenuItem>
          <MenuItem onClick={() => handleViewChange('doughnut')}>
            Vue donut
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
          <MenuItem onClick={() => handleXAxisChange('sex')}>
            <Text as={aggregateX === 'sex' ? 'b' : 'span'}>Sexe</Text>
          </MenuItem>
          <MenuItem onClick={() => handleXAxisChange('age')}>
            <Text as={aggregateX === 'age' ? 'b' : 'span'}>Age</Text>
          </MenuItem>
          <MenuItem onClick={() => handleXAxisChange('death_location')}>
            <Text as={aggregateX === 'death_location' ? 'b' : 'span'}>
              Lieu de décès
            </Text>
          </MenuItem>
          <MenuItem onClick={() => handleXAxisChange('department')}>
            <Text as={aggregateX === 'department' ? 'b' : 'span'}>
              Département
            </Text>
          </MenuItem>
          <MenuItem onClick={() => handleXAxisChange('months')}>
            <Text as={aggregateX === 'months' ? 'b' : 'span'}>Mois</Text>
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
          Ordonnée : <Text as="b">{getLabelFromElkField(aggregateY)}</Text>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleYAxisChange('sex')}>
            <Text as={aggregateY === 'sex' ? 'b' : 'span'}>Sexe</Text>
          </MenuItem>
          <MenuItem onClick={() => handleYAxisChange('age')}>
            <Text as={aggregateY === 'age' ? 'b' : 'span'}>Age</Text>
          </MenuItem>
          <MenuItem onClick={() => handleYAxisChange('death_location')}>
            <Text as={aggregateY === 'death_location' ? 'b' : 'span'}>
              Lieu de décès
            </Text>
          </MenuItem>
          <MenuItem onClick={() => handleYAxisChange('department')}>
            <Text as={aggregateY === 'department' ? 'b' : 'span'}>
              Département
            </Text>
          </MenuItem>
          <MenuItem onClick={() => handleYAxisChange('months')}>
            <Text as={aggregateY === 'months' ? 'b' : 'span'}>Mois</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
