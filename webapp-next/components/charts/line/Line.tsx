import { lineProps } from '@/utils/chartjs/props';
import { Cm2dContext } from '@/utils/cm2d-provider';
import { orders, sortByOrder } from '@/utils/orders';
import {
  capitalizeString,
  formatDateByInterval,
  getLabelFromKey,
  getRandomColor
} from '@/utils/tools';
import { ScriptableContext } from 'chart.js';
import { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

type Props = {
  id: string;
  datasets: { hits: any[]; label?: string }[];
};

export const ChartLine = (props: Props) => {
  const { datasets, id } = props;
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, saveAggregateX, dateInterval } = context;

  const [displayDatasets, setDisplayDatasets] = useState<any[]>([]);

  useEffect(() => {
    if (datasets && datasets.length)
      setDisplayDatasets(
        datasets
          .map(ds => {
            const yValues = ds.hits.map((item: any) => item.doc_count);
            let label = 'nombre de décès';

            if (ds.label) {
              label = getLabelFromKey(ds.label.toString());
            }

            return {
              label: capitalizeString(label),
              data: yValues,
              fill: true,
              borderWidth: 2,
              tension: 0.5
            };
          })
          .sort((a, b) =>
            sortByOrder(
              a.label.toString(),
              b.label.toString(),
              orders[
                (saveAggregateX as 'sex' | 'death_location' | 'department') ||
                  'sex'
              ]
            )
          )
          .map((ds, index) => {
            const hasMultipleDatasets = datasets.length > 1;

            return {
              ...ds,
              borderColor: hasMultipleDatasets
                ? getRandomColor(index)
                : '#002395',
              backgroundColor: hasMultipleDatasets
                ? () => {
                    return 'transparent';
                  }
                : (context: ScriptableContext<'line'>) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 500, 0, 0);
                    gradient.addColorStop(0, '#FFFFFF');
                    gradient.addColorStop(0.5, '#EBF1FE');
                    gradient.addColorStop(1, '#D4E2FE');
                    return gradient;
                  }
            };
          })
      );
  }, [datasets]);

  if (!datasets.length || !filters.start_date || !filters.end_date)
    return <></>;

  const min = new Date(filters.start_date);
  const max = new Date(filters.end_date);

  // L'année n'est affichée sur l'axe que si la période couvre plusieurs années.
  const multiYear = min.getFullYear() !== max.getFullYear();

  const datasetWithMostHits = datasets.reduce((prev, current) => {
    return prev.hits.length > current.hits.length ? prev : current;
  }, datasets[0]);

  const xValues = datasetWithMostHits.hits.map((item: any) => {
    const currentDate = new Date(item.key_as_string);

    if (currentDate.getTime() < min.getTime())
      return formatDateByInterval(min, dateInterval, multiYear);
    if (currentDate.getTime() > max.getTime())
      return formatDateByInterval(max, dateInterval, multiYear);

    return formatDateByInterval(
      new Date(item.key_as_string),
      dateInterval,
      multiYear
    );
  });

  return (
    <Line
      id={id}
      data={{
        labels: xValues,
        datasets: displayDatasets
      }}
      {...lineProps}
    />
  );
};
