import { Chart, baseChartOptions, themePalette } from "./Chart";

const categories = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"];

export function SalesTrendChart() {
  return (
    <Chart
      type="area"
      height={310}
      series={[
        { name: "Revenue", data: [1200, 2400, 4800, 3200, 5400, 7800, 9200, 6400] },
        { name: "Orders", data: [12, 22, 41, 28, 47, 64, 78, 52] },
      ]}
      options={{
        ...baseChartOptions,
        colors: [themePalette[0], themePalette[2]],
        stroke: { curve: "smooth", width: 3 },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.05,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories,
          labels: { style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: [
          {
            labels: {
              style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" },
              formatter: (v : number) => `₹${(v / 1000).toFixed(1)}k`,
            },
          },
          { show: false },
        ],
      }}
    />
  );
}