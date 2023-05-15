import { FilterContext } from '@/utils/filters-provider';
import { Flex } from '@chakra-ui/react';
import { useContext } from 'react';

export function Header() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('Header must be used within a FilterProvider');
  }

  const { filters, setFilters } = context;

  return (
    <Flex
      flexDir={'column'}
      py={8}
      borderRadius={16}
      bg="white"
      w="full"
      boxShadow="box-shadow: 0px 10px 15px -3px rgba(36, 108, 249, 0.04), 0px 4px 6px -2px rgba(36, 108, 249, 0.04);"
    >
      Hi
    </Flex>
  );
}
