import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopZipcodeChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/zip-search`)
    .then(res => res.json())
    .then(data => {
      const top10 = data.slice(0, 10); // ensures max 10 items
      setChartData({
        labels: top10.map(item => `${item._id.zipcode} (${item._id.city})`),
        datasets: [
          {
            label: "Search Count",
            data: top10.map(item => item.count),
            backgroundColor: "rgba(255, 99, 132, 0.5)"
          }
        ]
      });
    });
}, []);


  return (
 <div className="bg-white shadow-md rounded-xl p-6 mt-6 max-w-xl  border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Most Searched Zipcodes</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default TopZipcodeChart;
