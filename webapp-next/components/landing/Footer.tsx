import { Divider, HStack, IconButton, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export const Footer = () => {
  return (
    <Stack
      marginInline="auto"
      p={8}
      spacing={{ base: 8, md: 0 }}
      justifyContent="space-between"
      alignItems="center"
      bg={'neutral.900'}
    >
      <Stack alignItems="center" color={'white'}>
        <HStack alignItems="center">
          <NextLink href={'/legals/mentions-legales'}>
            <Text
              fontSize={['12px', '14px', '16px']}
              fontWeight={500}
              mx={[6, 1, 2]}
            >
              Mentions légales
            </Text>
          </NextLink>

          <NextLink href={'/legals/cgu'}>
            <Text
              fontSize={['12px', '14px', '16px']}
              fontWeight={500}
              mx={[6, 1, 2]}
            >
              Conditions générales d&apos;utilisation
            </Text>
          </NextLink>

          <NextLink href={'/legals/pc'}>
            <Text
              fontSize={['12px', '14px', '16px']}
              fontWeight={500}
              mx={[6, 1, 2]}
            >
              Politique de confidentialité
            </Text>
          </NextLink>
        </HStack>
      </Stack>
    </Stack>
  );
};
