import { lineProps } from '@/utils/chartjs/props';
import { Cm2dContext } from '@/utils/cm2d-provider';
import { orders, sortByOrder } from '@/utils/orders';
import {
  capitalizeString,
  dateToWeekYear,
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
              // Conservé pour le remappage mois-de-l'année (comparaison années).
              hits: ds.hits,
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

  // Comparaison année-sur-année : les séries (2022, 2023…) ont des buckets de
  // dates ABSOLUES distinctes. On les remappe sur un axe commun « mois de
  // l'année » (année de référence neutre) pour qu'elles se superposent, au lieu
  // d'un alignement par index qui décalait les courbes.
  // Axe normalisé (superposition par mois/semaine/jour) : stratification par
  // année OU mode comparaison « même période, autre année ».
  const isYearComparison = saveAggregateX === 'years' || !!filters.compare_year;
  let labels = xValues;
  let renderDatasets = displayDatasets.map(({ hits, ...rest }: any) => rest);

  if (isYearComparison) {
    const REF_YEAR = 2000;
    // Position sur l'axe + libellé d'un bucket, INDÉPENDAMMENT de l'année, selon
    // la granularité :
    //  - semaine : numéro de semaine ISO (une même semaine tombe sur des dates
    //    calendaires différentes selon l'année → normaliser par date serait faux),
    //  - jour    : jour/mois,
    //  - mois    : index de mois.
    const bucketKeyLabel = (
      keyAsString: string
    ): { key: number; label: string } => {
      const d = new Date(keyAsString);
      if (dateInterval === 'week') {
        const label = dateToWeekYear(d).split(' ')[0]; // "S28 2024" -> "S28"
        return { key: parseInt(label.replace(/\D/g, ''), 10), label };
      }
      if (dateInterval === 'day') {
        const dd = d.getDate();
        const mm = d.getMonth() + 1;
        return {
          key: mm * 100 + dd,
          label: `${String(dd).padStart(2, '0')}/${String(mm).padStart(2, '0')}`
        };
      }
      return {
        key: d.getMonth(),
        label: formatDateByInterval(new Date(REF_YEAR, d.getMonth(), 1), 'month', false)
      };
    };

    const labelByKey = new Map<number, string>();
    displayDatasets.forEach((ds: any) =>
      (ds.hits ?? []).forEach((h: any) => {
        const { key, label } = bucketKeyLabel(h.key_as_string);
        labelByKey.set(key, label);
      })
    );
    const axisKeys = Array.from(labelByKey.keys()).sort((a, b) => a - b);
    labels = axisKeys.map(k => labelByKey.get(k) as string);

    renderDatasets = displayDatasets.map(({ hits, ...rest }: any) => {
      const byKey = new Map<number, number>();
      (hits ?? []).forEach((h: any) =>
        byKey.set(bucketKeyLabel(h.key_as_string).key, h.doc_count)
      );
      return {
        ...rest,
        data: axisKeys.map(k => (byKey.has(k) ? byKey.get(k) : null)),
        spanGaps: false
      };
    });
  }

  return (
    <Line
      id={id}
      data={{
        labels,
        datasets: renderDatasets
      }}
      {...lineProps}
    />
  );
};
