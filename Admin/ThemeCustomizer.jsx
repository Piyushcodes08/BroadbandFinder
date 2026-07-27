import { useState } from "react";
import { Palette, X, RotateCcw, ChevronRight } from "lucide-react";
import { useTheme } from "./ThemeContext";

const PRESETS = [
  {
    name: "Orange (Default)",
    colors: { sidebarBg: "#ffffff", sidebarActive: "#E8611A", accentColor: "#E8611A", pageBg: "#f8fafc", darkMode: false },
    dot: "#E8611A",
  },
  {
    name: "Dark Pro",
    colors: { sidebarBg: "#0f172a", sidebarText: "#94a3b8", sidebarActive: "#6366f1", accentColor: "#6366f1", pageBg: "#1e293b", cardBg: "#0f172a", headerBg: "#0f172a", textPrimary: "#f1f5f9", textSecondary: "#94a3b8", borderColor: "#334155", darkMode: true },
    dot: "#0f172a",
  },
  {
    name: "Ocean Blue",
    colors: { sidebarBg: "#0369a1", sidebarText: "#bae6fd", sidebarActive: "#0ea5e9", accentColor: "#0ea5e9", pageBg: "#f0f9ff", cardBg: "#ffffff", headerBg: "#ffffff", textPrimary: "#0c4a6e", textSecondary: "#0369a1", borderColor: "#bae6fd", darkMode: false },
    dot: "#0369a1",
  },
  {
    name: "Forest Green",
    colors: { sidebarBg: "#14532d", sidebarText: "#bbf7d0", sidebarActive: "#22c55e", accentColor: "#16a34a", pageBg: "#f0fdf4", cardBg: "#ffffff", headerBg: "#ffffff", textPrimary: "#14532d", textSecondary: "#166534", borderColor: "#bbf7d0", darkMode: false },
    dot: "#14532d",
  },
  {
    name: "Royal Purple",
    colors: { sidebarBg: "#3b0764", sidebarText: "#e9d5ff", sidebarActive: "#a855f7", accentColor: "#9333ea", pageBg: "#faf5ff", cardBg: "#ffffff", headerBg: "#ffffff", textPrimary: "#3b0764", textSecondary: "#6b21a8", borderColor: "#e9d5ff", darkMode: false },
    dot: "#3b0764",
  },
  {
    name: "Slate Dark",
    colors: { sidebarBg: "#1e293b", sidebarText: "#94a3b8", sidebarActive: "#E8611A", accentColor: "#E8611A", pageBg: "#0f172a", cardBg: "#1e293b", headerBg: "#1e293b", textPrimary: "#f8fafc", textSecondary: "#94a3b8", borderColor: "#334155", darkMode: true },
    dot: "#1e293b",
  },
];

const colorFields = [
  { key: "sidebarBg",     label: "Sidebar Background" },
  { key: "sidebarText",   label: "Sidebar Text" },
  { key: "sidebarActive", label: "Sidebar Active" },
  { key: "accentColor",   label: "Accent / Button Color" },
  { key: "headerBg",      label: "Header Background" },
  { key: "pageBg",        label: "Page Background" },
  { key: "cardBg",        label: "Card Background" },
  { key: "textPrimary",   label: "Primary Text" },
  { key: "textSecondary", label: "Secondary Text" },
  { key: "borderColor",   label: "Border Color" },
];

export default function ThemeCustomizer({ trigger }) {
  const [open, setOpen] = useState(false);
  const { theme, updateTheme, resetTheme, applyPreset } = useTheme();

  return (
    <>
      {/* Trigger — rendered by Sidebar */}
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <aside className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ backgroundColor: theme.accentColor }}>
              <div className="flex items-center gap-2 text-white">
                <Palette size={18} />
                <span className="font-bold text-sm">Dashboard Styling</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* Presets */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Quick Presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p.colors)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-700 hover:border-slate-400 transition text-left"
                    >
                      <span className="h-5 w-5 rounded-full shrink-0 border border-white shadow-sm" style={{ backgroundColor: p.dot }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Custom color pickers */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Custom Colors</p>
                <div className="space-y-3">
                  {colorFields.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <label className="text-sm text-slate-700 flex-1">{label}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 w-[72px]">
                          {theme[key]}
                        </span>
                        <input
                          type="color"
                          value={theme[key]}
                          onChange={(e) => updateTheme(key, e.target.value)}
                          className="h-8 w-8 cursor-pointer rounded-lg border border-slate-200 p-0.5"
                          title={label}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={resetTheme}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex-1 justify-center"
              >
                <RotateCcw size={15} /> Reset
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition flex-1 justify-center"
                style={{ backgroundColor: theme.accentColor }}
              >
                Apply <ChevronRight size={15} />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
