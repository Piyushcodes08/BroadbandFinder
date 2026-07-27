import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, RefreshCw, Trash2, Eye } from "lucide-react";
import AdminLayout, { AdminCard, AdminTable, AdminTr, AdminTd, AdminBtn, AdminInput, AdminSelect } from "./AdminLayout";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

const normalize = (d) => (Array.isArray(d) ? d : d?.orders || []);
const fmtMoney = (n) => (typeof n === "number" && !isNaN(n) ? `$${n.toFixed(2)}` : "—");
const getId = (o) => o?._id || o?.id || "";

export default function CustomerBookings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchOrders = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const res = await api.get("/api/orders");
      setOrders(normalize(res.data));
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load orders.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => !q || [o?.contact?.firstName, o?.contact?.lastName, o?.contact?.email, o?.provider].filter(Boolean).join(" ").toLowerCase().includes(q))
      .sort((a, b) => {
        const ad = new Date(a.createdAt || 0).getTime();
        const bd = new Date(b.createdAt || 0).getTime();
        return sort === "newest" ? bd - ad : ad - bd;
      });
  }, [orders, query, sort]);

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this order?")) return;
    const prev = orders;
    setOrders((xs) => xs.filter((x) => getId(x) !== id));
    try { await api.delete(`/api/orders/${id}`); }
    catch (e) { alert(e.response?.data?.message || "Delete failed."); setOrders(prev); }
  };

  return (
    <AdminLayout
      title="Customer Bookings"
      subtitle="All customer orders with quick actions."
      actions={
        <AdminBtn variant="outline" onClick={fetchOrders}>
          <RefreshCw size={14} /> Refresh
        </AdminBtn>
      }
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-secondary)" }} />
          <AdminInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, provider…"
            className="w-full pl-9"
          />
        </div>
        <AdminSelect value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </AdminSelect>
      </div>

      {err && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <AdminCard>
        {loading ? (
          <div className="p-8 text-center" style={{ color: "var(--admin-text-secondary)" }}>
            <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold" style={{ color: "var(--admin-text-primary)" }}>No orders found</p>
            <p className="text-sm mt-1" style={{ color: "var(--admin-text-secondary)" }}>Try changing your search.</p>
            {query && <AdminBtn className="mt-4" onClick={() => setQuery("")}>Clear search</AdminBtn>}
          </div>
        ) : (
          <AdminTable heads={["Customer","Email","Provider","Plan","Price","Created","Actions"]}>
            {filtered.map((o) => (
              <AdminTr key={getId(o)}>
                <AdminTd>
                  <span className="font-medium">{(o?.contact?.firstName || "") + " " + (o?.contact?.lastName || "") || "Unnamed"}</span>
                </AdminTd>
                <AdminTd>{o?.contact?.email || "—"}</AdminTd>
                <AdminTd>{o?.provider || "—"}</AdminTd>
                <AdminTd>{o?.internet?.planId || "—"}</AdminTd>
                <AdminTd>{fmtMoney(o?.pricing?.total)}</AdminTd>
                <AdminTd><span className="text-xs">{o?.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</span></AdminTd>
                <AdminTd>
                  <div className="flex gap-2">
                    <Link to={`/admin/customer-bookings/${o._id}`}>
                      <AdminBtn variant="outline"><Eye size={13} /> View</AdminBtn>
                    </Link>
                    <AdminBtn variant="danger" onClick={() => handleDelete(getId(o))}>
                      <Trash2 size={13} /> Del
                    </AdminBtn>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </AdminLayout>
  );
}
