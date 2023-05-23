import { Cm2dContext } from '@/utils/cm2d-provider';
import { Flex } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { ChartLineHeader } from './line/Header';
import { ChartTableHeader } from './table/Header';
import { ChartHistogramHeader } from './histogram/Header';

export function ChartHeader() {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { view } = context;

  const displayHeaderView = (): ReactNode => {
    switch (view) {
      case 'line':
        return <ChartLineHeader />;
      case 'table':
        return <ChartTableHeader />;
      case 'histogram':
        return <ChartHistogramHeader />;
      default:
        return <>NO VIEW</>;
    }
  };

  return (
    <Flex flexDir={'row'} mb={6} w="full">
      {displayHeaderView()}
    </Flex>
  );
}