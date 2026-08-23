import { Chart, baseChartOptions, themePalette } from "./Chart";
import type { TopItem } from "@/types/dashboard-types";

export function TopItemsChart({ data }: { data: TopItem[] }) {
  return (
    <Chart
      type="bar"
      height={300}
      series={[{ name: "Sold", data: data.map((item) => item.quantity) }]}
      options={{
        ...baseChartOptions,
        colors: [themePalette[0]],
        plotOptions: {
          bar: { horizontal: true, borderRadius: 6, barHeight: "70%", distributed: false },
        },
        xaxis: {
          categories: data.map((item) => item.name),
          labels: { style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: { labels: { style: { colors: "oklch(0.4 0.02 60)", fontSize: "12px" } } },
        legend: { show: false },
      }}
    />
  );
}