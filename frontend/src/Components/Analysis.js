import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  // ArcElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  // ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);
import callAPI from "../utils/callApi";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Analysis Of Your Listening",
    },
  },
};

export default function Analysis() {
  const [datelist, setDatelist] = useState(null);
  const [valuelist, setValuelist] = useState(null);
  const [chartType, setChartType] = useState("line");
  useEffect(() => {
    async function fetchLabelOptions() {
      try {
        const response = await callAPI("GET", "listening-levels/", "");
        console.log(
          "its response",
          response.dates_with_levels,
          setDatelist(Object.keys(response.dates_with_levels)),
          setValuelist(Object.values(response.dates_with_levels)),
        );
        const dates = Object.keys(response.dates_with_levels);
        const values = Object.values(response.dates_with_levels);
        setDatelist(dates);
        setValuelist(values);
        // setLabelOptions(response.label_options);
      } catch (error) {
        console.error("Error fetching label options:", error);
      }
    }

    fetchLabelOptions();
  }, []);
  const dataList = valuelist?.map((valueArr) => {
    const listeningType = valueArr[0];
    switch (listeningType) {
      case "Internal Listening":
        return 1;
      case "Focused Listening":
        return 2;
      case "Global Listening":
        return 3;
      default:
        return null;
    }
  });

  const data = {
    labels: datelist,
    datasets: [
      {
        fill: true,
        label: "Listening Accuracy",
        data: dataList,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        pointBackgroundColor: "red",
      },
    ],
  };
  return (
    <div className="Analysis overflow-x-scroll">
      <div className="flex justify-center items-center">
        <label htmlFor="chartType" className="mr-2">
          Select Chart Type:
        </label>
        <select
          id="chartType"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="p-1 border rounded"
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
      </div>

      {chartType === "line" && <Line options={options} data={data} />}
      {chartType === "bar" && <Bar options={options} data={data} />}
    </div>
  );
}
