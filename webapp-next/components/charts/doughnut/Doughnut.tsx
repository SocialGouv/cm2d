import { doughnutProps } from '@/utils/chartjs/props';
import { Cm2dContext } from '@/utils/cm2d-provider';
import { orders, sortByOrder } from '@/utils/orders';
import {
  capitalizeString,
  chartsAvailableColors,
  getLabelFromKey
} from '@/utils/tools';
import { useContext, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

type Props = {
  id: string;
  datasets: { hits: any[]; label?: string }[];
};

export const ChartDoughnut = (props: Props) => {
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { saveAggregateX } = context;

  const { datasets, id } = props;
  const [displayDatasets, setDisplayDatasets] = useState<any[]>([]);

  useEffect(() => {
    if (datasets && datasets.length)
      setDisplayDatasets(
        datasets.map(ds => {
          const yValues = ds.hits
            .sort((a, b) =>
              sortByOrder(
                a.key.toString(),
                b.key.toString(),
                orders[
                  (saveAggregateX as 'sex' | 'death_location' | 'department') ||
                    'sex'
                ]
              )
            )
            .map((item: any) => item.doc_count);

          let label = 'nombre de décès';

          if (ds.label) {
            label = getLabelFromKey(ds.label.toString());
          }

          const colors = yValues.map(
            (_, index) =>
              chartsAvailableColors[index % chartsAvailableColors.length]
          );

          return {
            label: capitalizeString(label),
            data: yValues,
            fill: true,
            borderRadius: 10,
            backgroundColor: colors
          };
        })
      );
  }, [datasets]);

  if (!datasets.length) return <></>;

  const xValues = datasets[0].hits
    .map((item: any) => {
      const label = getLabelFromKey(item.key);
      return capitalizeString(label);
    })
    .sort((a, b) =>
      sortByOrder(
        a,
        b,
        orders[
          (saveAggregateX as 'sex' | 'death_location' | 'department') || 'sex'
        ]
      )
    );

  return (
    <Doughnut
      id={id}
      data={{
        labels: xValues,
        datasets: displayDatasets
      }}
      {...doughnutProps}
    />
  );
};
