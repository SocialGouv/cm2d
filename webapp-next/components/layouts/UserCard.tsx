import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

type User = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
};

type UserCardProps = {
  user: User;
};

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Box
      borderBottomRadius="lg"
      overflow="hidden"
      py={4}
      px={4}
      bg={'primary.50'}
      mt={4}
    >
      <Flex alignItems="center">
        <Avatar
          src={user.avatar}
          name={`${user.firstName} ${user.lastName}`}
          size="md"
          mr={2}
        />
        <Box>
          <Text fontSize="md" fontWeight="400">
            {user.firstName} {user.lastName}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {user.email}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
