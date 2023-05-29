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

export function ChartHistogramHeader() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { setAggregations, setView } = context;

  const [aggregateX, setAggregateX] = useState<string>('sex');

  const updateAggregation = () => {
    let xAgg: any = {
      terms: {
        field: aggregateX
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

  const handleXAxisChange = (field: string) => {
    setAggregateX(field);
  };

  return (
    <Flex flexDir="row" w="full">
      <Menu>
        <MenuButton
          as={Button}
          variant="light"
          leftIcon={
            <NextImage
              src="icons/chart-bar-alt.svg"
              width={24}
              height={24}
              alt="vue histogram"
            />
          }
          rightIcon={<ChevronDownIcon color="primary.200" w={5} h={5} />}
        >
          Vue : <Text as="b">Histogramme</Text>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleViewChange('line')}>
            Vue courbe
          </MenuItem>
          <MenuItem onClick={() => handleViewChange('map')}>Vue carte</MenuItem>
          <MenuItem>
            <Text as="b">Vue histogramme</Text>
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
          <MenuItem onClick={() => handleXAxisChange('years')}>
            <Text as={aggregateX === 'years' ? 'b' : 'span'}>Année</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
