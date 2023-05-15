import Head from 'next/head';
import { Inter } from '@next/font/google';
import { useContext } from 'react';
import { FilterContext } from '@/utils/filters-provider';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('Menu must be used within a FilterProvider');
  }

  const { filters } = context;

  return <pre>{JSON.stringify(filters, null, 2)}</pre>;
}
