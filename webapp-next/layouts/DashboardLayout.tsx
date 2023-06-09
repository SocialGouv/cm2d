import { ChartHeader } from '@/components/charts/Header';
import { FiltersShortcut } from '@/components/layouts/FiltersShortcut';
import { Header } from '@/components/layouts/Header';
import { Menu } from '@/components/layouts/Menu';
import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import { ReactNode } from 'react';

export function DashboardLayout({ children }: { children: ReactNode }) {
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
      <Flex p={5}>
        <Box mr={5}>
          <Menu />
        </Box>
        <Flex flexDir="column" w="full">
          <Header />
          <Flex flexDir="column" position="sticky" top={0}>
            <FiltersShortcut />
            <ChartHeader />
            <main>{children}</main>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
