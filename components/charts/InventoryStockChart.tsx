import { Chart, baseChartOptions, themePalette } from "./Chart";
import type { InventoryLevel } from "@/types/dashboard-types";

export function InventoryStockChart({ data }: { data: InventoryLevel[] }) {
  return (
    <Chart
      type="bar"
      height={260}
      series={[{ name: "Stock %", data: data.map((item) => item.percentage) }]}
      options={{
        ...baseChartOptions,
        plotOptions: {
          bar: {
            borderRadius: 6,
            columnWidth: "50%",
            distributed: true,
          },
        },
        colors: [
          themePalette[1], themePalette[3], "oklch(0.65 0.2 25)",
          themePalette[1], "oklch(0.65 0.2 25)", themePalette[3], themePalette[1],
        ],
        xaxis: {
          categories: data.map((item) => item.name),
          labels: { style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: { max: 100, labels: { formatter: (v) => `${v}%`, style: { colors: "oklch(0.55 0.02 60)" } } },
        legend: { show: false },
      }}
    />
  );
}