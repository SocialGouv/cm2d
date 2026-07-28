import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { ReactNode } from 'react';

export function LightLayout({ children }: { children: ReactNode }) {
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
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <main>{children}</main>
    </Box>
  );
}
