import { Flex } from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';
import { FilterDates } from '../filters/Dates';

export function Header() {
  return (
    <Flex
      flexDir={'column'}
      py={8}
      px={4}
      borderRadius={16}
      bg="white"
      w="full"
      boxShadow="box-shadow: 0px 10px 15px -3px rgba(36, 108, 249, 0.04), 0px 4px 6px -2px rgba(36, 108, 249, 0.04);"
    >
      <FilterDates />
    </Flex>
  );
}
