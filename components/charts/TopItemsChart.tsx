import { Chart, baseChartOptions, themePalette } from "./Chart";

export function TopItemsChart() {
  return (
    <Chart
      type="bar"
      height={300}
      series={[{ name: "Sold", data: [142, 118, 96, 84, 72, 58, 44] }]}
      options={{
        ...baseChartOptions,
        colors: [themePalette[0]],
        plotOptions: {
          bar: { horizontal: true, borderRadius: 6, barHeight: "70%", distributed: false },
        },
        xaxis: {
          categories: [
            "Veg Cheese Burger",
            "Margherita Pizza",
            "Cold Coffee",
            "Pasta Alfredo",
            "French Fries",
            "Choco Lava",
            "Mojito",
          ],
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