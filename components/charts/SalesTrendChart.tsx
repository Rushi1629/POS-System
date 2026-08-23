import { Chart, baseChartOptions, themePalette } from "./Chart";
import type { SalesTrendPoint } from "@/types/dashboard-types";

export function SalesTrendChart({ data }: { data: SalesTrendPoint[] }) {
  return (
    <Chart
      type="area"
      height={310}
      series={[
        { name: "Revenue", data: data.map((point) => point.revenue) },
        { name: "Orders", data: data.map((point) => point.orders) },
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
          categories: data.map((point) => point.label),
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