import React, { useState } from "react";
import {
  FaCheckCircle,
  FaChevronRight,
  FaChevronDown,
  FaRegCheckCircle,
  FaCheck,
  FaSearch,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdSpeed } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import attcovergae from "../assets/attcovergae.png";
import heroBg from "../assets/24x7 bg.png";
import AttBusinessHeroBg from "../assets/attbussness-herobg.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

/**
 * AT&T Business Fiber Landing – Responsive & Polished
 * - TailwindCSS + React (single file)
 * - Mobile-first, grid-based, a11y-friendly
 */

const PHONE = "1-855 744 2407";
const telHref = `tel:${PHONE.replace(/\D/g, "")}`;

const PLANS = [
  {
    tier: "300Mbps speed",
    was: 70,
    price: 40,
    upload: "300 Mbps",
    download: "300 Mbps",
    desc: "Perfect for e-commerce operations and collaboration between office and virtual employees.",
    features: [
      "300Mbps equal upload and download speeds*",
      "AT&T ActiveArmor℠ and Wi-Fi® gateway included",
      "Free installation when you order online",
    ],
  },
  {
    tier: "500Mbps speed",
    was: 110,
    price: 80,
    upload: "500 Mbps",
    download: "500 Mbps",
    desc: "Faster speed and more bandwidth to support more devices than our starting speed tier.",
    promoBadge: "Get 1 month free",
    features: [
      "500Mbps equal upload and download speeds*",
      "AT&T ActiveArmor℠ and Wi-Fi® gateway included",
      "Free installation when you order online",
    ],
  },
  {
    tier: "1 GIG speed",
    was: 160,
    price: 130,
    upload: "1 Gbps",
    download: "1 Gbps",
    desc: "Superfast 1 GIG internet for more efficient work and enhanced collaboration.",
    promoBadge: "Get 2 months free",
    features: [
      "1 GIG upload and download speeds*",
      "Wi-Fi® gateway included",
      "Free installation when you order online",
      "NEW! Includes built-in 5G internet backup at no extra cost**",
    ],
  },
  {
    tier: "2 GIG speed",
    was: 185,
    price: 155,
    upload: "2 Gbps",
    download: "2 Gbps",
    desc: "A powerful office communication connection.",
    promoBadge: "Get 2 months free",
    features: [
      "2 GIG upload and download speeds*",
      "Wi-Fi® gateway included",
      "Free installation when you order online",
      "NEW! Includes built-in 5G internet backup at no extra cost**",
    ],
  },
  {
    tier: "5 GIG speed",
    was: 285,
    price: 255,
    upload: "5 Gbps",
    download: "5 Gbps",
    desc: "Supports the most cutting-edge technologies of today and tomorrow.",
    promoBadge: "Get 2 months free",
    features: [
      "5 GIG upload and download speeds*",
      "Wi-Fi® gateway included",
      "Free installation when you order online",
      "NEW! Includes built-in 5G internet backup at no extra cost**",
    ],
  },
];

const DEALS = [
  {
    kicker: "Limited time offer",
    title: "Switch to AT&T Business Fiber",
    img: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=1600&auto=format&fit=crop",
    copy: "And we’ll cover your early termination fee up to $750.",
    legal:
      "Via reward card; redemption & proof of eligibility required. Ltd availability/areas.",
    legalLinkText: "See offer details",
    legalLinkHref: "#",
  },
  {
    kicker: "AT&T Business Fiber",
    title: "NEW! Hyper-Gig internet with built-in 5G backup",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    copy: "Included at no extra cost with business fiber plans 1 GIG or higher.*",
    legal:
      "Ltd availability/areas. *Req’s WNC-CGW452 gateway. 5G backup does not work in the event of a loss of power; battery backup options may be available at an additional cost. 5G coverage not available everywhere.",
    legalLinkText: "See details",
    legalLinkHref: "#",
  },
  {
    kicker: "Equipment included",
    title: "Free installation",
    img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1600&auto=format&fit=crop",
    copy: "Get our fastest speeds in as little as three business days.",
    legal: "Online only. Subject to availability.",
  },
];

const WHY = [
  {
    icon: <HiOutlineLightningBolt className="text-gray-700 text-6xl" />,
    title: "Simple and straightforward",
    copy: "Transparent pricing, no surprises and easy setup for small business.",
  },
  {
    icon: <MdSpeed className="text-gray-700 text-6xl" />,
    title: "Power your business",
    copy: "Symmetrical speeds built for video calls, cloud apps and backups.",
  },
  {
    icon: <FaRegCheckCircle className="text-gray-700 text-6xl" />,
    title: "The AT&T Guarantee*",
    copy: "Backed by a trusted network and dedicated support when you need it.",
  },
];

const FAQS = [
  {
    q: "What is fiber internet?",
    a: "Fiber uses light over fiber-optic cables to deliver ultra-fast, reliable internet with symmetrical download and upload speeds.",
  },
  {
    q: "Does my business need fiber?",
    a: "If you rely on video meetings, cloud apps, large file transfers or many connected devices, fiber can improve speed and stability.",
  },
  {
    q: "Can I keep my current phone number?",
    a: "Yes. In most cases we can port your existing business number when you add voice services.",
  },
];

function WirelessToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-gray-300 p-1 bg-white shadow-sm">
      <button
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 text-sm rounded-full transition ${
          value ? "bg-[#C44E12] text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        With wireless plan
      </button>
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 text-sm rounded-full transition ${
          !value ? "bg-[#C44E12] text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        Without wireless plan
      </button>
    </div>
  );
}

function PlanCard({ plan, withWireless, open, onToggle }) {
  const currentPrice = withWireless ? plan.price : plan.was ?? plan.price;
  const navigate = useNavigate();
  const handleBook = () => {
    navigate("/customerbookingfrom", { state: { name: "AT&T Business" } });
  };

  return (
    <div className="flex flex-col  rounded-2xl bg-[#f6f8fb] p-5 shadow-sm hover:shadow-md transition border border-gray-200 h-full">
      {plan.promoBadge ? (
        <span className="self-start mb-2 text-xs font-semibold text-white bg-[#E8611A] px-2.5 py-1 rounded-full">
          {plan.promoBadge}
        </span>
      ) : (
        <div className="mt-6" />
      )}

      <h3 className="text-lg md:text-xl font-bold text-gray-900">
        {plan.tier}
      </h3>
      <p className="mt-1 text-gray-600 text-sm min-h-[80px]">{plan.desc}</p>

      <div className="mt-6 md:mt-10">
        <div className="flex items-end gap-2">
          <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
            ${currentPrice}
          </span>
          <span className="text-gray-600">/mo.</span>
        </div>
        <p className="text-[12px] text-gray-500">plus taxes &amp; fees</p>
      </div>

      <button
        className="mt-4 w-full px-4 py-3 rounded-full bg-[#C44E12] text-white font-semibold hover:bg-[#712C09]"
        onClick={handleBook}
      >
        Book Plan
      </button>

      <button
        onClick={onToggle}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-900"
        aria-expanded={open}
        type="button"
      >
        <span>See plan features</span>
        <FaChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="mt-3 space-y-2 text-sm text-gray-800">
          {plan.features?.map((f, i) => (
            <li key={i} className="flex gap-2">
              <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <span
                className={/NEW!|built-in 5G/i.test(f) ? "font-semibold" : ""}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DealCard({ d }) {
  return (
    <article className="rounded-2xl overflow-hidden bg-[#F5FAFF] border border-gray-200 shadow-sm" data-aos="fade-up">
      <img
        src={d.img}
        alt={d.title}
        className="h-44 w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="p-5">
        {d.kicker && (
          <p className="text-[12px] font-semibold text-gray-600">{d.kicker}</p>
        )}
        <h3 className="mt-1 font-extrabold text-xl text-gray-900">{d.title}</h3>
        {d.copy && <p className="mt-2 text-gray-700 text-sm">{d.copy}</p>}
        {(d.legal || d.legalLinkText) && (
          <p className="mt-3 text-[12px] leading-5 text-gray-600">
            {d.legal}{" "}
            {d.legalLinkText && (
              <a
                href={d.legalLinkHref || "#"}
                className="font-semibold underline"
              >
                {d.legalLinkText}
              </a>
            )}
          </p>
        )}
      </div>
    </article>
  );
}

function WhyCard({ w }) {
  return (
    <div className="rounded-xl flex flex-col items-center p-6 text-center bg-white border" data-aos="fade-up">
      {w.icon}
      <h3 className="mt-3 font-semibold text-2xl">{w.title}</h3>
      <p className="text-gray-600 text-md mt-2">{w.copy}</p>
    </div>
  );
}
function ComparisonTable() {
  const specs = [
    {
      label: "Fastest broadband speed tier",
      value: (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="font-extrabold text-gray-900 text-sm md:text-base">5 GIG²</span>
          <span className="text-[10px] md:text-xs text-gray-500 font-normal leading-tight mt-0.5">(Ltd. avail/areas)</span>
        </div>
      ),
    },
    {
      label: "100% symmetrical fiber network",
      value: <FaCheck className="text-[#E8611A] text-base md:text-lg mx-auto" />,
    },
    {
      label: "Upload as fast as downloads",
      value: <FaCheck className="text-[#E8611A] text-base md:text-lg mx-auto" />,
    },
    {
      label: "No annual contract",
      value: <FaCheck className="text-[#E8611A] text-base md:text-lg mx-auto" />,
    },
    {
      label: "No additional equipment fees for Wi-Fi service",
      value: <FaCheck className="text-[#E8611A] text-base md:text-lg mx-auto" />,
    },
    {
      label: "No data caps",
      value: <FaCheck className="text-[#E8611A] text-base md:text-lg mx-auto" />,
    },
    {
      label: "Free installation",
      value: (
        <div className="flex flex-col items-center justify-center text-center">
          <FaCheck className="text-[#E8611A] text-base md:text-lg mx-auto" />
          <span className="text-[10px] md:text-xs text-gray-500 font-normal leading-tight mt-0.5">With online orders only</span>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white max-w-4xl mx-auto">
      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="border-b border-gray-200">
            {/* Left header cell is empty */}
            <th className="w-[60%] md:w-[70%] px-4 md:px-6 py-4 bg-white"></th>
            {/* AT&T Column Header with dark red background */}
            <th className="w-[40%] md:w-[30%] p-0 bg-[#FEF3EC] align-bottom">
              <div className="bg-[#E8611A] text-white text-center py-4 font-bold text-xs md:text-sm lg:text-base rounded-t-xl shadow-sm tracking-wide">
                AT&amp;T Business Fiber®
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {specs.map((s, i) => (
            <tr key={i} className="hover:bg-gray-50/30 transition">
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm lg:text-base text-gray-800 font-medium align-middle">
                {s.label}
              </td>
              <td className="px-4 md:px-6 py-4 text-center align-middle bg-[#FEF3EC]">
                {s.value}
              </td>
            </tr>
          ))}
          {/* Footnote Row */}
          <tr>
            <td colSpan={2} className="px-4 md:px-6 py-4 text-[9px] md:text-[11px] text-gray-400 bg-white italic font-normal">
              ² Competitor comparison based on publicly available data as of May 22, 2025.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y rounded-xl border bg-white">
      {FAQS.map((f, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-4 text-left font-semibold"
          >
            {f.q}
            <FaChevronDown
              className={`transition ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <p className="px-4 pb-4 text-gray-700 text-sm">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ATTBusinessReplica() {
  const [withWireless, setWithWireless] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [openAll, setOpenAll] = useState(false);
  const [openPlan, setOpenPlan] = useState(null);

  const onZipChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZipcode(onlyDigits);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const zip = zipcode.trim();
    if (!zip || !/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResults({ available: true, zipcode: zip });
      setLoading(false);
    }, 400);
  };

  const handleBook = () => {
    navigate("/customerbookingfrom", { state: { name: "AT&T Business" } });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Premium Hero Section */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#f5f2eb]">
        {/* Background image */}
        <img
          src={AttBusinessHeroBg}
          alt="AT&T Business Fiber solutions"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center"
        />

        {/* Responsive image overlays */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#F8F6F1] via-[#F8F6F1]/95 to-[#F8F6F1]/45
            sm:via-[#F8F6F1]/90 sm:to-transparent
            lg:from-[#F8F6F1] lg:via-transparent lg:to-transparent
          "
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1440px] items-center px-5 sm:px-10 lg:px-16 xl:px-20">
          <div
            className="w-full max-w-[720px] pt-10"
            data-aos="fade-right"
            data-aos-duration="900"
          >
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-orange-600" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-700 sm:text-sm">
                AT&T Business®
              </p>
            </div>

            {/* Main heading */}
            <h1 className="max-w-[680px] text-[clamp(2.8rem,6vw,3.7rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#171717]">
              Business Fiber
              <span className="mt-2 block tracking-[-0.04em] text-orange-700">
                Starting at $40/mo.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[620px] text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8 lg:text-xl">
              Get fast, reliable AT&T Business Fiber. Save $30/mo when you bundle with an eligible wireless plan.
            </p>

            {/* Feature */}
            <div className="mt-7 flex max-w-[590px] items-start gap-4 border-l-2 border-orange-600 pl-5">
              <div>
                <p className="font-semibold text-neutral-900">
                  Get up to two months free & Switching Credit
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600 sm:text-base">
                  We’ll cover your early termination fee up to $750 when switching from another provider.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={telHref}
                aria-label={`Call AT&T Business at ${PHONE}`}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full hover:bg-white px-7 text-base font-semibold hover:text-black text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 bg-orange-700 hover:shadow-[0_20px_45px_rgba(194,65,12,0.25)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                  <FaPhoneAlt className="text-sm" />
                </span>
                <span>Call {PHONE}</span>
              </a>
              <div className="flex items-center gap-3 px-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                <span className="text-sm font-medium leading-6 text-neutral-600">
                  Business specialists available
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 lg:flex">
          <span>Explore</span>
          <span className="h-px w-12 bg-neutral-500" />
        </div>
      </section>

      {/* ZIP checker */}
     <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="availability-heading"
>
  {/* Background decoration */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.10),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
    <div
      className="
        overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white
        px-5 py-8 shadow-[0_24px_70px_rgba(30,24,20,0.09)]
        sm:px-8 sm:py-10 lg:px-12 lg:py-12
      "
    >
      {/* Heading */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#E8611A]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
            Check Availability
          </span>

          <span className="h-px w-8 bg-[#E8611A]" />
        </div>

        <h2
          id="availability-heading"
          className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
        >
          See what’s available at your business
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
          Enter your five-digit ZIP code to check AT&amp;T Business service
          availability in your area.
        </p>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-2xl"
        role="search"
        aria-label="Check service availability by ZIP code"
      >
        <label
          htmlFor="zipcode"
          className="mb-2 block text-sm font-semibold text-neutral-800"
        >
          Business ZIP code
        </label>

        <div
          className={`
            group flex min-h-[62px] overflow-hidden rounded-2xl
            border bg-white shadow-[0_10px_30px_rgba(30,24,20,0.07)]
            transition-all duration-300 focus-within:ring-4
            focus-within:ring-[#E8611A]/15
            ${
              error
                ? "border-red-300 focus-within:border-red-400"
                : "border-neutral-200 focus-within:border-[#E8611A]"
            }
          `}
        >
          <span
            className="
              flex w-14 shrink-0 items-center justify-center
              border-r border-neutral-100 bg-[#FFF8F3]
              text-[#C44E12] sm:w-16
            "
            aria-hidden="true"
          >
            <FaSearch className="h-5 w-5" />
          </span>

          <input
            id="zipcode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{5}"
            maxLength={5}
            value={zipcode}
            onChange={onZipChange}
            placeholder="Enter ZIP code"
            className="
              min-w-0 flex-1 bg-white px-4 py-4
              text-base font-medium text-neutral-900 outline-none
              placeholder:font-normal placeholder:text-neutral-400
              sm:px-5 sm:text-lg
            "
            aria-describedby={error ? "zipcode-error" : "zipcode-helper"}
            aria-invalid={Boolean(error)}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex min-w-[68px] shrink-0 items-center justify-center
              gap-2 bg-[#C44E12] px-5 text-sm font-semibold text-white
              transition-all duration-300
              hover:bg-[#A83E0C]
              disabled:cursor-not-allowed disabled:bg-[#E99A72]
              focus-visible:outline-none focus-visible:ring-4
              focus-visible:ring-inset focus-visible:ring-white/40
              sm:min-w-[150px] sm:px-6 sm:text-base
            "
            aria-label="Check availability"
          >
            {loading ? (
              <>
                <span
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Checking...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Check Now</span>
                <FaSearch className="h-4 w-4 sm:hidden" aria-hidden="true" />
                <span
                  className="hidden text-lg transition-transform group-hover:translate-x-0.5 sm:inline"
                  aria-hidden="true"
                >
                  →
                </span>
              </>
            )}
          </button>
        </div>

        {error ? (
          <p
            id="zipcode-error"
            className="mt-2 flex items-center gap-2 text-sm font-medium text-red-600"
            role="alert"
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-xs"
              aria-hidden="true"
            >
              !
            </span>
            {error}
          </p>
        ) : (
          <p
            id="zipcode-helper"
            className="mt-2 text-xs text-neutral-500"
          >
            Please enter a valid five-digit U.S. ZIP code.
          </p>
        )}
      </form>

      {/* Availability result */}
      {results && (
        <div
          className="
            mx-auto mt-8 max-w-2xl rounded-2xl border border-emerald-200
            bg-emerald-50/70 p-5
            shadow-[0_12px_30px_rgba(5,150,105,0.08)]
            sm:p-6
          "
          aria-live="polite"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <span
              className="
                flex h-12 w-12 shrink-0 items-center justify-center
                rounded-full bg-emerald-600 text-white
                shadow-[0_8px_20px_rgba(5,150,105,0.24)]
              "
              aria-hidden="true"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>

            <div className="mt-4 flex-1 sm:ml-4 sm:mt-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">
                Service Available
              </p>

              <p className="mt-1 text-lg font-bold leading-snug text-neutral-900 sm:text-xl">
                AT&amp;T Business is available in {results.zipcode}
              </p>
            </div>

            <button
              type="button"
              onClick={handleBook}
              className="
                mt-5 inline-flex min-h-12 w-full items-center justify-center
                gap-2 rounded-xl bg-[#C44E12] px-6 text-sm font-semibold
                text-white shadow-[0_10px_24px_rgba(196,78,18,0.22)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:bg-[#A83E0C]
                focus-visible:outline-none focus-visible:ring-4
                focus-visible:ring-[#E8611A]/25
                sm:ml-5 sm:mt-0 sm:w-auto
              "
            >
              Book Now
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Trust indicators */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-neutral-500">
        {["Fast availability check", "No obligation", "Business support"].map(
          (item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#E8611A]"
                aria-hidden="true"
              />
              {item}
            </span>
          )
        )}
      </div>
    </div>
  </div>
</section>

      {/* Plans */}
     <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  aria-labelledby="pricing-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.10),transparent_38%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Business Internet Plans
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="pricing-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Fast speeds. Straightforward pricing.
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Choose speeds from 300 Mbps to 5 Gbps with essential business
        features, flexible wireless options and room to grow.
      </p>
    </div>

    {/* Wireless option */}
    <div className="mt-8 flex flex-col items-center justify-center">
      <div
        className="
          rounded-2xl border border-neutral-200/80 bg-white
          px-4 py-3 shadow-[0_10px_30px_rgba(30,24,20,0.06)]
          sm:px-5
        "
      >
        <WirelessToggle
          value={withWireless}
          onChange={setWithWireless}
        />
      </div>

      <p className="mt-3 text-center text-xs leading-5 text-neutral-500">
        Customize your plan by adding a wireless service option.
      </p>
    </div>

    {/* Desktop and tablet plans */}
    <div
      className="
        mt-10 hidden gap-5 sm:grid sm:grid-cols-2
        lg:grid-cols-3 xl:grid-cols-5 xl:gap-4
      "
      data-aos="fade-up"
    >
      {PLANS.map((plan, index) => (
        <div
          key={plan.id ?? index}
          className={`
            relative min-w-0
            ${index === 0 ? "lg:col-start-1" : ""}
          `}
        >
          {plan.popular && (
            <div
              className="
                absolute -top-3 left-1/2 z-20
                -translate-x-1/2 whitespace-nowrap rounded-full
                bg-[#C44E12] px-4 py-1.5
                text-[10px] font-bold uppercase tracking-[0.14em]
                text-white shadow-[0_8px_20px_rgba(196,78,18,0.25)]
              "
            >
              Most Popular
            </div>
          )}

          <PlanCard
            plan={plan}
            withWireless={withWireless}
            open={openPlan === index}
            onToggle={() =>
              setOpenPlan((current) =>
                current === index ? null : index
              )
            }
          />
        </div>
      ))}
    </div>

    {/* Mobile carousel */}
    <div className="mt-10 sm:hidden" data-aos="fade-up">
      <Swiper
        spaceBetween={14}
        slidesPerView={1.06}
        centeredSlides={false}
        pagination={{ clickable: true }}
        className="pricing-swiper !overflow-visible !pb-11"
      >
        {PLANS.map((plan, index) => (
          <SwiperSlide key={plan.id ?? index} className="h-auto">
            <div className="h-full pb-2">
              {plan.popular && (
                <div
                  className="
                    absolute -top-3 left-1/2 z-20
                    -translate-x-1/2 whitespace-nowrap rounded-full
                    bg-[#C44E12] px-4 py-1.5
                    text-[10px] font-bold uppercase tracking-[0.14em]
                    text-white
                  "
                >
                  Most Popular
                </div>
              )}

              <PlanCard
                plan={plan}
                withWireless={withWireless}
                open={openPlan === index}
                onToggle={() =>
                  setOpenPlan((current) =>
                    current === index ? null : index
                  )
                }
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    {/* Legal offer note */}
    <div
      className="
        mx-auto mt-8 max-w-4xl rounded-2xl
        border border-neutral-200/80 bg-white/80
        px-5 py-4 shadow-[0_8px_25px_rgba(30,24,20,0.04)]
        backdrop-blur-sm sm:px-6
      "
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="
            mt-0.5 flex h-6 w-6 shrink-0 items-center
            justify-center rounded-full bg-[#FFF0E6]
            text-xs font-bold text-[#C44E12]
          "
        >
          i
        </span>

        <p className="text-[11px] leading-5 text-neutral-500 sm:text-xs sm:leading-6">
          Limited-time offer. Qualifying service and additional terms may
          apply. Equipment, taxes and fees are extra. Actual speeds vary and
          are not guaranteed.
        </p>
      </div>
    </div>

    {/* Bottom assurance */}
    <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
      {[
        "Flexible speed options",
        "Business-ready features",
        "Dedicated support",
      ].map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 sm:text-sm"
        >
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {item}
        </span>
      ))}
    </div>
  </div>
</section>

      {/* Why */}
      <section
  className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
  aria-labelledby="why-att-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.08),transparent_40%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Built for Business
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="why-att-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Why choose AT&amp;T Business Fiber?
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Get reliable fiber connectivity, powerful performance and business-ready
        support designed to keep your team moving.
      </p>
    </div>

    {/* Benefit cards */}
    <div
      className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6"
      data-aos="fade-up"
    >
      {WHY.map((benefit, index) => (
        <div
          key={benefit.id ?? index}
          className={`
            group relative h-full
            ${WHY.length % 3 === 1 && index === WHY.length - 1
              ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[570px] lg:col-span-1 lg:max-w-none"
              : ""
            }
          `}
        >
          <div
            className="
              absolute inset-x-7 -bottom-3 h-16 rounded-[1.75rem]
              bg-[#E8611A]/10 opacity-0 blur-xl
              transition-opacity duration-300 group-hover:opacity-100
            "
            aria-hidden="true"
          />

          <div
            className="
              relative h-full overflow-hidden rounded-[1.75rem]
              border border-neutral-200/80 bg-white
              shadow-[0_16px_45px_rgba(30,24,20,0.06)]
              transition-all duration-300
              hover:-translate-y-1.5 hover:border-orange-200
              hover:shadow-[0_26px_65px_rgba(30,24,20,0.11)]
            "
          >
            {/* Top accent */}
            <div
              aria-hidden="true"
              className="
                absolute inset-x-0 top-0 h-1 origin-left scale-x-0
                bg-gradient-to-r from-[#E8611A] to-[#F59A61]
                transition-transform duration-500 group-hover:scale-x-100
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute -right-16 -top-16 h-44 w-44 rounded-full
                bg-orange-100/60 blur-3xl transition-transform duration-500
                group-hover:scale-125
              "
            />

            <div className="relative flex h-full flex-col p-6 sm:p-7 lg:p-8">
              {/* Card number */}
              <div className="flex items-start justify-between gap-4">
                <span
                  className="
                    flex h-14 w-14 shrink-0 items-center justify-center
                    rounded-2xl border border-orange-100 bg-[#FFF4EC]
                    text-[#C44E12]
                    shadow-[0_10px_24px_rgba(232,97,26,0.12)]
                    transition-all duration-300
                    group-hover:-rotate-3 group-hover:scale-105
                    group-hover:bg-[#C44E12] group-hover:text-white
                  "
                  aria-hidden="true"
                >
                  {benefit.icon ? (
                    benefit.icon
                  ) : (
                    <span className="text-lg font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </span>

                <span className="text-xs font-bold tracking-[0.14em] text-neutral-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Existing card component/content */}
              <div className="mt-6 flex-1">
                <WhyCard w={benefit} />
              </div>

              <div
                aria-hidden="true"
                className="
                  mt-7 flex items-center gap-2 text-xs font-semibold
                  uppercase tracking-[0.12em] text-[#C44E12]
                  opacity-0 transition-all duration-300
                  group-hover:translate-x-1 group-hover:opacity-100
                "
              >
                Business advantage
                <span className="text-base">→</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom assurance strip */}
    <div
      className="
        mx-auto mt-10 flex max-w-4xl flex-wrap items-center
        justify-center gap-x-8 gap-y-3 rounded-2xl
        border border-neutral-200/80 bg-[#FAF8F5]
        px-5 py-4 sm:px-7
      "
    >
      {[
        "Reliable connectivity",
        "Business-grade performance",
        "Expert support",
      ].map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 sm:text-sm"
        >
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          {item}
        </span>
      ))}
    </div>
  </div>
</section>

      {/* Deals */}
      <section className="py-12 bg-[#FEF3EC]" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-5xl font-bold text-center">
            Great deals to help grow your business
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {DEALS.map((d, i) => (
              <DealCard key={i} d={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-gray-50 py-12" data-aos="zoom-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center">
            The choice is simple
          </h2>
          <p className="text-center text-gray-600 mt-2">
            See how the competition stacks up — features compared at a glance.
          </p>
          <div className="mt-6">
            <ComparisonTable />
          </div>
        </div>
      </section>

      {/* Add-ons */}
     <section
  className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="fiber-addons-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.08),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
    {/* Heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Expand Your Service
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="fiber-addons-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        AT&amp;T Business Fiber add-ons
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Enhance your business connectivity with flexible communication and
        security solutions designed to support your team.
      </p>
    </div>

    {/* Add-on cards */}
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12">
      {/* Voice card */}
      <article className="group relative overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_18px_50px_rgba(30,24,20,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(30,24,20,0.13)]">
        {/* Image */}
        <div className="relative h-56 overflow-hidden sm:h-64">
          <img
            src="https://images.unsplash.com/photo-1723737348714-ad7914b76c4c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Business voice and communication solutions"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
          />

          <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            Communication
          </span>

          <div className="absolute bottom-5 left-5 right-5">
            <h3 className="text-2xl font-bold tracking-[-0.025em] text-white">
              Voice
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex min-h-[300px] flex-col p-6 sm:p-7 lg:p-8">
          <p className="text-sm leading-7 text-neutral-600 sm:text-[15px]">
            Communicate effectively, reduce costs and improve productivity by
            combining voice, video and conferencing with easy-to-use business
            tools.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "AT&T Phone for Business",
              "AT&T Office@Hand",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-[#FAF8F5] px-4 py-3 transition-colors duration-300 group-hover:border-orange-100"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF0E6] text-xs font-bold text-[#C44E12]"
                >
                  ✓
                </span>

                <span className="text-sm font-semibold text-neutral-800">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 pt-7 text-sm font-bold text-[#C44E12] transition-colors hover:text-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/20"
          >
            Explore voice solutions
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </article>

      {/* Security card */}
      <article className="group relative overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_18px_50px_rgba(30,24,20,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(30,24,20,0.13)]">
        {/* Image */}
        <div className="relative h-56 overflow-hidden sm:h-64">
          <img
            src="https://plus.unsplash.com/premium_photo-1682145181120-73cfdfc8a36d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Business network and cybersecurity solutions"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
          />

          <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            Protection
          </span>

          <div className="absolute bottom-5 left-5 right-5">
            <h3 className="text-2xl font-bold tracking-[-0.025em] text-white">
              Security
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex min-h-[300px] flex-col p-6 sm:p-7 lg:p-8">
          <p className="text-sm leading-7 text-neutral-600 sm:text-[15px]">
            Connect confidently and protect intelligently with cybersecurity
            solutions designed to help make your business network more
            resilient.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Secure Workforce",
              "SASE with Cisco Meraki",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-[#FAF8F5] px-4 py-3 transition-colors duration-300 group-hover:border-orange-100"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF0E6] text-xs font-bold text-[#C44E12]"
                >
                  ✓
                </span>

                <span className="text-sm font-semibold text-neutral-800">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 pt-7 text-sm font-bold text-[#C44E12] transition-colors hover:text-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/20"
          >
            Explore security solutions
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </article>
    </div>

    {/* Bottom support strip */}
    <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-5 rounded-2xl border border-neutral-200/80 bg-[#FAF8F5] px-6 py-5 sm:flex-row sm:px-7">
      <div>
        <p className="text-center text-sm font-bold text-neutral-900 sm:text-left">
          Need help selecting the right add-ons?
        </p>

        <p className="mt-1 text-center text-xs leading-5 text-neutral-500 sm:text-left">
          Speak with a business specialist about your communication and
          security requirements.
        </p>
      </div>

      <a
        href="#contact"
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C44E12] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,78,18,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
      >
        Talk to a Specialist
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</section>

      {/* Coverage */}
     <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  aria-labelledby="coverage-heading"
>
  {/* Background decoration */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(232,97,26,0.10),transparent_36%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
    <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      {/* Coverage image */}
      <div
        className="relative"
        data-aos="fade-right"
        data-aos-duration="800"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-10 bottom-2 h-20 rounded-full bg-[#E8611A]/15 blur-3xl"
        />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white/85 p-5 shadow-[0_24px_70px_rgba(45,32,24,0.10)] backdrop-blur-sm sm:p-7">
          {/* Card header */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A83E0C] sm:text-xs">
                Fiber Network
              </p>

              <p className="mt-1 text-sm font-semibold text-neutral-800 sm:text-base">
                Business coverage map
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700 sm:text-xs">
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Expanding
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#FFF8F3]">
            <img
              src={attcovergae}
              alt="AT&T Business Fiber coverage map"
              className="h-[280px] w-full object-contain p-3 transition-transform duration-700 hover:scale-[1.03] sm:h-[360px] lg:h-[400px]"
              loading="lazy"
              decoding="async"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-orange-50/20 via-transparent to-white/30"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        data-aos="fade-left"
        data-aos-duration="800"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-9 bg-[#E8611A]" />

          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
            Growing Every Day
          </span>
        </div>

        <h2
          id="coverage-heading"
          className="mt-5 max-w-xl text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[3.1rem]"
        >
          Our fiber coverage is{" "}
          <span className="text-[#C44E12]">expanding.</span>
        </h2>

        <p className="mt-5 max-w-xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
          We’re bringing fiber-fast business internet to more locations every
          day. Check availability and receive an update when service reaches
          your business address.
        </p>

        {/* Benefits */}
        <div className="mt-7 space-y-3">
          {[
            "Fast, reliable business connectivity",
            "Growing fiber network availability",
            "Business support when you need it",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 sm:text-[15px]"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF0E6] text-xs font-bold text-[#C44E12]"
              >
                ✓
              </span>

              {item}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#availability"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#C44E12] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(196,78,18,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] hover:shadow-[0_16px_34px_rgba(196,78,18,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
          >
            Check Availability
            <span aria-hidden="true">→</span>
          </a>

          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-800 transition-all duration-300 hover:border-[#C44E12] hover:text-[#C44E12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/15"
          >
            Notify Me
          </a>
        </div>

        <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-neutral-500 sm:text-xs">
          <span
            aria-hidden="true"
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8611A]"
          />
          Availability varies by address and is currently limited to select
          service areas.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* FAQs */}
    <section
  className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="faq-heading"
>
  {/* Soft background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.08),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1040px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Help &amp; Support
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="faq-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Frequently asked questions
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Find helpful answers about plans, availability, installation and
        AT&amp;T Business Fiber services.
      </p>
    </div>

    {/* FAQ container */}
    <div className="relative mt-10 lg:mt-12">
      <div
        aria-hidden="true"
        className="absolute inset-x-12 -bottom-5 h-24 rounded-[2rem] bg-[#E8611A]/10 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white p-3 shadow-[0_22px_65px_rgba(30,24,20,0.08)] sm:p-5 lg:p-6">
        <FAQ />
      </div>
    </div>

    {/* Bottom support card */}
    <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-neutral-200/80 bg-[#FAF8F5] px-6 py-5 sm:flex-row sm:px-7">
      <div>
        <p className="text-center text-sm font-bold text-neutral-900 sm:text-left">
          Still have questions?
        </p>

        <p className="mt-1 text-center text-xs leading-5 text-neutral-500 sm:text-left">
          Speak with a business specialist for personalized assistance.
        </p>
      </div>

      <a
        href="#contact"
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C44E12] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,78,18,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
      >
        Contact a Specialist
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</section>
    </div>
  );
}
