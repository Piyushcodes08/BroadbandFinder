import {
  BarElement, CategoryScale, Chart as ChartJS,
  Legend, LinearScale, Title, Tooltip
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TopZipcodeChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/zip-search`)
      .then((res) => res.json())
      .then((data) => {
        const top10 = (Array.isArray(data) ? data : []).slice(0, 10);
        setChartData({
          labels: top10.map((item) => `${item._id?.zipcode || ""} (${item._id?.city || ""})`),
          datasets: [
            {
              label: "Search Count",
              data: top10.map((item) => item.count),
              backgroundColor: "rgba(232, 97, 26, 0.75)",
              borderColor: "#E8611A",
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        });
      })
      .catch(() => setError("Failed to load chart data."))
      .finally(() => setLoading(false));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#64748b" },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { font: { size: 11 }, color: "#64748b" },
      },
    },
  };

  if (loading) return (
    <div className="h-48 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8611A] border-t-transparent" />
    </div>
  );

  if (error) return (
    <p className="text-sm text-red-500 py-4">{error}</p>
  );

  if (!chartData.labels.length) return (
    <p className="text-sm text-slate-500 py-4">No search data yet.</p>
  );

  return (
    <div style={{ maxHeight: "320px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
