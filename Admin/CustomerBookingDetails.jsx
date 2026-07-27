import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, FileText, Phone, Wifi, Truck, User, DollarSign, ArrowLeft, Trash2 } from "lucide-react";
import AdminLayout, { AdminCard, AdminBtn } from "./AdminLayout";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const fmtMoney = (n) => (typeof n === "number" && !isNaN(n) ? `$${n.toFixed(2)}` : "—");
const safe = (v, d = "—") => (v === undefined || v === null || v === "" ? d : v);
const isOneGbps = (t) => !!String(t || "").match(/(^|\s)1\s*G(bps|b)?/i);

function InfoCard({ title, Icon, children }) {
  return (
    <AdminCard>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--admin-border)" }}>
        {Icon && <Icon size={15} style={{ color: "var(--admin-text-secondary)" }} />}
        <h4 className="text-sm font-semibold" style={{ color: "var(--admin-text-primary)" }}>{title}</h4>
      </div>
      <dl className="divide-y" style={{ borderColor: "var(--admin-border)" }}>{children}</dl>
    </AdminCard>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-2 items-center gap-2 px-4 py-2.5">
      <dt className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>{label}</dt>
      <dd className="text-sm" style={{ color: "var(--admin-text-primary)" }}>{value}</dd>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: "color-mix(in srgb, var(--admin-accent) 12%, transparent)", color: "var(--admin-accent)" }}>
      {children}
    </span>
  );
}

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const res = await api.get(`/api/orders/${id}`);
      setOrder(res.data?.order || res.data);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load order.");
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleDelete = async () => {
    if (!order?._id || !window.confirm("Delete this order? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/orders/${order._id}`);
      navigate("/admin/bookings");
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed.");
    } finally { setDeleting(false); }
  };

  if (loading) return (
    <AdminLayout title="Booking Details">
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--admin-accent)" }} />
      </div>
    </AdminLayout>
  );

  if (err || !order) return (
    <AdminLayout title="Booking Details">
      <AdminCard>
        <div className="p-6">
          <p className="text-red-600 font-semibold">{err || "Order not found."}</p>
          <Link to="/admin/bookings" className="mt-3 inline-flex items-center gap-1 text-sm" style={{ color: "var(--admin-accent)" }}>
            <ArrowLeft size={14} /> Back to bookings
          </Link>
        </div>
      </AdminCard>
    </AdminLayout>
  );

  const c    = order?.contact || {};
  const svc  = order?.serviceAddress || {};
  const bill = order?.billingAddress || {};
  const net  = order?.internet || {};
  const comm = order?.comm || {};
  const inst = order?.install || {};
  const prop = order?.property || {};
  const price = order?.pricing || {};
  const provider = order?.provider || "—";
  const oneGbps = isOneGbps(net?.planId);
  const isSpectrum = String(provider).toLowerCase().includes("spectrum");

  const chips = [
    net?.planId && net.planId,
    net?.staticIpQty > 0 && `Static IPs: ${net.staticIpQty}`,
    comm?.phoneNumberType && `Phone: ${comm.phoneNumberType}`,
    oneGbps && "WiFi included",
  ].filter(Boolean);

  return (
    <AdminLayout
      title={((c.firstName || "") + " " + (c.lastName || "")).trim() || "Booking Details"}
      subtitle={provider}
      actions={
        <AdminBtn variant="danger" onClick={handleDelete} disabled={deleting}>
          <Trash2 size={14} /> {deleting ? "Deleting…" : "Delete"}
        </AdminBtn>
      }
    >
      {/* Chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {chips.map((c, i) => <Chip key={i}>{c}</Chip>)}
          {order?.createdAt && (
            <span className="text-xs" style={{ color: "var(--admin-text-secondary)" }}>
              Created {new Date(order.createdAt).toLocaleString()}
            </span>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Service Address" Icon={MapPin}>
          <InfoRow label="Street" value={safe(svc.street)} />
          <InfoRow label="City"   value={safe(svc.city)} />
          <InfoRow label="State"  value={safe(svc.state)} />
          <InfoRow label="ZIP"    value={safe(svc.zip)} />
        </InfoCard>

        <InfoCard title="Billing Address" Icon={FileText}>
          <InfoRow label="Street" value={safe(bill.street)} />
          <InfoRow label="City"   value={safe(bill.city)} />
          <InfoRow label="State"  value={safe(bill.state)} />
          <InfoRow label="ZIP"    value={safe(bill.zip)} />
        </InfoCard>

        <InfoCard title="Communications" Icon={Phone}>
          <InfoRow label="Voice"          value={comm.voice ? "Enabled" : "Disabled"} />
          <InfoRow label="Directory"      value={safe(comm.directoryListing, "Private")} />
          <InfoRow label="Phone Type"     value={safe(comm.phoneNumberType)} />
          <InfoRow label="Extra Lines"    value={safe(comm.extraPhoneLines)} />
          <InfoRow label="TV Stream"      value={comm.tvStream ? (isSpectrum ? "$40/mo" : "$30/mo") : "No"} />
          <InfoRow label="Business Connect" value={comm.businessConnect ? "Yes" : "No"} />
        </InfoCard>

        <InfoCard title="Internet" Icon={Wifi}>
          <InfoRow label="Plan"           value={safe(net.planId)} />
          <InfoRow label="Business WiFi"  value={oneGbps ? "Included" : net.addBusinessWifi ? "Yes" : "No"} />
          <InfoRow label="Static IPs"     value={safe(net.staticIpQty, "0")} />
          <InfoRow label="Wireless Backup" value={net.wirelessBackup ? "Yes" : "No"} />
          <InfoRow label="Apple TV 4K"    value={net.appleTV4K ? "Yes" : "No"} />
          <InfoRow label="Cable TV"       value={net.cableTv ? "Yes" : "No"} />
          <InfoRow label="Roku"           value={net.roku ? "Yes" : "No"} />
        </InfoCard>

        <InfoCard title="Installation" Icon={Truck}>
          <InfoRow label="Type"           value={safe(inst.type)} />
          <InfoRow label="Recipient First" value={safe(inst.recipientFirst)} />
          <InfoRow label="Recipient Last"  value={safe(inst.recipientLast)} />
        </InfoCard>

        <InfoCard title="Property Contact" Icon={User}>
          <InfoRow label="Name"  value={safe(prop.name)} />
          <InfoRow label="Email" value={safe(prop.email)} />
          <InfoRow label="Phone" value={safe(prop.phone)} />
        </InfoCard>
      </div>

      {/* Pricing */}
      <div className="mt-4">
        <InfoCard title="Pricing" Icon={DollarSign}>
          <InfoRow label="Monthly (est.)" value={fmtMoney(Number(price.monthly || 0))} />
          <InfoRow label="One-time fees"  value={fmtMoney(Number(price.oneTime || 0))} />
          <div className="px-4 py-2 text-xs" style={{ color: "var(--admin-text-secondary)" }}>
            Taxes, surcharges, and additional fees may apply.
          </div>
        </InfoCard>
      </div>

      <div className="mt-5">
        <Link to="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--admin-accent)" }}>
          <ArrowLeft size={14} /> Back to bookings
        </Link>
      </div>
    </AdminLayout>
  );
}
