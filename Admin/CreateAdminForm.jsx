import axios from "axios";
import { useState } from "react";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import AdminLayout, { AdminCard, AdminBtn } from "./AdminLayout";

export default function CreateAdminForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/create`, formData);
      setMessage(res.data.message || "Admin created successfully.");
      setIsError(false);
      setFormData({ email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong.");
      setIsError(true);
    } finally { setLoading(false); }
  };

  return (
    <AdminLayout title="Create Admin" subtitle="Add a new admin account.">
      <div className="max-w-md">
        <AdminCard>
          <div className="h-1" style={{ background: "linear-gradient(to right, var(--admin-accent), var(--admin-sidebar-active))" }} />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--admin-accent) 12%, transparent)", color: "var(--admin-accent)" }}>
                <UserPlus size={18} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: "var(--admin-text-primary)" }}>New Admin Account</p>
                <p className="text-xs" style={{ color: "var(--admin-text-secondary)" }}>Fill in the details below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "email",    label: "Email",    type: "email",    placeholder: "admin@example.com" },
                { name: "password", label: "Password", type: "password", placeholder: "Min. 8 characters" },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--admin-text-primary)" }}>{label}</label>
                  <input
                    type={type} name={name}
                    value={formData[name]} onChange={handleChange}
                    placeholder={placeholder} required
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                    style={{ backgroundColor: "var(--admin-page-bg)", borderColor: "var(--admin-border)", color: "var(--admin-text-primary)" }}
                  />
                </div>
              ))}
              <AdminBtn type="submit" disabled={loading} className="w-full justify-center py-3">
                {loading ? "Creating…" : "Create Admin"}
              </AdminBtn>
            </form>

            {message && (
              <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium border ${isError ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                {isError ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
                {message}
              </div>
            )}
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
