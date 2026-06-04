import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/1hbds.svg";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa6";
import { ChevronDown, ChevronUp } from "lucide-react";

const Footer = () => {
  const [open, setOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#1f6300] to-[#1f6300] text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 md:block hidden">
        {/* Wrapper with two white sections */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] bg-white rounded-lg overflow-hidden">
          {/* Left - Logo */}
          <div className="flex flex-col items-center sm:items-start p-6 bg-white">
            <Link to="/" className="inline-flex items-center">
              <img
                src={logo}
                alt="Zenithlink"
                className="h-32 sm:h-40 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right - Links & Info */}
          <div className="bg-white text-gray-800 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
              {/* Deals */}
              <div>
                <h4 className="text-[#1f6300] font-semibold tracking-wide mb-4 text-lg sm:text-xl">
                  Deals
                </h4>
                <ul className="space-y-3">
                  {[
                    {
                      label: "AT&T Internet Deals",
                      href: "https://www.att.com/internet/internet-service-plans/",
                    },
                    {
                      label: "Spectrum Internet Deals",
                      href: "https://www.spectrum.com/internet/plans",
                    },
                    {
                      label: "Comcast Business Deals",
                      href: "https://www.xfinity.com/learn/deals/internet",
                    },
                  ].map((d) => (
                    <li key={d.href}>
                      <a
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-gray-700 hover:text-[#1f6300] transition"
                      >
                        {d.label}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[#1f6300] font-semibold tracking-wide mb-4 text-lg sm:text-xl">
                  Contact
                </h4>
                <ul className="space-y-3">
                  {["support@zenithlink.us", "sales@zenithlink.us"].map(
                    (email) => (
                      <li key={email}>
                        <a
                          href={`mailto:${email}`}
                          className="inline-flex items-center gap-2 text-gray-700 hover:text-[#1f6300] transition"
                        >
                          <Mail className="h-4 w-4" />
                          {email}
                        </a>
                      </li>
                    )
                  )}
                </ul>
                <a
                  href="tel:1-855 744 2407"
                  className="mt-3 inline-flex items-center gap-2 text-gray-700 hover:text-[#1f6300] transition"
                >
                  <Phone className="h-4 w-4" />
                  1-855 744 2407
                </a>
              </div>

              {/* Legal & Branding */}
              <div>
                <h4 className="text-[#1f6300] font-semibold tracking-wide mb-4 text-lg sm:text-xl">
                  Legal & Branding
                </h4>
              
                <p className="text-sm text-gray-500 leading-relaxed mt-3">
                  Trademarks, logos, and brand names are the property of their
                  respective owners. Used for descriptive purposes only.
                </p>
                <Link to="/privacypolicy">Privacy Policy</Link>
              </div>
            </div>

            {/* Divider & Bottom line */}
            <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-gray-600 flex items-center justify-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                  © {year} <strong className="text-gray-800">Zenithlink</strong>
                  . All rights reserved.
                </p>
            </div>
          </div>
        </div>
      </div>
      {/* ✅ Mobile View */}
      <div className="max-w-7xl mx-auto px-6 py-14 md:hidden">
        <div className=" flex flex-col items-center text-center px-6 py-10 space-y-6 bg-white rounded-lg text-black">
          {/* Logo */}
          <img
            src={logo}
            alt="Zenithlink"
            className="h-20 w-auto object-contain"
          />

          {/* Quick Links */}
          <div className="w-full flex items-center justify-center">
            <div className="mt-4 flex flex-col gap-3 px-4">
              <a
                href="mailto:support@zenithlink.us"
                className="inline-flex items-center gap-2 text-gray-700 hover:text-[#1f6300] transition"
              >
                <Mail className="h-4 w-4" /> support@zenithlink.us
              </a>

              <a
                href="mailto:sales@zenithlink.us"
                className="inline-flex items-center gap-2 text-gray-700 hover:text-[#1f6300] transition"
              >
                <Mail className="h-4 w-4" /> sales@zenithlink.us
              </a>

              <a
                href="tel:18557442407"
                className="inline-flex items-center gap-2 text-gray-700 hover:text-[#1f6300] transition"
              >
                <Phone className="h-4 w-4" /> 1-855 744 2407
              </a>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              to="/contact-us"
              className="bg-white text-[#1f6300] px-5 py-2 rounded-full border border-[#1f6300] font-semibold"
            >
              Get in Touch
            </Link>
          </div>

          {/* Privacy Policy */}
          <Link to="/privacypolicy" className="text-sm underline">
            Our Privacy Policy
          </Link>

          {/* Copyright */}
          <p className="text-xs text-gray-300">
            © {year} Zenithlink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
