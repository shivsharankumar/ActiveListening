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
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  console.log("=====>", dataList, datelist);
  const data = {
    labels: datelist, // Replace with your actual dates
    datasets: [
      {
        fill: true,
        label: "Listening Accuracy",
        data: dataList, // Replace with your data
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)", // Color for the filled area below the line
        pointBackgroundColor: "red",
      },
    ],
  };
  return (
    <div className="Analysis">
      <Line options={options} data={data} />
    </div>
  );
}
