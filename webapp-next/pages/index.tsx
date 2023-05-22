import { ChartLine } from '@/components/charts/line/Line';
import { useData } from '@/utils/api';
import { Cm2dContext } from '@/utils/cm2d-provider';
import { isStringContainingDate } from '@/utils/tools';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import 'chart.js/auto';
import 'chartjs-adapter-moment';
import { useContext, useEffect, useState } from 'react';

export default function Home() {
  const context = useContext(Cm2dContext);
  const [title, setTitle] = useState('Nombre de décès');

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, aggregations } = context;

  const { data, isLoading } = useData(filters, aggregations);

  const fetchNewTitle = async () => {
    setTitle('Nombre de décès');
    // setTitle('...');
    // const res = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     text: getTitleGptPrompt(JSON.stringify(filters))
    //   })
    // });
    // const json = await res.json();
    // setTitle(json.text);
  };

  useEffect(() => {
    fetchNewTitle();
  }, [filters]);

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <Spinner color="#246CF9" size="xl" />
      </Box>
    );

  let datasets: { hits: any[] }[] = [];

  if (data.result.aggregations.aggregated_date) {
    datasets = [{ hits: data.result.aggregations.aggregated_date.buckets }];
  } else if (data.result.aggregations.aggregated_parent) {
    datasets = data.result.aggregations.aggregated_parent.buckets
      .map((apb: any) => ({
        hits: apb.aggregated_date.buckets,
        label: isStringContainingDate(apb.key)
          ? new Date(apb.key).getFullYear().toString()
          : apb.key
      }))
      .filter((apb: any) => !!apb.hits.length);
  }

  return (
    <Flex
      flexDir={'column'}
      pt={8}
      pb={20}
      px={6}
      borderRadius={16}
      bg="white"
      w="full"
      boxShadow="box-shadow: 0px 10px 15px -3px rgba(36, 108, 249, 0.04), 0px 4px 6px -2px rgba(36, 108, 249, 0.04);"
    >
      <Box maxH="30rem">
        <Text as="h2" fontSize="2xl" fontWeight={700} mb={6}>
          {title}
        </Text>
        <ChartLine id="line-example" datasets={datasets} />
      </Box>
    </Flex>
  );
}
