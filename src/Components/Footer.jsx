import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();

  const deals = [
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
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: <FaFacebookF />,
    },
    {
      label: "X",
      href: "https://twitter.com",
      icon: <FaXTwitter />,
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      icon: <FaInstagram />,
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      icon: <FaYoutube />,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: <FaLinkedinIn />,
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#171513] text-white">
      {/* Orange accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#B8440D] via-[#E8611A] to-[#FF9A4A]" />

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-32 h-96 w-96 rounded-full bg-[#E8611A]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-orange-800/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-5 pb-7 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        {/* Main footer */}
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:pb-14 lg:grid-cols-[1.3fr_0.85fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="24x7 NetConnect home"
              className="inline-flex rounded-2xl bg-white px-5 py-3"
            >
              <img
                src={logo}
                alt="24x7 NetConnect"
                className="h-16 w-auto object-contain sm:h-[72px]"
              />
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-400">
              Helping businesses compare internet services and discover reliable
              connectivity solutions designed around their requirements.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-sm text-neutral-300 hover:border-[#E8611A] hover:bg-[#E8611A] hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Deals */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF985E]">
              Popular Deals
            </h3>

            <ul className="mt-6 space-y-4">
              {deals.map((deal) => (
                <li key={deal.href}>
                  <a
                    href={deal.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 text-sm leading-6 text-neutral-300 hover:text-white"
                  >
                    <span>{deal.label}</span>
                    <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#E8611A]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF985E]">
              Contact
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href="mailto:support@24x7netconnect.us"
                  className="flex items-start gap-3 text-sm leading-6 text-neutral-300 hover:text-white"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#FF985E]">
                    <Mail className="h-4 w-4" />
                  </span>

                  <span className="break-all">
                    support@24x7netconnect.us
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:sales@24x7netconnect.us"
                  className="flex items-start gap-3 text-sm leading-6 text-neutral-300 hover:text-white"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#FF985E]">
                    <Mail className="h-4 w-4" />
                  </span>

                  <span className="break-all">sales@24x7netconnect.us</span>
                </a>
              </li>

              <li>
                <a
                  href="tel:+18557442407"
                  className="flex items-center gap-3 text-sm text-neutral-300 hover:text-white"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#FF985E]">
                    <Phone className="h-4 w-4" />
                  </span>

                  <span>1-855-744-2407</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF985E]">
              Legal & Information
            </h3>

            <p className="mt-6 text-sm leading-7 text-neutral-400">
              Trademarks, logos and brand names belong to their respective
              owners and are used for descriptive purposes only.
            </p>

            <div className="mt-5 flex flex-col items-start gap-3">
              <Link
                to="/privacypolicy"
                className="text-sm font-medium text-neutral-300 hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                to="/contact-us"
                className="text-sm font-medium text-neutral-300 hover:text-white"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
              <MapPin className="h-4 w-4 text-[#FF985E]" />

              <span className="text-xs font-medium text-neutral-300">
                Serving businesses across the USA
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs leading-6 text-neutral-500 sm:text-sm">
            © {year}{" "}
            <strong className="font-semibold text-neutral-300">
              24x7 NetConnect
            </strong>
            . All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Secure and independent comparison service
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;