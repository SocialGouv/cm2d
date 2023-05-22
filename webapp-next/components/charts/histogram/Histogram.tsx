import { histogramProps } from '@/utils/chartjs/props';
import { dateToMonthYear, isStringContainingDate } from '@/utils/tools';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

type Props = {
  id: string;
  datasets: { hits: any[]; label?: string }[];
};

export const ChartHistogram = (props: Props) => {
  const { datasets, id } = props;
  const [displayDatasets, setDisplayDatasets] = useState<any[]>([]);

  useEffect(() => {
    if (datasets && datasets.length)
      setDisplayDatasets(
        datasets.map(ds => {
          const yValues = ds.hits.map((item: any) => item.doc_count);
          let label = 'nombre de décès';

          if (ds.label) {
            label = ds.label;
          }

          return {
            label: label.charAt(0).toUpperCase() + label.substring(1),
            data: yValues,
            fill: true,
            backgroundColor: '#246CF9',
            borderRadius: 10
          };
        })
      );
  }, [datasets]);

  if (!datasets.length) return <></>;

  const xValues = datasets[0].hits.map((item: any) =>
    isStringContainingDate(item.key)
      ? dateToMonthYear(new Date(item.key))
      : item.key.charAt(0).toUpperCase() + item.key.substring(1)
  );

  return (
    <Bar
      id={id}
      data={{
        labels: xValues,
        datasets: displayDatasets
      }}
      {...histogramProps}
    />
  );
};
