import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"
import logo from "../assets/logo.png";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);          // mobile drawer
  const [cloudOpen, setCloudOpen] = useState(false);        // dropdown (mobile + desktop hover)
  const location = useLocation();
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  // Auth check (client only)
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // Close menu/dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
    setCloudOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click

  const onClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setCloudOpen(false);
    }
  };


  // Close on Esc; lock scroll when drawer open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setCloudOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);

    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  // Admin route check
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isActive = (path) => location.pathname.startsWith(path);

  const linkBase =
    "text-gray-900 text-base lg:text-lg font-medium transition-colors hover:text-[#E8611A]";
  const linkActive = "text-[#E8611A]";

  return (
    <div className="relative">
      {/* Topbar */}
      <div className="h-8 bg-[#E8611A] flex items-center justify-between md:justify-end px-4 md:px-16">
        <a
          href="mailto:sales@24x7netconnect.us"
          className="hidden sm:flex items-center gap-2 text-white hover:text-gray-200 transition"
        >
          <span className="text-sm font-bold">sales@24x7netconnect.us</span>
        </a>

        <div className="flex items-center gap-3 ml-auto">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF className="text-white hover:text-gray-200 transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
            <FaXTwitter className="text-white hover:text-gray-200 transition" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="text-white hover:text-gray-200 transition" />
          </a>
        </div>
      </div>

      {/* Header */}
      <header
        className={`w-full z-50 border-b border-gray-200 bg-white ${isAdminRoute ? "relative" : "sticky top-0"
          }`}
      >
        <div className="flex items-center justify-between py-2 md:px-16 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center h-14 sm:h-16 shrink-0" aria-label="24x7 NetConnect Home">
            <img
              src={logo}
              alt="24x7 NetConnect Logo"
              className="w-36 sm:w-48 md:w-56 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/internet/SpectrumBusiness"
              className={`${linkBase} ${isActive("/internet/SpectrumBusiness") ? linkActive : ""} border-r pr-4`}
            >
              Spectrum Business
            </Link>
            <Link
              to="/internet/AttBusiness"
              className={`${linkBase} ${isActive("/internet/AttBusiness") ? linkActive : ""} border-r pr-4`}
            >
              AT&T Business
            </Link>
            <Link
              to="/internet/ComcastBusiness"
              className={`${linkBase} ${isActive("/internet/ComcastBusiness") ? linkActive : ""} border-r pr-4`}
            >
              Comcast Business
            </Link>
            <Link
              to="/internet/AccBusiness"
              className={`${linkBase} ${isActive("/internet/AccBusiness") ? linkActive : ""} border-r pr-4`}
            >
              Acc Business
            </Link>

            {/* Cloud Services (hover on desktop) */}
            <div
              className="relative"
              onClick={() => setCloudOpen(!cloudOpen)}
              ref={dropdownRef}
            >
              <button
                type="button"
                className={`${linkBase} ${cloudOpen ? "text-[#E8611A]" : ""} border-r pr-4 flex items-center gap-1`}
                aria-haspopup="menu"
                aria-expanded={cloudOpen}
                aria-controls="cloud-menu"
              >
                Cloud Services
                <ChevronDown
                  size={18}
                  className={`transition-transform ${cloudOpen ? "rotate-180" : ""}`}
                />
              </button>
              {cloudOpen && (
                <div
                  id="cloud-menu"
                  role="menu"
                  className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50"
                >
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/internet/cloudsevices/ringcentralvoip"
                        className="block px-4 py-2 hover:bg-gray-100"
                        role="menuitem"
                      >
                        RingCentral
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/internet/cloudsevices/spectrumvoip"
                        className="block px-4 py-2 hover:bg-gray-100"
                        role="menuitem"
                      >
                        SpectrumVoIP
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Link
              to="/contact-us"
              className={`${linkBase} ${isActive("/contact-us") ? linkActive : ""}`}
            >
              Contact Us
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/admin"
                  className={`${linkBase} ${isActive("/admin") ? linkActive : ""} border-l pl-4`}
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 rounded bg-[#E8611A] text-white shadow hover:bg-[#C44E12] transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Hamburger (Mobile/Tablet) */}
          <button
            className="lg:hidden text-gray-900 text-3xl p-2 -mr-2"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Drawer + Backdrop */}
        {/* Backdrop */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/40 transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setMenuOpen(false)}
          aria-hidden={!menuOpen}
        />
        {/* Drawer */}
        <aside
          id="mobile-drawer"
          ref={drawerRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-[86%] max-w-sm bg-white shadow-xl z-50 transition-transform duration-300
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Link to="/" onClick={() => setMenuOpen(false)} aria-label="24x7 NetConnect Home">
              <img src={logo} alt="24x7 NetConnect Logo" className="h-10 object-contain" />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="px-6 py-4 flex flex-col gap-2 overflow-y-auto">
            <Link
              to="/internet/SpectrumBusiness"
              className={`${linkBase} ${isActive("/internet/SpectrumBusiness") ? linkActive : ""} py-2 border-b`}
              onClick={() => setMenuOpen(false)}
            >
              Spectrum Business
            </Link>
            <Link
              to="/internet/AttBusiness"
              className={`${linkBase} ${isActive("/internet/AttBusiness") ? linkActive : ""} py-2 border-b`}
              onClick={() => setMenuOpen(false)}
            >
              AT&T Business
            </Link>
            <Link
              to="/internet/ComcastBusiness"
              className={`${linkBase} ${isActive("/internet/ComcastBusiness") ? linkActive : ""} py-2 border-b`}
              onClick={() => setMenuOpen(false)}
            >
              Comcast Business
            </Link>
            <Link
              to="/internet/AccBusiness"
              className={`${linkBase} ${isActive("/internet/AccBusiness") ? linkActive : ""} py-2 border-b`}
              onClick={() => setMenuOpen(false)}
            >
              Acc Business
            </Link>

            {/* Cloud Services (tap to open on mobile) */}
            <div className="pt-2" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCloudOpen((s) => !s)}
                className={`${linkBase} w-full flex items-center justify-between py-2`}
                aria-haspopup="menu"
                aria-expanded={cloudOpen}
                aria-controls="cloud-menu-mobile"
              >
                <span>Cloud Services</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${cloudOpen ? "rotate-180" : ""}`}
                />
              </button>
              {cloudOpen && (
                <div id="cloud-menu-mobile" role="menu" className="ml-3 mt-1 border-l pl-3">
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/internet/cloudsevices/ringcentralvoip"
                        className="block py-2 hover:text-[#E8611A]"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        RingCentral
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/internet/cloudsevices/spectrumvoip"
                        className="block py-2 hover:text-[#E8611A]"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        SpectrumVoIP
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Link
              to="/contact-us"
              className={`${linkBase} ${isActive("/contact-us") ? linkActive : ""} py-2`}
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/admin"
                  className={`${linkBase} ${isActive("/admin") ? linkActive : ""} py-2 border-t mt-2`}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="mt-3 w-full px-3 py-2 rounded bg-[#E8611A] text-white shadow hover:bg-[#C44E12] transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </aside>
      </header>
    </div>
  );
};

export default Header;
