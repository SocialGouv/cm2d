import { Cm2dContext } from '@/utils/cm2d-provider';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useContext } from 'react';

type Props = {};

export const ActionMenu = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { CSVData } = context;

  const exportData = () => {
    let csvContent = '';
    CSVData.forEach(value => {
      csvContent += value.join(';');
      csvContent += '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    let url = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `export_${new Date().getTime()}.csv`;

    downloadLink.click();
  };

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
        <MenuItem isDisabled={!CSVData.length} onClick={exportData}>
          Exporter en CSV
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
