"use client"

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { Radar } from "react-chartjs-2"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

type RadarChartProps = {
  data?: number[]
  labels?: string[]
}

export function RadarChart({
  data = [70, 65, 80, 60, 75],
  labels = ["正確性", "網羅性", "論理", "用語", "表現"],
}: RadarChartProps) {
  const chartData: ChartData<"radar"> = {
    labels,
    datasets: [
      {
        label: "Score",
        data,
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderColor: "rgb(79, 70, 229)",
        pointBackgroundColor: "rgb(79, 70, 229)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(79, 70, 229)",
        borderWidth: 2,
      },
    ],
  }

  const options: ChartOptions<"radar"> = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        angleLines: { color: "hsl(var(--muted))" },
        grid: { color: "hsl(var(--muted))" },
        pointLabels: { color: "hsl(var(--foreground))", font: { size: 12 } },
        ticks: { display: false },
      },
    },
    plugins: { legend: { display: false } },
  }

  return <Radar data={chartData} options={options} />
}
