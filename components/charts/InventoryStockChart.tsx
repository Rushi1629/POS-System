import { Chart, baseChartOptions, themePalette } from "./Chart";

export function InventoryStockChart() {
  return (
    <Chart
      type="bar"
      height={260}
      series={[{ name: "Stock %", data: [85, 62, 24, 91, 14, 48, 78] }]}
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
          categories: ["Tomato", "Cheese", "Buns", "Flour", "Chicken", "Lettuce", "Sauce"],
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