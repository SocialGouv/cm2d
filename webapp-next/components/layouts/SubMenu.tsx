import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

type Props = {
  title: string | JSX.Element;
  icon: {
    src: string;
    srcOpen?: string;
    alt: string;
  };
  children: ReactNode;
};

export const SubMenu = (props: Props) => {
  const { title, icon, children } = props;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return (
    <Box mb={4}>
      <Button
        colorScheme="primary"
        variant={isCollapsed ? 'ghost' : 'solid'}
        onClick={() => setIsCollapsed(!isCollapsed)}
        w="full"
        justifyContent="start"
        py={8}
        rounded="md"
      >
        <Image
          src={icon.srcOpen && !isCollapsed ? icon.srcOpen : icon.src}
          alt={icon.alt}
          width={24}
          height={24}
        />{' '}
        <Text
          ml={2}
          color={isCollapsed ? 'black' : 'primary'}
          fontWeight={isCollapsed ? 400 : 600}
          textAlign="left"
        >
          {title}
        </Text>
        {isCollapsed ? (
          <ChevronRightIcon ml="auto" fontSize="2xl" />
        ) : (
          <ChevronDownIcon ml="auto" fontSize="2xl" />
        )}
      </Button>

      {!isCollapsed && (
        <Box px={4} py={5}>
          {children}
        </Box>
      )}
    </Box>
  );
};
