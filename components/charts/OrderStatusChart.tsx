import { Chart, baseChartOptions, themePalette } from "./Chart";

export function OrderStatusChart() {
  return (
    <Chart
      type="donut"
      height={300}
      series={[42, 28, 18, 12]}
      options={{
        ...baseChartOptions,
        labels: ["Served", "Preparing", "Pending", "Cancelled"],
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
                  formatter: () => "100",
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