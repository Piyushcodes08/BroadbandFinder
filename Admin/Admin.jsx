import axios from "axios";
import { useEffect, useState } from "react";
import { MapPin, Building2, RefreshCw, TrendingUp } from "lucide-react";
import AdminLayout, { AdminCard } from "./AdminLayout";
import TopZipcodeChart from "./TopZipcodeChart";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const statCards = [
  { key: "totalZipcodes",  label: "Total Zipcodes",  icon: MapPin,       accent: "var(--admin-accent)" },
  { key: "activeCities",   label: "Active Cities",   icon: Building2,    accent: "#3b82f6" },
  { key: "pendingUpdates", label: "Pending Updates", icon: TrendingUp,   accent: "#10b981" },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalZipcodes: 0, activeCities: 0, pendingUpdates: 0 });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/zipcodes/stats`);
      setStats(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back, Admin 👋"
      actions={
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition disabled:opacity-50"
          style={{ backgroundColor: "var(--admin-card-bg)", borderColor: "var(--admin-border)", color: "var(--admin-text-secondary)" }}
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      }
    >
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map(({ key, label, icon: Icon, accent }) => (
          <AdminCard key={key}>
            <div className="p-5 flex items-center gap-4" style={{ borderTop: `3px solid ${accent}` }}>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}18`, color: accent }}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--admin-text-secondary)" }}>{label}</p>
                <p className="text-3xl font-extrabold mt-0.5" style={{ color: "var(--admin-text-primary)" }}>
                  {loading ? "—" : stats[key]}
                </p>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Chart */}
      <AdminCard>
        <div className="p-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: "var(--admin-text-primary)" }}>Most Searched Zipcodes</h2>
          <TopZipcodeChart />
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
