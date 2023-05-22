import { Cm2dContext } from '@/utils/cm2d-provider';
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useContext } from 'react';

type Props = {
  id: string;
  datasets: { hits: any[]; label?: string }[];
  rowsLabel: string;
};

export const ChartTable = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { aggregations } = context;
  const { datasets, rowsLabel, id } = props;

  if (!datasets[0]) return <>...</>;

  const nbCols = datasets[0].hits.length;

  return (
    <TableContainer textTransform="capitalize">
      <Table id={id} variant="primary" key={JSON.stringify(aggregations)}>
        <Thead>
          <Th></Th>
          {datasets[0].hits.map(h => (
            <Th key={`head-${h.label}`}>{h.key}</Th>
          ))}
          <Th>Total</Th>
        </Thead>
        <Tbody>
          {datasets.map(ds => (
            <Tr key={ds.label}>
              <Td>{ds.label}</Td>
              {ds.hits.map(h => (
                <Td key={`${ds.label}-${h.key}`}>{h.doc_count}</Td>
              ))}
              <Td>
                {ds.hits.reduce((acc, current) => acc + current.doc_count, 0)}
              </Td>
            </Tr>
          ))}
          <Tr>
            <Td>Total</Td>
            {Array(nbCols)
              .fill(0)
              .map((zero, index) => (
                <Td key={index}>
                  {datasets.reduce(
                    (acc, current) => acc + current.hits[index].doc_count,
                    0
                  )}
                </Td>
              ))}
            <Td>
              {datasets.reduce(
                (acc, current) =>
                  acc +
                  current.hits.reduce(
                    (acc2, current2) => acc2 + current2.doc_count,
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
