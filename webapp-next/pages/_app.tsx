import '@fontsource/inter/600.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/400.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import theme from '@/utils/chakra-theme';
import '../utils/overrides.css';
import { FilterProvider } from '@/utils/filters-provider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <FilterProvider>
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      </FilterProvider>
    </ChakraProvider>
  );
}
