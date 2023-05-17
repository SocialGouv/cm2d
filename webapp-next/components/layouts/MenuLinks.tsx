import { Box, Flex, Icon, Link, List, ListItem, Text } from "@chakra-ui/react";
import Image from 'next/image';
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
    <Flex flexDir={"column"} py={2} borderRadius={16} bg="white" width={40} >
      <List display="flex" alignItems="left">
        {links.map((link, index) => (
          <ListItem key={index} my={2}>
            <Link href={link.link} display="flex" alignItems="left">
              {link.icon && (
               <Image src={link.icon} width={24} height={24} alt="icon"/>
              )}
              <Text fontSize={"medium"} paddingLeft={2}>{link.label}</Text>
            </Link>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};
