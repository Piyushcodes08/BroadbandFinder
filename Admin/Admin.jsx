import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopZipcodeChart from "./TopZipcodeChart";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalZipcodes: 0,
    activeCities: 0,
    pendingUpdates: 0,
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/zipcodes/stats`);
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 md:flex-row flex-col">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 max-w-7xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Welcome, Admin
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              This is your dashboard. Here’s a quick overview of the app’s current data.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {/* Total Zipcodes */}
              <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100 flex flex-col items-center">
                <p className="text-sm text-blue-500 font-semibold uppercase tracking-wide mb-2">
                  Total Zipcodes
                </p>
                <p className="text-3xl font-extrabold text-gray-800">
                  {loading ? "Loading..." : stats.totalZipcodes}
                </p>
              </div>

              {/* Active Cities */}
              <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100 flex flex-col items-center">
                <p className="text-sm text-green-600 font-semibold uppercase tracking-wide mb-2">
                  Active Cities
                </p>
                <p className="text-3xl font-extrabold text-gray-800">
                  {loading ? "Loading..." : stats.activeCities}
                </p>
              </div>

              {/* Pending Updates */}
              <div className="bg-yellow-50 p-5 rounded-lg shadow-sm border border-yellow-100 flex flex-col items-center">
                <p className="text-sm text-yellow-600 font-semibold uppercase tracking-wide mb-2">
                  Pending Updates
                </p>
                <p className="text-3xl font-extrabold text-gray-800">
                  {loading ? "Loading..." : stats.pendingUpdates}
                </p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="max-w-7xl mx-auto mt-8 p-4 bg-white rounded-xl shadow-md border border-gray-200">
            <TopZipcodeChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
