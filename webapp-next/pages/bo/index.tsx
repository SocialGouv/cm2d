import { ChartDoughnut } from '@/components/charts/doughnut/Doughnut';
import { ChartHistogram } from '@/components/charts/histogram/Histogram';
import { ChartLine } from '@/components/charts/line/Line';
import MapIframe from '@/components/charts/map/Map';
import { ChartTable } from '@/components/charts/table/Table';
import { ClosableAlert } from '@/components/layouts/ClosableAlert';
import { KPI } from '@/components/layouts/KPI';
import { useData } from '@/utils/api';
import { Cm2dContext } from '@/utils/cm2d-provider';
import {
  getSixMonthAgoDate,
  getViewDatasets,
  isRangeContainsLastSixMonths
} from '@/utils/tools';
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

  const { filters, aggregations, view } = context;

  const { data, dataKind, isLoading } = useData(filters, aggregations);

  const fetchNewTitle = async () => {
    setTitle(
      filters.categories_level_1[0]
        ? `Nombre de décès par ${filters.categories_level_1[0]}`
        : 'Nombre de décès'
    );
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

  if (isLoading || !dataKind || !data)
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

  if (!data.result.hits.total.value)
    return (
      <Flex
        justifyContent="center"
        py={12}
        px={6}
        borderRadius={16}
        bg="white"
        w="full"
        boxShadow="0px 8px 15px -4px rgba(36, 108, 249, 0.08), 0px 4px 6px -2px rgba(36, 108, 249, 0.08);"
      >
        <Text role="status" textAlign="center">
          <Text as="span" fontSize="3xl">
            😞
          </Text>
          <br />
          Aucun résultat ne correspond à ces critères.
          <br />
          Merci de modifier votre plage temporelle ou d&apos;ajuster les filtres
          complémentaires.
        </Text>
      </Flex>
    );

  const electronicPercentage =
    ((dataKind.result?.aggregations?.aggregated_x?.buckets[0]?.doc_count || 1) /
      (dataKind.result?.hits?.total?.value || 1)) *
    100;
  const total = data.result?.hits?.total?.value || 0;
  let datasets = getViewDatasets(data, view);

  const ChartDisplay = () => {
    switch (view) {
      case 'line':
        return <ChartLine id="line-cm2d" datasets={datasets} />;
      case 'table':
        return <ChartTable id="table-cm2d" datasets={datasets} />;
      case 'histogram':
        return <ChartHistogram id="histogram-cm2d" datasets={datasets} />;
      case 'doughnut':
        return <ChartDoughnut id="doughnut-cm2d" datasets={datasets} />;
      case 'map':
        return <MapIframe id="map-cm2d" datasets={datasets} />;
      default:
        return <>Pas de dataviz configurée pour cette vue</>;
    }
  };

  return (
    <Flex flexDir="column">
      {isRangeContainsLastSixMonths(filters.start_date, filters.end_date) && (
        <ClosableAlert
          status="warning"
          mb={8}
          content={
            <>
              Attention : veuillez prendre en compte que les données ne sont pas
              consolidées pour les dates ultérieures au {getSixMonthAgoDate()}.
              <br />
              En conséquence, l&apos;exhaustivité de toute information
              postérieure à cette date ne peut être garantie.
            </>
          }
        />
      )}
      <Flex
        flexDir={'column'}
        pt={8}
        pb={['table', 'map'].includes(view) ? 6 : 36}
        px={6}
        borderRadius={16}
        bg="white"
        w="full"
        boxShadow="0px 8px 15px -4px rgba(36, 108, 249, 0.08), 0px 4px 6px -2px rgba(36, 108, 249, 0.08);"
      >
        <Box
          maxH={
            ['line', 'histogram', 'doughnut'].includes(view) ? '30rem' : 'auto'
          }
        >
          <Text
            as="h2"
            fontSize="2xl"
            fontWeight={700}
            mb={['line', 'histogram', 'doughnut'].includes(view) ? 2 : 6}
          >
            {title.charAt(0).toUpperCase() + title.substring(1)}
          </Text>
          <ChartDisplay />
          <Flex justifyContent={'space-between'} mt={8}>
            <KPI prefix="Total de la sélection" kpi={`${total} décès`} />
            <KPI
              prefix="Taux de certificats électroniques de la sélection"
              kpi={`${
                parseInt((electronicPercentage * 100).toString()) / 100
              }%`}
            />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
