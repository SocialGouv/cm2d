import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

type Props = {};

export const ActionMenu = (props: Props) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={
          <HamburgerIcon
            borderRadius="full"
            p={1}
            bg="primary.300"
            color="white"
            w={5}
            h={5}
          />
        }
        colorScheme="primary"
      >
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem isDisabled>Exporter en CSV</MenuItem>
      </MenuList>
    </Menu>
  );
};
