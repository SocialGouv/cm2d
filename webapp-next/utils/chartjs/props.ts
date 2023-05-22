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
        radius: 0,
        pointStyle: 'circle',
        hoverRadius: 4
      }
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          color: 'transparent'
        },
        ticks: {
          align: 'center'
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

export const histogramProps: {
  options: ChartOptions<'bar'> & { barThickness: number };
  plugins: any[];
} = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    barThickness: 50,
    scales: {
      x: {
        grid: {
          color: 'transparent'
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
  plugins: []
};
