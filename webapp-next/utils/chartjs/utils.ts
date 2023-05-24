export const verticalLegendPlugin = {
  id: 'vertical-legends',
  afterDraw: (chart: any) => {
    if (chart.tooltip?._active?.length) {
      let x = chart.tooltip._active[0].element.x;
      let yAxis = chart.scales.y;
      let ctx = chart.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, yAxis.top);
      ctx.lineTo(x, yAxis.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#a2c1f9';
      ctx.stroke();
      ctx.restore();
    }
  }
};

export const legendSpacingPlugin = {
  beforeInit(chart: any) {
    const originalFit = chart.legend.fit;

    chart.legend.fit = function fit() {
      originalFit.bind(chart.legend)();
      this.height += 40;
    };
  }
};
