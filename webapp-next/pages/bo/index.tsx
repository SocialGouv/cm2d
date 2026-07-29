import { ChartDoughnut } from '@/components/charts/doughnut/Doughnut';
import { ChartHistogram } from '@/components/charts/histogram/Histogram';
import { ChartLine } from '@/components/charts/line/Line';
import MapIframe from '@/components/charts/map/Map';
import { ChartTable } from '@/components/charts/table/Table';
import { ClosableAlert } from '@/components/layouts/ClosableAlert';
import { KPI } from '@/components/layouts/KPI';
import { SessionExpiredCard } from '@/components/layouts/SessionExpiredCard';
import { isSessionExpired, useData } from '@/utils/api';
import { Cm2dContext } from '@/utils/cm2d-provider';
import {
  addMissingSizes,
  capitalizeString,
  getCSVDataFromDatasets,
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

  const { filters, aggregations, view, setCSVData, dateInterval } = context;

  const { data, dataKind, isLoading, isError, isErrorKind } = useData(
    filters,
    aggregations
  );

  const fetchNewTitle = async () => {
    if (!filters.categories[0]) setTitle('Nombre de certificats de décès');
    else
      switch (filters.categories_search) {
        case 'full':
          setTitle(
            `Nombre de certificats de décès faisant mention de la cause “${capitalizeString(
              filters.categories[0]
            )}” ${
              !!filters.categories_associate.length
                ? '(avec causes associées)'
                : ''
            }`
          );
          break;
        case 'category_1':
          setTitle(
            `Nombre de certificats de décès faisant mention de la cause “${capitalizeString(
              filters.categories[0]
            )}” dans le processus morbide`
          );
          break;
        case 'category_2':
          setTitle(
            `Nombre de certificats de décès ayant comme cause associée ou comorbidité “${capitalizeString(
              filters.categories[0]
            )}”`
          );
          break;
      }
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

  useEffect(() => {
    if (data && view) {
      setCSVData(
        getCSVDataFromDatasets(getViewDatasets(data, view), view, dateInterval)
      );
    }
  }, [data, view, dateInterval]);

  // Erreur AVANT le chargement : sur échec, `data` reste undefined donc le test
  // de chargement `|| !data` serait vrai à l'infini (spinner sans issue). On
  // bascule sur un panneau d'erreur (session expirée le plus souvent : API key
  // périmée pendant la nuit) offrant une reconnexion.
  if (isError || isErrorKind)
    return (
      <SessionExpiredCard
        expired={isSessionExpired(isError) || isSessionExpired(isErrorKind)}
      />
    );

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
    ((dataKind.result?.aggregations?.aggregated_x?.buckets.find(
      (_: { doc_count: number; key: string }) => _.key === 'Electronique'
    )?.doc_count || 1) /
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
              Attention : les données ne sont pas exhaustives pour les décès
              ultérieurs au {getSixMonthAgoDate()}.
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
          position="relative"
        >
          <Text
            as="h2"
            fontSize="2xl"
            fontWeight={700}
            mb={['line', 'histogram', 'doughnut'].includes(view) ? 2 : 6}
          >
            {capitalizeString(title)}
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
