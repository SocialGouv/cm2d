import { Chart, ChartData, ChartOptions, LegendItem } from 'chart.js';
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
    layout: {
      padding: {
        bottom: 36,
        top: 20
      }
    },
    plugins: {
      filler: {
        propagate: false
      },
      legend: {
        position: 'right',
        align: 'end',
        labels: {
          generateLabels: function (chart: Chart) {
            const data = chart.data as ChartData<'doughnut'>;
            if (data.labels && data.datasets) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset?.data[i] || '';
                const backgroundColor =
                  dataset?.backgroundColor || ''
                    ? Array.isArray(dataset.backgroundColor)
                      ? dataset.backgroundColor[i]
                      : dataset.backgroundColor
                    : 'grey';
                return {
                  text: `${label} : ${value}`,
                  fillStyle: backgroundColor,
                  strokeStyle: backgroundColor,
                  lineWidth: 1,
                  hidden: !chart.getDataVisibility(i),
                  index: i
                };
              });
            }
            return [];
          },
          font: {
            size: 14
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    cutout: 160
  },
  plugins: [legendSpacingPlugin]
};
