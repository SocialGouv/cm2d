import { ColumnWithImage } from '@/components/login/ColumnWithImage';
import { FormLogin } from '@/components/login/FormLogin';
import { Box, Flex, Wrap, WrapItem } from '@chakra-ui/react';

export default function LoginPage() {
  return (
    <Flex maxH="100vh" px={4} w="full">
      <Flex display={['none', 'none', 'none', 'none', 'flex']} w="50%" py={6}>
        <ColumnWithImage />
      </Flex>
      <Flex w={['full', 'full', 'full', 'full', '50%']}>
        <FormLogin />
      </Flex>
    </Flex>
  );
}
