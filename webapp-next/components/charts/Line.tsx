import { lineProps } from '@/utils/chartjs/props';
import { ScriptableContext } from 'chart.js';
import { Line } from 'react-chartjs-2';

type Props = {
  id: string;
  hits: any[];
};

export const ChartLine = (props: Props) => {
  const { hits, id } = props;
  const xValues = hits.map((item: any) => new Date(item.key_as_string));
  const yValues = hits.map((item: any) => item.doc_count);

  return (
    <Line
      id={id}
      data={{
        labels: xValues,
        datasets: [
          {
            label: 'Nombre de décès',
            data: yValues,
            fill: true,
            borderColor: '#246CF9',
            borderWidth: 2,
            backgroundColor: (context: ScriptableContext<'line'>) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 500, 0, 0);
              gradient.addColorStop(0, '#FFFFFF');
              gradient.addColorStop(0.5, '#EBF1FE');
              gradient.addColorStop(1, '#D4E2FE');
              return gradient;
            },
            pointStyle: 'line',
            tension: 0.5
          }
        ]
      }}
      {...lineProps}
    />
  );
};
