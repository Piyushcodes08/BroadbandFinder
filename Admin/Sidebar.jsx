import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MapPin, Upload, BookOpen,
  ShoppingBag, UserPlus, LogOut, Menu, X, Palette,
} from "lucide-react";
import logo from "../src/assets/logo.png";
import { useTheme } from "./ThemeContext";
import ThemeCustomizer from "./ThemeCustomizer";

const links = [
  { to: "/admin",                end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/bookings",              icon: BookOpen,    label: "Customer Bookings" },
  { to: "/admin/spectrum-orders",       icon: ShoppingBag, label: "Spectrum Orders" },
  { to: "/admin/zipcodes",              icon: MapPin,      label: "Manage Zipcodes" },
  { to: "/admin/upload",                icon: Upload,      label: "Upload CSV" },
  { to: "/admin/create",                icon: UserPlus,    label: "Create Admin" },
];

function SidebarInner({ onLinkClick, onLogout }) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col" style={{ height: "100dvh", backgroundColor: theme.sidebarBg }}>

      {/* Logo area */}
      <div className="px-5 py-5 shrink-0" style={{ borderBottom: `1px solid ${theme.borderColor}20` }}>
        <NavLink to="/admin" onClick={onLinkClick}>
          <img src={logo} alt="24x7 NetConnect" className="h-10 w-auto object-contain" />
        </NavLink>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: `${theme.sidebarText}80` }}>
          Admin Panel
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={onLinkClick}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={({ isActive }) =>
              isActive
                ? {
                    backgroundColor: theme.sidebarActive,
                    color: "#ffffff",
                    boxShadow: `0 4px 12px ${theme.sidebarActive}40`,
                  }
                : {
                    color: theme.sidebarText,
                    backgroundColor: "transparent",
                  }
            }
          >
            <l.icon size={17} />
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Customize + Logout */}
      <div className="px-3 py-4 space-y-1 shrink-0" style={{ borderTop: `1px solid ${theme.borderColor}20` }}>
        {/* Customize button — opens ThemeCustomizer panel */}
        <ThemeCustomizer trigger={
          <button
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: theme.sidebarText }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.sidebarActive}15`;
              e.currentTarget.style.color = theme.sidebarActive;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = theme.sidebarText;
            }}
          >
            <Palette size={17} />
            Customize
          </button>
        } />

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: theme.sidebarText }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
            e.currentTarget.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = theme.sidebarText;
          }}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:block shrink-0"
        style={{
          width: "256px",
          height: "100dvh",
          position: "sticky",
          top: 0,
          backgroundColor: theme.sidebarBg,
          borderRight: `1px solid ${theme.borderColor}30`,
          boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
        }}
      >
        <SidebarInner onLinkClick={() => {}} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 shadow-sm"
        style={{ backgroundColor: theme.sidebarBg, borderBottom: `1px solid ${theme.borderColor}30` }}
      >
        <NavLink to="/admin">
          <img src={logo} alt="24x7 NetConnect" className="h-8 w-auto object-contain" />
        </NavLink>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border text-slate-700"
          style={{ borderColor: theme.borderColor }}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-full shadow-xl flex flex-col" style={{ backgroundColor: theme.sidebarBg }}>
            <SidebarInner onLinkClick={() => setOpen(false)} onLogout={handleLogout} />
          </aside>
        </div>
      )}
    </>
  );
}
