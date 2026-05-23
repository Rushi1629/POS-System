import { Chart, baseChartOptions, themePalette } from "./Chart";

export function PaymentMethodsChart() {
  return (
    <Chart
      type="radialBar"
      height={300}
      series={[68, 22, 10]}
      options={{
        ...baseChartOptions,
        labels: ["UPI", "Cash", "Card"],
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
                formatter: () => "₹486",
              },
            },
          },
        },
      }}
    />
  );
}