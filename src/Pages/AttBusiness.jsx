import React, { useState } from "react";
import {
  FaCheckCircle,
  FaChevronRight,
  FaChevronDown,
  FaRegCheckCircle,
  FaCheck,
  FaSearch,
} from "react-icons/fa";
import { MdSpeed } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import attcovergae from "../assets/attcovergae.png";
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
          value ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        With wireless plan
      </button>
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 text-sm rounded-full transition ${
          !value ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100"
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
        <span className="self-start mb-2 text-xs font-semibold text-white bg-red-600 px-2.5 py-1 rounded-full">
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
        className="mt-4 w-full px-4 py-3 rounded-full bg-red-700 text-white font-semibold hover:bg-red-800"
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
    <article className="rounded-2xl overflow-hidden bg-[#F5FAFF] border border-gray-200 shadow-sm">
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
    <div className="rounded-xl flex flex-col items-center p-6 text-center bg-white border">
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
      value: <FaCheck className="text-[#8C1D1D] text-base md:text-lg mx-auto" />,
    },
    {
      label: "Upload as fast as downloads",
      value: <FaCheck className="text-[#8C1D1D] text-base md:text-lg mx-auto" />,
    },
    {
      label: "No annual contract",
      value: <FaCheck className="text-[#8C1D1D] text-base md:text-lg mx-auto" />,
    },
    {
      label: "No additional equipment fees for Wi-Fi service",
      value: <FaCheck className="text-[#8C1D1D] text-base md:text-lg mx-auto" />,
    },
    {
      label: "No data caps",
      value: <FaCheck className="text-[#8C1D1D] text-base md:text-lg mx-auto" />,
    },
    {
      label: "Free installation",
      value: (
        <div className="flex flex-col items-center justify-center text-center">
          <FaCheck className="text-[#8C1D1D] text-base md:text-lg mx-auto" />
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
            <th className="w-[40%] md:w-[30%] p-0 bg-[#FCF8F8] align-bottom">
              <div className="bg-[#8C1D1D] text-white text-center py-4 font-bold text-xs md:text-sm lg:text-base rounded-t-xl shadow-sm tracking-wide">
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
              <td className="px-4 md:px-6 py-4 text-center align-middle bg-[#FCF8F8]">
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
      {/* Top hero dual cards */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[2fr_1fr] gap-6">
          {/* LEFT CARD */}
          <article className="relative rounded-3xl overflow-hidden shadow-sm bg-white min-h-[460px] md:min-h-[550px]">
            <img
              src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=2000&auto=format&fit=crop"
              alt="Team collaborating"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {/* overlay (fixed typo: via-*) */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-transparent" />
            <div className="relative z-10 h-full p-6 md:p-10 flex">
              <div className="max-w-2xl text-gray-900 flex flex-col justify-between">
                <div>
                  <p className="text-lg md:text-xl opacity-90">
                    Fast. Reliable. Secure.
                  </p>
                  <h2 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight">
                    Get AT&amp;T Business Fiber
                    <br />
                    starting at $40/mo.
                  </h2>
                  <p className="mt-3 text-gray-900 text-base md:text-2xl">
                    When you bundle with a business wireless plan.
                  </p>

                  <p className="mt-4 text-[16px] leading-5 text-gray-700">
                    Price plus taxes and fees for AT&amp;T Business Fiber 300
                    after $30/mo. discount with eligible wireless svc (min
                    $70/mo). Ltd availability/areas.
                  </p>

                  <a
                    href={telHref}
                    className="mt-4 inline-flex items-center gap-2 text-red-700 font-semibold"
                  >
                    Call {PHONE} <FaChevronRight className="opacity-90" />
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* RIGHT CARD */}
          <article className="relative rounded-3xl overflow-hidden shadow-sm bg-white p-6 md:p-8 min-h-[460px] md:min-h-[550px]">
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,248,252,0.92)), repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0 16px, transparent 16px 32px)",
              }}
            />
            <div className="relative z-10">
              <p className="text-lg md:text-xl text-gray-700">
                AT&amp;T Business Fiber®
              </p>
              <h2 className="mt-1 text-2xl md:text-5xl font-extrabold text-gray-900">
                Get up to two months free*
              </h2>
              <p className="mt-3 text-gray-700 md:text-xl">
                Plus, we’ll cover your early termination fee up to $750 when
                switching from another provider.
              </p>
              <p className="mt-4 text-[16px] leading-5 text-gray-600">
                *1 month with 500M; 2 months with 1 GIG+. Fees extra. Up to $750
                via reward card. Redemption &amp; proof of eligibility required.
                Ltd availability/areas.
              </p>
            </div>

            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop"
              alt="Customer on tablet"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white to-white/55" />
          </article>
        </div>
      </section>

      {/* ZIP checker */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-center">
            <p className="text-gray-700 font-medium text-2xl md:text-3xl text-center">
              Check availability by ZIP code
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 mb-6 w-full sm:max-w-xl md:max-w-2xl rounded-lg border border-gray-200 bg-white shadow-sm focus-within:ring-1 focus-within:ring-slate-600"
              role="search"
              aria-label="Check availability"
            >
              <label htmlFor="zipcode" className="sr-only">
                Enter ZIP code
              </label>
              <div className="flex items-stretch">
                <span
                  className="pl-4 pr-4 flex items-center text-gray-700 bg-white"
                  aria-hidden="true"
                >
                  <FaSearch className="h-5 w-5" />
                </span>

                <input
                  id="zipcode"
                  inputMode="numeric"
                  pattern="\d{5}"
                  maxLength={5}
                  value={zipcode}
                  onChange={onZipChange}
                  placeholder="Enter ZIP code"
                  className="w-full py-3 pr-3 pl-3 text-lg md:text-xl bg-white outline-none text-gray-900 placeholder:text-gray-400"
                  aria-describedby={error ? "zipcode-error" : undefined}
                  aria-invalid={!!error}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-5 bg-slate-600 text-white font-semibold hover:bg-slate-700 disabled:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                  aria-label="Search by ZIP code"
                >
                  {loading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <FaSearch className="h-5 w-5" />
                  )}
                </button>
              </div>
              {error && (
                <p
                  id="zipcode-error"
                  className="px-4 pb-3 text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </form>

            {results && (
              <div
                className="flex items-center justify-center flex-col py-6 text-green-600"
                aria-live="polite"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold text-xl md:text-2xl text-center">
                  AT&amp;T Business is available in {results.zipcode}
                </span>
                <button
                  onClick={handleBook}
                  className="mt-6 px-6 py-3 border border-slate-600 text-slate-600 hover:text-white font-semibold rounded-full hover:bg-slate-700 transition duration-300"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-5xl font-bold text-center">
            Get fast speeds and low pricing
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Pick from 300Mbps to 5Gbps with all-inclusive business features
            (Wi-Fi, static IP add-ons, and more).
          </p>

          <div className="mt-6 flex items-center justify-center">
            <WirelessToggle value={withWireless} onChange={setWithWireless} />
          </div>

          {/* Desktop grid */}
          <div className="hidden sm:grid mt-6 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PLANS.map((p, i) => (
              <PlanCard
                key={i}
                plan={p}
                withWireless={withWireless}
                open={openAll}
                onToggle={() => setOpenAll((v) => !v)} // clicking any card toggles ALL
              />
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden mt-6">
            <Swiper spaceBetween={16} slidesPerView={1.1} loop>
              {PLANS.map((p, i) => (
                <SwiperSlide key={i}>
                  <PlanCard
                    plan={p}
                    withWireless={withWireless}
                    open={openAll}
                    onToggle={() => setOpenAll((v) => !v)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <p className="mt-4 text-[11px] text-gray-500 text-center">
            *Limited-time offer. Qualifying service and terms required.
            Equipment, taxes &amp; fees extra. Actual speeds vary and are not
            guaranteed.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-5xl font-bold text-center text-gray-800">
            Why AT&amp;T Business Fiber?
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((w, i) => (
              <WhyCard key={i} w={w} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="py-12 bg-red-50">
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
      <section className="bg-gray-50 py-12">
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
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center">
            AT&amp;T Business Fiber add-ons
          </h2>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1600&auto=format&fit=crop"
                alt="Voice"
                className="h-56 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="p-6">
                <h3 className="font-extrabold text-lg">Voice</h3>
                <p className="mt-2 text-gray-700 text-sm">
                  Communicate effectively, reduce costs, and improve
                  productivity by combining voice, video, and conferencing with
                  easy-to-use tools.
                </p>
                <ul className="mt-3 space-y-1 text-sm font-semibold text-red-700">
                  <li>
                    <span className="hover:underline cursor-default">
                      AT&amp;T Phone for Business
                    </span>
                  </li>
                  <li>
                    <span className="hover:underline cursor-default">
                      AT&amp;T Office@Hand
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop"
                alt="Security"
                className="h-56 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="p-6">
                <h3 className="font-extrabold text-lg">Security</h3>
                <p className="mt-2 text-gray-700 text-sm">
                  Confidently connect. Intelligently protect. AT&amp;T
                  Cybersecurity helps make your network more resilient.
                </p>
                <ul className="mt-3 space-y-1 text-sm font-semibold text-red-700">
                  <li>
                    <span className="hover:underline cursor-default">
                      Secure Workforce
                    </span>
                  </li>
                  <li>
                    <span className="hover:underline cursor-default">
                      SASE with Cisco Meraki
                    </span>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <img
            src={attcovergae}
            alt="AT&T Business Fiber coverage map"
            className="w-full h-[320px] md:h-[450px] object-contain"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h3 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Our fiber coverage is
              <br className="hidden sm:block" />
              expanding
            </h3>
            <p className="mt-4 text-gray-700 max-w-xl">
              We’re bringing fiber-fast business internet to more locations
              every day. Sign up to be notified when it’s available at your
              address.
            </p>
            <p className="mt-3 text-[12px] text-gray-500">
              Limited availability in select areas.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Frequently asked questions
          </h2>
          <div className="mt-4">
            <FAQ />
          </div>
        </div>
      </section>
    </div>
  );
}
