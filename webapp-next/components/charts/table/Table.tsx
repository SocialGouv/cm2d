import { Cm2dContext } from '@/utils/cm2d-provider';
import { orders, sortByOrder } from '@/utils/orders';
import { capitalizeString, getLabelFromKey, isNC } from '@/utils/tools';
import {
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr
} from '@chakra-ui/react';
import { useContext } from 'react';

type Props = {
  id: string;
  datasets: { hits: any[]; label?: string }[];
};

export const ChartTable = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { aggregations, saveAggregateX, saveAggregateY } = context;
  const { datasets, id } = props;

  if (!datasets[0]) return <>...</>;

  const availableKeys: string[] = datasets
    .reduce((acc: string[], ds) => {
      ds.hits.forEach((h: any) => {
        if (acc.indexOf(h.key) === -1) {
          acc.push(h.key);
        }
      });
      return acc;
    }, [])
    .sort();

  const NCTag = () => {
    return (
      <Tooltip
        label="Cette information est insuffisante pour être affichée afin de prévenir toute possibilité de réidentification."
        aria-label="nc tooltip"
      >
        <Tag size="xs" fontSize="xs" p={1} colorScheme="neutral" cursor="help">
          NC
        </Tag>
      </Tooltip>
    );
  };

  return (
    <TableContainer w="calc(100vw - 28rem)">
      <Table id={id} variant="primary" key={JSON.stringify(aggregations)}>
        <Thead>
          <Th></Th>
          {availableKeys
            .sort((a, b) =>
              sortByOrder(
                a.toString(),
                b.toString(),
                orders[
                  (saveAggregateY as 'sex' | 'death_location' | 'department') ||
                    'sex'
                ]
              )
            )
            .map(ak => (
              <Th key={`head-${ak}`}>{getLabelFromKey(ak, 'month')}</Th>
            ))}
          <Th>Total</Th>
        </Thead>
        <Tbody>
          {datasets
            .sort((a, b) =>
              a.label && b.label
                ? sortByOrder(
                    a.label.toString(),
                    b.label.toString(),
                    orders[
                      (saveAggregateX as
                        | 'sex'
                        | 'death_location'
                        | 'department') || 'sex'
                    ]
                  )
                : 0
            )
            .map(ds => (
              <Tr key={ds.label}>
                <Td>{ds.label && capitalizeString(ds.label)}</Td>
                {availableKeys.map((ak, index) => {
                  const hit = ds.hits.find(h => h.key === ak);
                  if (!hit) return <Td key={`${ds.label}-${index}`}>0</Td>;
                  return (
                    <Td key={`${ds.label}-${hit.key}`}>
                      {/* {isNC(hit.doc_count) ? <NCTag /> : hit.doc_count} */}
                      {hit.doc_count}
                    </Td>
                  );
                })}
                <Td>
                  {ds.hits.reduce(
                    (acc, current) =>
                      // acc + (isNC(current.doc_count) ? 0 : current.doc_count),
                      acc + current.doc_count,
                    0
                  )}
                </Td>
              </Tr>
            ))}
          <Tr>
            <Td>Total</Td>
            {availableKeys.map(ak => (
              <Td key={`total-${ak}`}>
                {datasets.reduce((acc, current) => {
                  const hit = current.hits.find(h => h.key === ak);
                  if (!hit) return acc;
                  // return acc + (isNC(hit.doc_count) ? 0 : hit.doc_count);
                  return acc + hit.doc_count;
                }, 0)}
              </Td>
            ))}
            <Td>
              {datasets.reduce(
                (acc, current) =>
                  acc +
                  current.hits.reduce(
                    (acc2, current2) =>
                      acc2 +
                      // (isNC(current2.doc_count) ? 0 : current2.doc_count),
                      current2.doc_count,
                    0
                  ),
                0
              )}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
