import { Chart, baseChartOptions, themePalette } from "./Chart";
import type { RevenueVsOrdersPoint } from "@/types/dashboard-types";

export function ExpensesRevenueChart({ data }: { data: RevenueVsOrdersPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-75 items-center justify-center text-sm text-muted-foreground">
        No data found.
      </div>
    );
  }

  return (
    <Chart
      type="bar"
      height={300}
      series={[
        {
          name: "Revenue",
          data: data.map((point) => point.revenue),
        },
        {
          name: "Orders",
          data: data.map((point) => point.orders),
        },
      ]}
      options={{
        ...baseChartOptions,
        colors: [themePalette[0], themePalette[3]],
        plotOptions: { bar: { columnWidth: "55%", borderRadius: 6 } },
        xaxis: {
          categories: data.map((point) => point.label),
          labels: { style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: [
          {
            seriesName: "Revenue",
            labels: {
              style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" },
              formatter: (v) => `₹${v}`,
            },
          },
          {
            seriesName: "Orders",
            opposite: true,
            labels: {
              style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" },
              formatter: (v) => String(Math.round(v)),
            },
          },
        ],
      }}
    />
  );
}