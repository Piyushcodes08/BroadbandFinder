import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../src/assets/logo.png";

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("isAdmin") === "true") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/admin/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.admin.isAdmin ? "true" : "false");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#E8611A] to-[#f47630]" />

          <div className="px-8 py-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={logo} alt="24x7 NetConnect" className="h-12 w-auto object-contain" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Admin Login</h1>
            <p className="text-sm text-slate-500 text-center mb-8">Sign in to access the dashboard</p>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  placeholder="admin@example.com"
                  required autoComplete="email" disabled={submitting}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#E8611A] focus:ring-2 focus:ring-[#E8611A]/20 transition disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password" name="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                    required autoComplete="current-password" disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#E8611A] focus:ring-2 focus:ring-[#E8611A]/20 transition disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full rounded-xl bg-[#E8611A] py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(232,97,26,0.28)] hover:bg-[#d55815] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} 24x7 NetConnect. All rights reserved.
        </p>
      </div>
    </div>
  );
}
