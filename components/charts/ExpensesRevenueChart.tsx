import { Chart, baseChartOptions, themePalette } from "./Chart";

export function ExpensesRevenueChart() {
  return (
    <Chart
      type="bar"
      height={300}
      series={[
        { name: "Revenue", data: [38, 42, 51, 47, 58, 72, 64] },
        { name: "Expenses", data: [22, 24, 28, 26, 30, 34, 32] },
      ]}
      options={{
        ...baseChartOptions,
        colors: [themePalette[0], themePalette[3]],
        plotOptions: { bar: { columnWidth: "55%", borderRadius: 6 } },
        xaxis: {
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          labels: { style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            style: { colors: "oklch(0.55 0.02 60)", fontSize: "11px" },
            formatter: (v) => `₹${v}k`,
          },
        },
      }}
    />
  );
}