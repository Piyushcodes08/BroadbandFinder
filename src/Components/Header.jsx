import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Mail, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const businessLinks = [
  { label: "Spectrum", to: "/internet/SpectrumBusiness" },
  { label: "AT&T", to: "/internet/AttBusiness" },
  { label: "Comcast", to: "/internet/ComcastBusiness" },
  { label: "ACC", to: "/internet/AccBusiness" },
];

const cloudLinks = [
  {
    label: "RingCentral",
    description: "Unified business communications",
    to: "/internet/cloudsevices/ringcentralvoip",
  },
  {
    label: "SpectrumVoIP",
    description: "Reliable cloud-powered calling",
    to: "/internet/cloudsevices/spectrumvoip",
  },
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cloudOpen, setCloudOpen] = useState(false);
  const location = useLocation();
  const desktopDropdownRef = useRef(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(Boolean(token));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCloudOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setCloudOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCloudOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.toggle("overflow-hidden", menuOpen);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isActive = (path) => location.pathname.startsWith(path);
  const isCloudActive = location.pathname.startsWith("/internet/cloudsevices");

  const desktopLinkClass = (active = false) =>
    `relative flex h-10 items-center rounded-full px-3 text-[13px] font-semibold tracking-[-0.01em] transition-all duration-300 xl:px-3.5 xl:text-sm ${
      active
        ? "bg-[#fff1e8] text-[#d95717] shadow-[inset_0_0_0_1px_rgba(217,87,23,0.08)]"
        : "text-[#344054] hover:bg-[#f8f5f1] hover:text-[#d95717]"
    }`;

  const mobileLinkClass = (active = false) =>
    `group flex min-h-12 items-center justify-between rounded-2xl px-4 text-[15px] font-semibold transition-colors ${
      active
        ? "bg-[#fff2e8] text-[#d95717]"
        : "text-slate-800 hover:bg-slate-50 hover:text-[#d95717]"
    }`;

  return (
    <div className="absolute w-full z-50 font-sans">
      <header
        className={`w-full border-b border-[#e8e3dc] bg-white/95 shadow-[0_12px_32px_rgba(15,23,42,0.055)] backdrop-blur-xl ${
          isAdminRoute ? "relative" : "sticky top-0"
        }`}
      >
        <div className="mx-auto flex h-[82px] max-w-[1360px] items-center justify-between gap-5 px-5 py-0 sm:px-7 lg:h-[88px] lg:px-10">
          <Link
            to="/"
            className="flex h-full shrink-0 items-center rounded-lg outline-none ring-[#e8611a]/25 focus-visible:ring-4"
            aria-label="24x7 NetConnect Home"
          >
            <img
              src={logo}
              alt="24x7 NetConnect"
              className="block h-auto w-[172px] max-h-[88px] object-contain sm:w-[190px] lg:w-[196px]"
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-0.5 lg:flex xl:gap-1"
            aria-label="Primary navigation"
          >
            {businessLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={desktopLinkClass(isActive(item.to))}
              >
                {item.label}
              </Link>
            ))}

            <div className="relative" ref={desktopDropdownRef}>
              <button
                type="button"
                onClick={() => setCloudOpen((open) => !open)}
                className={desktopLinkClass(cloudOpen || isCloudActive)}
                aria-haspopup="menu"
                aria-expanded={cloudOpen}
                aria-controls="cloud-services-menu"
              >
                Cloud Services
                <ChevronDown
                  size={15}
                  className={`ml-1.5 transition-transform duration-300 ${
                    cloudOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id="cloud-services-menu"
                role="menu"
                className={`absolute right-0 top-[calc(100%+14px)] w-[330px] origin-top-right rounded-3xl border border-slate-200/80 bg-white p-2.5 shadow-[0_24px_70px_rgba(15,23,42,0.16)] transition-all duration-200 ${
                  cloudOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="px-3 pb-2 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d95717]">
                    Cloud communications
                  </p>
                </div>

                {cloudLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    className="group flex items-center justify-between rounded-2xl px-3 py-3 transition-colors hover:bg-[#fff5ee]"
                  >
                    <span>
                      <span className="block text-sm font-bold text-slate-900 group-hover:text-[#d95717]">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {item.description}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d95717]"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {isLoggedIn && (
              <Link
                to="/admin"
                className={desktopLinkClass(isActive("/admin"))}
              >
                Admin
              </Link>
            )}

            <Link
              to="/contact-us"
              className="ml-3 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#ee681d] to-[#dc4d0b] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(220,77,11,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(220,77,11,0.3)]"
            >
              Let&apos;s Talk
              <ArrowUpRight size={16} className="ml-2" />
            </Link>

            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 h-11 rounded-full border border-[#ddd7cf] bg-white px-4 text-sm font-semibold text-[#344054] transition hover:border-[#cfc6bb] hover:bg-[#faf8f5]"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-[#e8611a]/30 hover:bg-[#fff5ee] hover:text-[#d95717] lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile backdrop */}
        <div
          className={`fixed inset-0 top-0 bg-[#101828]/60 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden ${
            menuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile drawer */}
        <aside
          id="mobile-navigation"
          className={`fixed right-0 top-0 flex h-[100dvh] w-[90%] max-w-[410px] flex-col bg-[#fcfcfb] shadow-[-24px_0_70px_rgba(15,23,42,0.22)] transition-transform duration-500 ease-out lg:hidden ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex h-[78px] shrink-0 items-center justify-between border-b border-slate-200/80 px-5 py-0">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              aria-label="24x7 NetConnect Home"
            >
              <img
                src={logo}
                alt="24x7 NetConnect"
                className="block max-h-[50px] w-44 object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700"
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Business internet
            </p>

            <nav className="space-y-1" aria-label="Mobile navigation">
              {businessLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={mobileLinkClass(isActive(item.to))}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label} Business</span>
                  <ArrowUpRight
                    size={16}
                    className="text-slate-300 transition group-hover:text-[#d95717]"
                  />
                </Link>
              ))}

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setCloudOpen((open) => !open)}
                  className={`${mobileLinkClass(
                    cloudOpen || isCloudActive,
                  )} w-full`}
                  aria-expanded={cloudOpen}
                  aria-controls="mobile-cloud-services"
                >
                  <span>Cloud Services</span>
                  <ChevronDown
                    size={17}
                    className={`transition-transform duration-300 ${
                      cloudOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id="mobile-cloud-services"
                  className={`grid transition-all duration-300 ${
                    cloudOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-4 mt-2 space-y-1 border-l border-[#e8611a]/25 pl-3">
                      {cloudLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-[#fff2e8] hover:text-[#d95717]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {isLoggedIn && (
                <Link
                  to="/admin"
                  className={mobileLinkClass(isActive("/admin"))}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Admin Dashboard</span>
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </nav>
          </div>

          <div className="border-t border-slate-200 bg-white p-5">
            <Link
              to="/contact-us"
              onClick={() => setMenuOpen(false)}
              className="flex h-[52px] items-center justify-center rounded-2xl bg-[#e8611a] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(232,97,26,0.25)]"
            >
              Talk to an Expert
              <ArrowUpRight size={17} className="ml-2" />
            </Link>

            <a
              href="mailto:sales@24x7netconnect.us"
              className="mt-3 flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500"
            >
              <Mail size={14} />
              sales@24x7netconnect.us
            </a>

            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Logout
              </button>
            )}
          </div>
        </aside>
      </header>
    </div>
  );
};

export default Header;