import { ChartOptions } from 'chart.js';
import { verticalLegendPlugin } from './utils';

export const lineProps: { options: ChartOptions<'line'>; plugins: any[] } = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      filler: {
        propagate: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        radius: 0
      }
    },
    scales: {
      x: {
        type: 'time',
        grid: {
          color: 'transparent'
        },
        time: {
          unit: 'week',
          displayFormats: {
            week: 'MM/YYYY'
          },
          tooltipFormat: 'MMMM DD YYYY'
        }
      },
      y: {
        type: 'linear',
        grid: {
          color: '#E2E8F0'
        }
      }
    }
  },
  plugins: [verticalLegendPlugin]
};
