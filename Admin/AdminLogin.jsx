import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ====== Auth Helper ======
const saveAuth = (token, isAdmin) => {
  localStorage.setItem("token", token);
  localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
};

// ====== Axios Instance ======
const api = axios.create({
  baseURL: "https://zenith.cloudastro.space/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("isAdmin") === "true"
    ) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/admin/login", form);
      saveAuth(data.token, data.admin.isAdmin);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl
                   border border-gray-200
                   sm:p-10 sm:rounded-[2rem]
                   "
        style={{ minWidth: "300px" }}
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Admin Login
        </h1>

        {error && (
          <div
            className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded mb-6 text-center text-sm font-medium"
            role="alert"
          >
            {error}
          </div>
        )}

        <label
          htmlFor="email"
          className="block text-sm font-semibold mb-1 text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="admin@example.com"
          required
          autoComplete="email"
          className="w-full rounded-md border border-gray-300 px-4 py-3
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                     mb-6 text-gray-900 placeholder-gray-400 transition"
          disabled={submitting}
        />

        <label
          htmlFor="password"
          className="block text-sm font-semibold mb-1 text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-gray-300 px-4 py-3
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                     mb-8 text-gray-900 placeholder-gray-400 transition"
          disabled={submitting}
        />

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-xl text-white font-semibold
                      transition-colors
                      ${
                        submitting
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
        >
          {submitting ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
