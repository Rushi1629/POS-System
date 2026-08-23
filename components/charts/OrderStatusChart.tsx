import { Chart, baseChartOptions, themePalette } from "./Chart";
import type { OrderStatusData } from "@/types/dashboard-types";

export function OrderStatusChart({ data }: { data: OrderStatusData }) {
  const labels = ["served", "preparing", "pending", "cancelled"];
  const displayLabels = ["Served", "Preparing", "Pending", "Cancelled"];
  const series = labels.map((label) => Number(data[label] ?? 0));
  const total = series.reduce((sum, value) => sum + value, 0);
  return (
    <Chart
      type="donut"
      height={300}
      series={series}
      options={{
        ...baseChartOptions,
        labels: displayLabels,
        colors: [themePalette[1], themePalette[0], themePalette[3], "oklch(0.65 0.15 25)"],
        stroke: { width: 0 },
        legend: { ...baseChartOptions.legend, position: "bottom" },
        plotOptions: {
          pie: {
            donut: {
              size: "72%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total Orders",
                  fontSize: "12px",
                  color: "oklch(0.55 0.02 60)",
                  formatter: () => String(total),
                },
                value: { fontSize: "22px", fontWeight: 700, color: "oklch(0.22 0.02 50)" },
              },
            },
          },
        },
      }}
    />
  );
}