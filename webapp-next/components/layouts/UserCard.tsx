import { Avatar, Box, Flex, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react';
import React from 'react';
import type { User } from '@/utils/cm2d-provider';
 
type UserCardProps = {
  user: User;
};

export const UserCard: React.FC<UserCardProps> = ({ user }) => {

  const { fullName, email, username } = user;

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
        <SkeletonCircle size="12" mr={2} isLoaded={!!username}>
          <Avatar
            name={fullName ? fullName : username}
          />
        </SkeletonCircle>
        <Box>
          <SkeletonText noOfLines={2} spacing="3" isLoaded={!!username}>
            <Text fontSize="md" fontWeight="400">
              {fullName ? fullName : username}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {email}
            </Text>
          </SkeletonText>
        </Box>
      </Flex>
    </Box>
  );
};
