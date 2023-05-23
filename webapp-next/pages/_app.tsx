import '@fontsource/inter/600.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/400.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import theme from '@/utils/chakra-theme';
import '../utils/overrides.css';
import { Cm2dProvider } from '@/utils/cm2d-provider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Cm2dProvider>
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      </Cm2dProvider>
    </ChakraProvider>
  );
}
