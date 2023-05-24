import { ChartOptions } from 'chart.js';
import { legendSpacingPlugin, verticalLegendPlugin } from './utils';

export const lineProps: { options: ChartOptions<'line'>; plugins: any[] } = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      filler: {
        propagate: false
      },
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          font: {
            size: 14
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
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
  plugins: [verticalLegendPlugin, legendSpacingPlugin]
};

export const histogramProps: {
  options: ChartOptions<'bar'> & { barThickness: number };
  plugins: any[];
} = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    barThickness: 50,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          font: {
            size: 14
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
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
  plugins: [legendSpacingPlugin]
};

export const doughnutProps: {
  options: ChartOptions<'doughnut'>;
  plugins: any[];
} = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      filler: {
        propagate: false
      },
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          font: {
            size: 14
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    cutout: 140
  },
  plugins: [legendSpacingPlugin]
};
