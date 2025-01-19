import { useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

import { ChargingEventGroupBy, ChargingEventResponse } from "../types";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

// Aggregate charging events for chart
const aggregateData = (data: any, groupBy: ChargingEventGroupBy = "month") => {
  const result: Record<string, { consumption: number; noOfCars: number }> = {};

  data.forEach(
    ({
      startTime,
      consumption,
      noOfCars,
    }: {
      startTime: string;
      consumption: number;
      noOfCars: number;
    }) => {
      let key;
      const date = new Date(startTime);

      switch (groupBy) {
        case "hour":
          key = date.toISOString().slice(0, 13).replace("T", " "); // YYYY-MM-DDTHH
          break;
        case "day":
          key = date.toISOString().slice(0, 10); // YYYY-MM-DD
          break;
        case "month":
          key = date.toISOString().slice(0, 7); // YYYY-MM
          break;
        case "year":
          key = date.toISOString().slice(0, 4); // YYYY
          break;
      }

      if (!result[key]) {
        result[key] = { consumption: 0, noOfCars: 0 };
      }

      result[key].consumption += consumption;
      result[key].noOfCars += noOfCars;
    }
  );

  return Object.keys(result).map((key) => ({
    label: key,
    consumption: result[key].consumption,
    carsCharged: result[key].noOfCars,
  }));
};

const ChartComponent = ({
  chargingEvents,
}: {
  chargingEvents: ChargingEventResponse[];
}) => {
  const [groupBy, setGroupBy] = useState<ChargingEventGroupBy>("month");

  const aggregatedData = aggregateData(chargingEvents, groupBy);

  const chartData = {
    labels: aggregatedData.map((d) => d.label),
    datasets: [
      {
        type: "line" as const,
        label: "No. of Cars",
        data: aggregatedData.map((d) => d.carsCharged),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 2,
        yAxisID: "y1",
      },
      {
        type: "bar" as const,
        label: "Power Consumption (kWh)",
        data: aggregatedData.map((d) => d.consumption),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        title: { display: true, text: `Data Aggregated by ${groupBy}` },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <select
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value as ChargingEventGroupBy)}
        className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="hour">Hourly</option>
        <option value="day">Daily</option>
        <option value="month">Monthly</option>
        <option value="year">Yearly</option>
      </select>
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
