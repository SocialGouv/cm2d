import { Flex } from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';
import { ActionBookmarks } from '../actions/Bookmarks';
import { ActionMenu } from '../actions/Menu';

export function Header() {
  return (
    <Flex
      flexDir={'row'}
      py={6}
      px={4}
      borderRadius={16}
      bg="white"
      w="full"
      justifyContent={'end'}
    >
      {/* <ActionBookmarks /> */}
      <ActionMenu />
    </Flex>
  );
}
