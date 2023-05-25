import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import { ReactNode } from 'react';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Box bg="gray.50" minH="100vh">
      <Head>
        <title>CM2D</title>
        <meta
          name="description"
          content="Explorez les données des causes de déces."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </Box>
  );
}
