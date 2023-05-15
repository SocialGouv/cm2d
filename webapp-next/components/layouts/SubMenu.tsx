import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

type Props = {
  title: string;
  icon: {
    src: string;
    alt: string;
  };
  children: ReactNode;
};

export const SubMenu = (props: Props) => {
  const { title, icon, children } = props;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return (
    <Box>
      <Button
        colorScheme="primary"
        onClick={() => setIsCollapsed(!isCollapsed)}
        w="full"
        justifyContent="start"
        py={7}
        rounded="md"
      >
        <Image src={icon.src} alt={icon.alt} width={24} height={24} />{' '}
        <Text ml={2}>{title}</Text>
        {isCollapsed ? (
          <ChevronRightIcon ml="auto" fontSize="2xl" />
        ) : (
          <ChevronDownIcon ml="auto" fontSize="2xl" />
        )}
      </Button>
      <Box px={4} py={5}>
        {!isCollapsed && children}
      </Box>
    </Box>
  );
};
