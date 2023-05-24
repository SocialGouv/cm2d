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
import { useContext, useEffect } from 'react';

export function ChartMapHeader() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { setAggregations, setView } = context;

  const updateAggregation = () => {
    setAggregations({
      aggregated_x: {
        terms: {
          field: 'department'
        }
      }
    });
  };

  useEffect(() => {
    updateAggregation();
  }, []);

  const handleViewChange = (view: View) => {
    setView(view);
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
    </Flex>
  );
}
