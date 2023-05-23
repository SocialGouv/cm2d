import { Box, Flex, Icon, Link, List, ListItem, Text } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
interface Link {
  label: string;
  icon: string;
  link: string;
}

interface Props {
  links: Link[];
}

export const MenuLinks: React.FC<Props> = ({ links }) => {
  return (
    <Flex flexDir={'column'} mb={10} bg="white" width={40}>
      {links.map((link, index) => (
        <Link
          as={NextLink}
          href={link.link}
          display="flex"
          alignItems="left"
          mt={8}
          key={index}
        >
          {link.icon && (
            <Image src={link.icon} width={24} height={24} alt="icon" />
          )}
          <Text fontSize={'md'} fontWeight={500} paddingLeft={3}>
            {link.label}
          </Text>
        </Link>
      ))}
    </Flex>
  );
};
