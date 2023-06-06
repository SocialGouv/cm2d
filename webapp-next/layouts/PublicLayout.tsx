import ContainerBlock from '@/components/landing/ContainerBlock';
import { Footer } from '@/components/landing/Footer';
import NavbarLanding from '@/components/landing/NavbarLanding';
import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import { ReactNode } from 'react';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh">
      <Head>
        <title>CM2D</title>
        <meta
          name="description"
          content="Explorez les données des causes de déces."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ContainerBlock>
          <NavbarLanding />
          <Box minH="calc(100vh - 5rem)">{children}</Box>
          <Footer />
        </ContainerBlock>
      </main>
    </Box>
  );
}
