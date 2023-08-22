import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
export default function ColumnWithImage() {
  return (
    <Flex
      h="calc(100vh - 5rem)"
      alignItems="center"
      justifyContent="center"
      position={'relative'}
      py={16}
      flexDirection={['column', 'column', 'column', 'column', 'row']}
    >
      <Flex
        w={['auto', 'auto', 'auto', 'auto', '50%']}
        alignItems="center"
        pl={[4, 4, 4, 4, 'calc(50vw - 1252px/2 + 1rem)']}
      >
        <Box>
          <Text
            fontSize={['20px', '30px', '48px']}
            fontWeight="700"
            mb={8}
            pr={[0, 10, 20]}
            lineHeight={1.2}
          >
            Explorez <br />
            les données sur <br />
            les causes de décès
          </Text>
          <Text
            mb={6}
            fontWeight={'400'}
            fontSize={['14px', '16px', '18px']}
            color={'neutral.500'}
          >
            L’application CM2D permet de générer des visualisations de données
            sur mesure afin d’orienter et d’évaluer vos actions sur le terrain.
          </Text>
          <NextLink href={'/login'}>
            <Button
              variant="ghost"
              bg={'primary.500'}
              color={'white'}
              _hover={{}}
              height="12"
              width={'40'}
            >
              CONNEXION
            </Button>
          </NextLink>
        </Box>
      </Flex>
      <Box
        pb={[5, 12, 15]}
        w={['auto', 'auto', 'auto', 'auto', '50%']}
        display={['none', 'none', 'none', 'none', 'block']}
        mt={10}
      >
        <Image src="/dashboard.svg" alt="Image" w="95%" float="right" pt={2} />
      </Box>

      <Box
        position="absolute"
        display={['none', 'none', 'none', 'none', 'block']}
        top={0}
        right="0"
        width="30%"
        height="full"
        backgroundColor="primary.50"
        zIndex={-1}
        pb={5}
      />
    </Flex>
  );
}
