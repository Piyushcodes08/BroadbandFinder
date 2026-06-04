// src/Pages/CustomerBookings.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { FiSearch } from "react-icons/fi";

const api = axios.create({
  baseURL: import.meta?.env?.VITE_API_BASE_URL || "https://zenith.cloudastro.space",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const normalize = (data) => (Array.isArray(data) ? data : data?.orders || []);
const fmtMoney = (n) => (typeof n === "number" && !Number.isNaN(n) ? `$${n.toFixed(2)}` : "—");
const getId = (o) => o?._id || o?.id || o?.orderId || "";
const isOneGbpsPlan = (title) => !!String(title || "").match(/(^|\s)1\s*G(bps|b)?/i);

export default function CustomerBookings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/orders");
      setOrders(normalize(res.data));
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.error || e.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = orders.slice();

    if (q) {
      list = list.filter((o) => {
        const c = o?.contact || {};
        return [c.firstName, c.lastName, c.email, o?.provider]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    }

    list.sort((a, b) => {
      const ad = new Date(a.createdAt || 0).getTime();
      const bd = new Date(b.createdAt || 0).getTime();
      return sort === "newest" ? bd - ad : ad - bd;
    });

    return list;
  }, [orders, query, sort]);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this order?")) return;
    const prev = orders;
    setOrders((xs) => xs.filter((x) => getId(x) !== id));
    try {
      await api.delete(`/api/orders/${id}`);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error || e.response?.data?.message || "Delete failed.");
      setOrders(prev);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 md:flex-row flex-col">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="border-b bg-white/90 backdrop-blur shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Customer Bookings</h1>
              <p className="text-xs text-gray-500">All customer orders with quick actions.</p>
            </div>
            <button
              onClick={fetchOrders}
              className="rounded-lg border bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {/* Controls */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:w-96">
                
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email, or provider…"
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2  text-sm shadow-sm outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {!!err && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {err}
              </div>
            )}

            {/* Table */}
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
            ) : filtered.length === 0 ? (
              <EmptyState onReset={() => setQuery("")} />
            ) : (
              <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Provider</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o) => (
                      <tr key={getId(o)} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          {(o?.contact?.firstName || "") + " " + (o?.contact?.lastName || "") || "Unnamed"}
                        </td>
                        <td className="px-4 py-3">{o?.contact?.email || "—"}</td>
                        <td className="px-4 py-3">{o?.provider || "—"}</td>
                        <td className="px-4 py-3">{o?.internet?.planId || "—"}</td>
                        <td className="px-4 py-3">{fmtMoney(o?.pricing?.total)}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {o?.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-end">
                          <Link
                            to={`/admin/customer-bookings/${o._id}`}
                            className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleDelete(getId(o))}
                            className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ======= bits ======= */
function SkeletonRow() {
  return (
    <div className="animate-pulse flex justify-between px-4 py-3 border rounded bg-white">
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
      <div className="h-3 w-32 bg-gray-200 rounded"></div>
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border bg-white h-40 pt-6 text-center shadow-sm">
      <h3 className="text-lg font-semibold">No orders match your search</h3>
      <p className="mt-1 text-sm text-gray-600">Try changing your keywords or clearing the filter.</p>
      <button
        onClick={onReset}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Clear search
      </button>
    </div>
  );
}
