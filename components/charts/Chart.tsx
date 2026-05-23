import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { Skeleton } from "@/components/ui/skeleton";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <Skeleton className="w-full" style={{ height: 300 }} />,
});

type Props = {
  type: "line" | "area" | "bar" | "donut" | "pie" | "radialBar" | "heatmap";
  series: ApexOptions["series"];
  options: ApexOptions;
  height?: number | string;
};

export function Chart({ type, series, options, height = 300 }: Props) {
  return (
    <ReactApexChart
      type={type}
      series={series}
      options={options}
      height={height}
      width="100%"
    />
  );
}

/** Shared base options matched to the warm cream theme. */
export const baseChartOptions: ApexOptions = {
  chart: {
    toolbar: { show: false },
    fontFamily: "inherit",
    background: "transparent",
    animations: { enabled: false },
  },
  grid: {
    borderColor: "oklch(0.91 0.012 70)",
    strokeDashArray: 4,
    padding: { left: 8, right: 8 },
  },
  tooltip: { theme: "light" },
  legend: {
    position: "bottom",
    fontSize: "12px",
    labels: { colors: "oklch(0.45 0.02 60)" },
    markers: { size: 6 },
  },
  dataLabels: { enabled: false },
};

export const themePalette = [
  "oklch(0.72 0.18 48)",
  "oklch(0.7 0.16 145)",
  "oklch(0.65 0.14 240)",
  "oklch(0.78 0.17 80)",
  "oklch(0.6 0.2 350)",
];
