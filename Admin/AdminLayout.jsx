/**
 * AdminLayout — shared wrapper for every admin page.
 * Applies theme via CSS custom properties (set in ThemeContext).
 * Usage:
 *   <AdminLayout title="Page Title" subtitle="optional subtitle" actions={<button>...</button>}>
 *     {content}
 *   </AdminLayout>
 */
import Sidebar from "./Sidebar";

export default function AdminLayout({ title, subtitle, actions, children }) {
  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--admin-page-bg)" }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col pt-14 md:pt-0 min-w-0">
        {/* Page header */}
        {(title || actions) && (
          <header
            className="shrink-0 flex items-center justify-between px-6 py-4 gap-4"
            style={{
              backgroundColor: "var(--admin-header-bg)",
              borderBottom: "1px solid var(--admin-border)",
            }}
          >
            <div className="min-w-0">
              {title && (
                <h1
                  className="text-xl font-bold truncate"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ── Reusable themed Card ── */
export function AdminCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl shadow-sm overflow-hidden ${className}`}
      style={{
        backgroundColor: "var(--admin-card-bg)",
        border: "1px solid var(--admin-border)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Reusable themed Table ── */
export function AdminTable({ heads = [], children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead style={{ backgroundColor: "var(--admin-page-bg)" }}>
          <tr>
            {heads.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--admin-text-secondary)", borderBottom: "1px solid var(--admin-border)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ── Reusable themed Table Row ── */
export function AdminTr({ children }) {
  return (
    <tr
      className="transition-colors"
      style={{ borderTop: "1px solid var(--admin-border)" }}
    >
      {children}
    </tr>
  );
}

/* ── Reusable themed Table Cell ── */
export function AdminTd({ children, className = "" }) {
  return (
    <td
      className={`px-4 py-3 align-top ${className}`}
      style={{ color: "var(--admin-text-primary)" }}
    >
      {children}
    </td>
  );
}

/* ── Reusable themed Button ── */
export function AdminBtn({ children, onClick, disabled, variant = "primary", className = "" }) {
  const styles = {
    primary: {
      backgroundColor: "var(--admin-accent)",
      color: "#fff",
      border: "none",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--admin-text-secondary)",
      border: "1px solid var(--admin-border)",
    },
    danger: {
      backgroundColor: "#ef4444",
      color: "#fff",
      border: "none",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${className}`}
      style={styles[variant] || styles.primary}
    >
      {children}
    </button>
  );
}

/* ── Reusable themed Input ── */
export function AdminInput({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition ${className}`}
      style={{
        backgroundColor: "var(--admin-card-bg)",
        borderColor: "var(--admin-border)",
        color: "var(--admin-text-primary)",
      }}
    />
  );
}

/* ── Reusable themed Select ── */
export function AdminSelect({ value, onChange, children, className = "" }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${className}`}
      style={{
        backgroundColor: "var(--admin-card-bg)",
        borderColor: "var(--admin-border)",
        color: "var(--admin-text-primary)",
      }}
    >
      {children}
    </select>
  );
}
