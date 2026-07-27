import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useTheme } from "./ThemeContext";

const API = `${import.meta.env.VITE_API_URL}/api/spectrum-orders`;

const PAGE_SIZES = [10, 20, 50, 100];
const STATUSES = ["New", "Processing", "Scheduled", "Completed", "Canceled"];

function currency(n) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
function dt(x) {
  if (!x) return "—";
  const d = typeof x === "string" ? new Date(x) : x;
  return d.toLocaleString();
}
function toCSV(rows) {
  const header = [
    "id",
    "createdAt",
    "status",
    "first",
    "last",
    "email",
    "phone",
    "plan",
    "monthly",
    "oneTime",
    "freeMonths",
    "advancedWifi",
    "wirelessBackup",
    "voiceLines",
    "connectSeats",
    "tvPackage",
    "mobilePlan",
    "mobileLines",
    "svcStreet",
    "svcCity",
    "svcState",
    "svcZip",
    "billStreet",
    "billCity",
    "billState",
    "billZip",
    "notes",
  ];

  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = rows.map((o) => {
    const { contact = {}, addons = {}, pricing = {}, promos = {}, _id, id } = o;
    return [
      _id || id || "",
      o.createdAt || o.created_at || "",
      o.status || "New",
      contact.first || "",
      contact.last || "",
      contact.email || "",
      contact.phone || "",
      o.plan || "",
      pricing.monthly ?? "",
      pricing.oneTime ?? "",
      promos.freeMonths ?? "",
      !!addons.advancedWifi,
      !!addons.wirelessBackup,
      addons.voiceLines ?? 0,
      addons.connectSeats ?? 0,
      addons.tvPackage ?? "",
      addons.mobilePlan ?? "",
      addons.mobileLines ?? 0,
      contact.svc?.street ?? "",
      contact.svc?.city ?? "",
      contact.svc?.state ?? "",
      contact.svc?.zip ?? "",
      contact.bill?.street ?? "",
      contact.bill?.city ?? "",
      contact.bill?.state ?? "",
      contact.bill?.zip ?? "",
      (contact.notes ?? "").replace(/\n/g, " "),
    ]
      .map(escape)
      .join(",");
  });

  return [header.join(","), ...lines].join("\n");
}

export default function SpectrumOrdersAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState(null);
  const { theme } = useTheme();

  // Fetch
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        // If your API supports query params, you can pass q/status/date here.
        const res = await axios.get(API);
        if (!cancelled)
          setRows(
            Array.isArray(res.data.data) ? res.data.data : res.data?.data || []
          );
      } catch (e) {
        if (!cancelled) setErr("Failed to load orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Derived: filtered + searched + date ranged
  const filtered = useMemo(() => {
    const now = new Date();
    const start =
      range === "today"
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
        : range === "7d"
          ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          : range === "30d"
            ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            : null;

    const qq = q.trim().toLowerCase();
    return rows.filter((o) => {
      if (status !== "All" && (o.status || "New") !== status) return false;
      if (start) {
        const d = new Date(o.createdAt || o.created_at || 0);
        if (!(d >= start)) return false;
      }
      if (!qq) return true;
      const { contact = {} } = o;
      const hay = [
        o.plan,
        contact.first,
        contact.last,
        contact.email,
        contact.phone,
        contact.svc?.street,
        contact.svc?.city,
        contact.svc?.state,
        contact.svc?.zip,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(qq);
    });
  }, [rows, q, status, range]);

  // Pagination
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, pages);
  const sliced = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  useEffect(() => {
    setPage(1);
  }, [q, status, range, pageSize]);

  function exportCSV() {
    const blob = new Blob([toCSV(filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spectrum-orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function updateStatus(row, newStatus) {
    const id = row._id || row.id;
    const prev = row.status || "New";
    if (prev === newStatus) return;
    // Optimistic UI
    setRows((r) => r.map((x) => (x === row ? { ...x, status: newStatus } : x)));
    try {
      await axios.patch(`${API}/${id}`, { status: newStatus });
    } catch (e) {
      // revert
      setRows((r) => r.map((x) => (x === row ? { ...x, status: prev } : x)));
      alert("Failed to update status");
    }
  }

  return (
    <div className="flex" style={{ backgroundColor: "var(--admin-page-bg)", minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-1 min-w-0 p-5 pt-16 md:pt-5" style={{ backgroundColor: "var(--admin-page-bg)" }}>
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Spectrum Orders</h1>
            <p className="text-sm text-gray-600">
              Manage orders submitted from the Spectrum Business checkout.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-gray-500">
              <path
                d="M12.9 14.32a8 8 0 1 1 1.41-1.41l3.39 3.4-1.41 1.4-3.39-3.39zM14 8a6 6 0 1 0-12 0 6 6 0 0 0 12 0z"
                fill="currentColor"
              />
            </svg>
            <input
              placeholder="Search name, email, phone, plan…"
              className="w-full outline-none"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <select
            className="rounded-lg border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            className="rounded-lg border px-3 py-2"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <select
            className="rounded-lg border px-3 py-2"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="mt-4 rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <Th>Created</Th>
                  <Th>Customer</Th>
                  <Th>Contact</Th>
                  <Th>Plan</Th>
                  <Th className="text-right">Monthly</Th>
                  <Th className="text-center">Free Mo.</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      Loading…
                    </td>
                  </tr>
                ) : err ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-red-600">
                      {err}
                    </td>
                  </tr>
                ) : sliced.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  sliced.map((o) => (
                    <tr
                      key={o._id || o.id}
                      className="border-t last:border-b-0"
                    >
                      <Td>{dt(o.createdAt || o.created_at)}</Td>
                      <Td>
                        {o.contact?.first} {o.contact?.last}
                        <div className="text-xs text-gray-500">
                          {o.contact?.svc?.city}, {o.contact?.svc?.state}
                        </div>
                      </Td>
                      <Td>
                        <div className="text-gray-700">{o.contact?.email}</div>
                        <div className="text-xs text-gray-500">
                          {o.contact?.phone || "—"}
                        </div>
                      </Td>
                      <Td>
                        <div className="font-medium">{o.plan || "—"}</div>
                        <div className="text-xs text-gray-500">
                          WiFi {o.addons?.advancedWifi ? "Yes" : "No"} • Backup{" "}
                          {o.addons?.wirelessBackup ? "Yes" : "No"}
                        </div>
                      </Td>
                      <Td className="text-right">
                        {currency(o.pricing?.monthly ?? 0)}
                      </Td>
                      <Td className="text-center">
                        {o.promos?.freeMonths ?? 0}
                      </Td>
                      <Td>
                        <StatusSelect
                          value={o.status || "New"}
                          onChange={(s) => updateStatus(o, s)}
                        />
                      </Td>
                      <Td>
                        <button
                          className="rounded-lg border px-2 py-1 hover:bg-gray-50"
                          onClick={() => setSelected(o)}
                        >
                          View
                        </button>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
            <div>
              Showing{" "}
              <b>
                {total === 0 ? 0 : (pageSafe - 1) * pageSize + 1}-
                {Math.min(pageSafe * pageSize, total)}
              </b>{" "}
              of <b>{total}</b>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-lg border px-3 py-1 disabled:opacity-50"
                disabled={pageSafe <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="px-2">
                Page <b>{pageSafe}</b> / {pages}
              </span>
              <button
                className="rounded-lg border px-3 py-1 disabled:opacity-50"
                disabled={pageSafe >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Details Drawer */}
        {selected && (
          <DetailsDrawer order={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}

/* ---------- Small subcomponents ---------- */

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

function StatusSelect({ value, onChange }) {
  return (
    <select
      className="rounded-md border px-2 py-1 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 py-1 border-b last:border-0">
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-900">{value ?? "—"}</div>
    </div>
  );
}

function DetailsDrawer({ order, onClose }) {
  const { contact = {}, pricing = {}, addons = {}, promos = {} } = order;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Order Details</h3>
          <button
            onClick={onClose}
            className="rounded-lg border px-3 py-1 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Summary */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">
                  {dt(order.createdAt || order.created_at)}
                </div>
                <div className="text-xl font-semibold">
                  {contact.first} {contact.last}
                </div>
                <div className="text-sm text-gray-600">{order.plan || "—"}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {currency(pricing.monthly ?? 0)}
                </div>
                <div className="text-xs text-gray-500">/mo (est.)</div>
                <div className="text-xs text-gray-600">
                  Free months: {promos.freeMonths ?? 0}
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <section className="rounded-xl border p-4">
            <h4 className="font-semibold mb-3">Customer</h4>
            <Row label="Email" value={contact.email} />
            <Row label="Phone" value={contact.phone} />
            <Row
              label="Service Address"
              value={
                contact.svc
                  ? `${contact.svc.street || ""}, ${contact.svc.city || ""}, ${contact.svc.state || ""
                  } ${contact.svc.zip || ""}`
                  : "—"
              }
            />
            {!contact.billSame && (
              <Row
                label="Billing Address"
                value={
                  contact.bill
                    ? `${contact.bill.street || ""}, ${contact.bill.city || ""
                    }, ${contact.bill.state || ""} ${contact.bill.zip || ""}`
                    : "—"
                }
              />
            )}
            <Row label="Notes" value={contact.notes} />
          </section>

          {/* Products */}
          <section className="rounded-xl border p-4">
            <h4 className="font-semibold mb-3">Products</h4>
            <Row label="Plan" value={order.plan} />
            <Row
              label="Advanced WiFi"
              value={addons.advancedWifi ? "Yes (+$10/mo)" : "No"}
            />
            <Row
              label="Wireless Backup"
              value={addons.wirelessBackup ? "Yes (+$20/mo)" : "No"}
            />
            <Row label="Voice Lines" value={addons.voiceLines ?? 0} />
            <Row label="Connect Seats" value={addons.connectSeats ?? 0} />
            <Row label="TV Package" value={addons.tvPackage || "None"} />
            <Row
              label="Mobile"
              value={
                addons.mobileLines > 0
                  ? `${addons.mobilePlan} (${addons.mobileLines} paid line${addons.mobileLines > 1 ? "s" : ""
                  })`
                  : "None"
              }
            />
          </section>

          {/* Pricing */}
          <section className="rounded-xl border p-4">
            <h4 className="font-semibold mb-3">Pricing</h4>
            <Row
              label="Monthly (est.)"
              value={currency(pricing.monthly ?? 0)}
            />
            <Row label="One-time fees" value={currency(pricing.oneTime ?? 0)} />
            <Row label="Free Months (est.)" value={promos.freeMonths ?? 0} />
            <Row
              label="$10 off added (TV or Mobile)"
              value={
                order.addons?.tvPackage !== "none" ||
                  (order.addons?.mobileLines || 0) > 0
                  ? "Yes"
                  : "No"
              }
            />
          </section>
        </div>
      </aside>
    </div>
  );
}
