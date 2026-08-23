import { Chart, baseChartOptions, themePalette } from "./Chart";
import type { PaymentMethod } from "@/types/dashboard-types";

export function PaymentMethodsChart({ data }: { data: PaymentMethod[] }) {
  return (
    <Chart
      type="radialBar"
      height={300}
      series={data.map((item) => item.percentage || item.count)}
      options={{
        ...baseChartOptions,
        labels: data.map((item) => item.name),
        colors: [themePalette[0], themePalette[1], themePalette[2]],
        plotOptions: {
          radialBar: {
            hollow: { size: "35%" },
            track: { background: "oklch(0.94 0.012 70)" },
            dataLabels: {
              name: { fontSize: "12px", color: "oklch(0.55 0.02 60)" },
              value: { fontSize: "16px", fontWeight: 700, color: "oklch(0.22 0.02 50)" },
              total: {
                show: true,
                label: "Avg ticket",
                formatter: () => "",
              },
            },
          },
        },
      }}
    />
  );
}