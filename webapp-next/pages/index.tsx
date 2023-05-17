import { ChartLine } from '@/components/charts/Line';
import { useData } from '@/utils/api';
import { FilterContext } from '@/utils/filters-provider';
import { getTitleGptPrompt } from '@/utils/prompts';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import 'chart.js/auto';
import 'chartjs-adapter-moment';
import { useContext, useEffect, useState } from 'react';

export default function Home() {
  const context = useContext(FilterContext);
  const [title, setTitle] = useState('Nombre de décès');

  if (!context) {
    throw new Error('Menu must be used within a FilterProvider');
  }

  const { filters } = context;

  const { data, isLoading } = useData(filters);

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

  const hits = data.result.aggregations.aggregated_date.buckets;

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
        <ChartLine id="line-example" hits={hits} />
      </Box>
    </Flex>
  );
}
