import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  FiMapPin,
  FiFileText,
  FiPhone,
  FiWifi,
  FiTruck,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";

/* ========= API ========= */
const api = axios.create({
  baseURL: import.meta?.env?.VITE_API_BASE_URL || "https://zenith.cloudastro.space",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/* ========= Utils ========= */
const fmtMoney = (n) =>
  typeof n === "number" && !Number.isNaN(n) ? `$${n.toFixed(2)}` : "—";

const isOneGbpsPlan = (title) =>
  !!String(title || "").match(/(^|\s)1\s*G(bps|b)?/i);

const safe = (v, dash = "—") =>
  v === undefined || v === null || v === "" ? dash : v;

/* ========= Page ========= */
export default function BookingDetails() {
  const { id } = useParams(); // expects /customer-bookings/:id
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(`/api/orders/${id}`);
      // your API may return {order} or the object itself — handle both
      setOrder(res.data?.order || res.data);
    } catch (e) {
      console.error(e);
      setErr(
        e.response?.data?.error ||
          e.response?.data?.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleDelete = async () => {
    if (!order?._id) return;
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/orders/${order._id}`);
      navigate("/bookings");
    } catch (e) {
      console.error(e);
      alert(
        e.response?.data?.error || e.response?.data?.message || "Delete failed."
      );
    } finally {
      setDeleting(false);
    }
  };
  console.log("order", order);
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 md:flex-row flex-col">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-64 rounded bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-48 rounded-xl border bg-white" />
                <div className="h-48 rounded-xl border bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (err || !order) {
    return (
      <div className="flex min-h-screen bg-gray-50 md:flex-row flex-col">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-red-700">Error</h2>
              <p className="mt-1 text-sm text-gray-700">
                {err || "Order not found."}
              </p>
              <Link
                to="/customer-bookings"
                className="mt-4 inline-block text-sm text-red-600 hover:underline"
              >
                ← Back to bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const c = order?.contact || {};
  const svc = order?.serviceAddress || {};
  const bill = order?.billingAddress || {};
  const net = order?.internet || {};
  const comm = order?.comm || {};
  const inst = order?.install || {};
  const prop = order?.property || {};
  const price = order?.pricing || {};
  const provider = order?.provider || "—";

  const createdAt = order?.createdAt ? new Date(order.createdAt) : null;
  const isSpectrum = String(provider).toLowerCase().includes("spectrum");
  const oneGbps = isOneGbpsPlan(net?.planId);

  const topChips = [
    net?.planId && `\u{1F5A5}\uFE0F ${net.planId}`, // 🖥 Plan
    typeof net?.staticIpQty === "number" &&
      net.staticIpQty > 0 &&
      `Static IPs ${net.staticIpQty}`,
    comm?.phoneNumberType && `Phone: ${comm.phoneNumberType}`,
    typeof comm?.extraPhoneLines === "number" &&
      `Extra lines: ${comm.extraPhoneLines}`,
    oneGbps && "Wi-Fi included",
  ].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-gray-50 md:flex-row flex-col">
      <Sidebar />
      <div className="flex-1">
        {/* Header */}
        <header className="border-b bg-gradient-to-b from-gray-50 to-gray-50/30">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {((c.firstName || "") + " " + (c.lastName || "")).trim() ||
                    "Unnamed"}
                </h1>
                <div className="mt-1 text-gray-500">{provider}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topChips.map((t, i) => (
                    <Chip key={i}>{t}</Chip>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
            {createdAt && (
              <div className="mt-2 text-xs text-gray-500">
                Created {createdAt.toLocaleString()}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Service Address" Icon={FiMapPin}>
              <InfoRow label="Street" value={safe(svc.street)} />
              <InfoRow label="City" value={safe(svc.city)} />
              <InfoRow label="State" value={safe(svc.state)} />
              <InfoRow label="ZIP" value={safe(svc.zip)} />
            </InfoCard>

            <InfoCard title="Billing Address" Icon={FiFileText}>
              <InfoRow label="Street" value={safe(bill.street)} />
              <InfoRow label="City" value={safe(bill.city)} />
              <InfoRow label="State" value={safe(bill.state)} />
              <InfoRow label="ZIP" value={safe(bill.zip)} />
            </InfoCard>

            <InfoCard title="Communications" Icon={FiPhone}>
              <InfoRow
                label="Voice"
                value={
                  comm.voice ? (
                    <Pill tone="green">Enabled</Pill>
                  ) : (
                    <Pill>Disabled</Pill>
                  )
                }
              />
              <InfoRow
                label="Directory"
                value={
                  (comm.directoryListing || "private").toLowerCase() ===
                  "private" ? (
                    <Pill>Private</Pill>
                  ) : (
                    safe(comm.directoryListing)
                  )
                }
              />
              <InfoRow
                label="Industry Header"
                value={
                  (comm.directoryListing || "").toLowerCase() === "industry"
                    ? safe(comm.industryHeader)
                    : "—"
                }
              />
              <InfoRow
                label="Number"
                value={
                  comm.phoneNumberType === "existing"
                    ? `Port: ${safe(comm.existingNumber)}`
                    : "New"
                }
              />
              <InfoRow label="Extra Lines" value={safe(comm.extraPhoneLines)} />
              <InfoRow
                label="TV Stream"
                value={
                  comm.tvStream ? (isSpectrum ? "$40/mo" : "$30/mo") : "No"
                }
              />
              <InfoRow
                label="Business Connect"
                value={comm.businessConnect ? "Yes" : "No"}
              />
            </InfoCard>

            <InfoCard title="Internet" Icon={FiWifi}>
              <InfoRow label="Plan" value={safe(net.planId)} bold />
              <InfoRow
                label="Business WiFi"
                value={
                  oneGbps ? "Included" : net.addBusinessWifi ? "Yes" : "No"
                }
              />
              <InfoRow label="Static IPs" value={safe(net.staticIpQty, "0")} />
              <InfoRow
                label="Wireless Backup"
                value={net.wirelessBackup ? "Yes" : "No"}
              />
              <InfoRow
                label="Apple TV 4K"
                value={net.appleTV4K ? "Yes" : "No"}
              />
              <InfoRow label="Cable TV" value={net.cableTv ? "Yes" : "No"} />
              <InfoRow label="Roku" value={net.roku ? "Yes" : "No"} />
            </InfoCard>

            <InfoCard title="Installation" Icon={FiTruck}>
              <InfoRow label="Type" value={safe(inst.type)} />
              <InfoRow
                label="Recipient First"
                value={safe(inst.recipientFirst)}
              />
              <InfoRow
                label="Recipient Last"
                value={safe(inst.recipientLast)}
              />
            </InfoCard>

            <InfoCard title="Property Contact" Icon={FiUser}>
              <InfoRow label="Name" value={safe(prop.name)} />
              <InfoRow label="Email" value={safe(prop.email)} />
              <InfoRow label="Phone" value={safe(prop.phone)} />
            </InfoCard>
          </div>

          {/* Pricing */}
          <div className="mt-6">
            <InfoCard title="Pricing" Icon={FiDollarSign}>
              <InfoRow
                label="Monthly (est.)"
                value={fmtMoney(Number(price.monthly || 0))}
                bold
              />
              <InfoRow
                label="One-time fees"
                value={fmtMoney(Number(price.oneTime || 0))}
              />
              <div className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
                Taxes, surcharges, and additional fees may apply.
              </div>
            </InfoCard>
          </div>

          <div className="mt-6">
            <Link
              to="/admin/bookings"
              className="text-sm text-red-600 hover:underline"
            >
              ← Back to bookings
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ========= Little UI bits ========= */

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200">
      {children}
    </span>
  );
}

function Pill({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700 ring-gray-200",
    green: "bg-green-100 text-green-700 ring-green-200",
  }[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${tones}`}
    >
      {children}
    </span>
  );
}

function InfoCard({ title, Icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        {Icon ? <Icon className="h-4 w-4 text-gray-500" /> : null}
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </header>
      <dl className="divide-y">{children}</dl>
    </section>
  );
}

function InfoRow({ label, value, bold = false }) {
  return (
    <div className="grid grid-cols-2 items-center gap-2 px-4 py-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd
        className={`text-sm ${
          bold ? "font-semibold text-gray-900" : "text-gray-900"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
