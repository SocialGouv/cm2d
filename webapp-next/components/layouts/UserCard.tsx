import { Avatar, Box, Flex, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react';
import React from 'react';
import type { User } from '@/utils/cm2d-provider';
 
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
        <SkeletonCircle size="12" mr={2} isLoaded={!!user.firstName}>
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
          />
        </SkeletonCircle>
        <Box>
          <SkeletonText noOfLines={2} spacing="3" isLoaded={!!user.firstName && !!user.lastName}>
            <Text fontSize="md" fontWeight="400">
              {user.firstName} {user.lastName}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {user.email}
            </Text>
          </SkeletonText>
        </Box>
      </Flex>
    </Box>
  );
};
