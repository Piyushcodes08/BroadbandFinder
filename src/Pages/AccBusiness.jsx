// src/pages/AccBusiness.jsx
import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

// Icons
import { HiOutlineLightningBolt } from "react-icons/hi";
import { MdSpeed } from "react-icons/md";
import {
  FaPhoneAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const PHONE = "855.325.6063";

/* ---------- Content ---------- */

const PLANS = [
  {
    tier: "Business Fiber 300",
    was: 110,
    price: 80,
    upload: "300 Mbps",
    download: "300 Mbps",
    desc: "Great starter speed for office suites, video calls, and cloud apps.",
    promoBadge: "Get 1 month free",
    features: [
      "Symmetrical 300 Mbps speeds",
      "Gateway included",
      "Professional install",
    ],
  },
  {
    tier: "Business Fiber 500",
    was: 140,
    price: 100,
    upload: "500 Mbps",
    download: "500 Mbps",
    desc: "More bandwidth for POS systems, backups, & busy teams.",
    features: [
      "Symmetrical 500 Mbps speeds",
      "Gateway included",
      "Professional install",
    ],
  },
  {
    tier: "Business Fiber 1 Gig",
    was: 170,
    price: 130,
    upload: "1 Gbps",
    download: "1 Gbps",
    desc: "Gigabit performance for collaboration & heavy cloud workloads.",
    promoBadge: "Get 2 months free",
    features: [
      "Symmetrical 1 Gbps speeds",
      "Built-in 5G internet backup",
      "Professional install",
    ],
  },
  {
    tier: "Business Fiber 2 Gig",
    was: 195,
    price: 155,
    upload: "2 Gbps",
    download: "2 Gbps",
    desc: "Hyper-Gig for media teams, file transfers & multi-site sync.",
    promoBadge: "Get 2 months free",
    features: [
      "Symmetrical 2 Gbps speeds",
      "Built-in 5G internet backup",
      "Professional install",
    ],
  },
  {
    tier: "Business Fiber 5 Gig",
    was: 285,
    price: 255,
    upload: "5 Gbps",
    download: "5 Gbps",
    desc: "Max performance for the most demanding environments.",
    promoBadge: "Get 2 months free",
    features: [
      "Symmetrical 5 Gbps speeds",
      "Built-in 5G internet backup",
      "Professional install",
    ],
  },
];

const WHY = [
  {
    icon: <HiOutlineLightningBolt className="text-blue-700 text-5xl" />,
    title: "Simple & straightforward",
    copy: "Transparent pricing, no surprises, and an easy setup for small businesses.",
  },
  {
    icon: <MdSpeed className="text-blue-700 text-5xl" />,
    title: "Power your business",
    copy: "Symmetrical speeds built for video calls, cloud apps and backups.",
  },
  {
    icon: <FaCheckCircle className="text-blue-700 text-5xl" />,
    title: "The ACC guarantee",
    copy: "Backed by a trusted network with dedicated support when you need it.",
  },
];

const FAQS = [
  {
    q: "Is ACC Business internet available in my area?",
    a: "Use the ZIP lookup below. If eligible, you’ll see a confirmation and can book instantly.",
  },
  {
    q: "How much does ACC Business internet cost?",
    a: "Pricing varies by location and plan. The ZIP check will show the best offers for your address.",
  },
  {
    q: "Are there data caps?",
    a: "Plans are designed for business use with generous or unlimited data. Terms vary by plan.",
  },
  {
    q: "Do I need to sign a contract?",
    a: "Contract terms vary by promotion and service type. We’ll show all details with your offer.",
  },
];

/* ---------- UI Helpers ---------- */

function PillToggle({ value, onChange, onLabel, offLabel }) {
  return (
    <div className="inline-flex rounded-full border border-gray-300 p-1 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 text-sm rounded-full transition ${
          value ? "bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {onLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 text-sm rounded-full transition ${
          !value ? "bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {offLabel}
      </button>
    </div>
  );
}

function PlanCard({ plan, currentPrice, open, onToggle, priceNote }) {
  const panelId = `${plan.tier.replace(/\s+/g, "-").toLowerCase()}-features`;
    const navigate = useNavigate();
      const handleBook = () => {
      navigate("/customerbookingfrom", { state: { name: "ACC Business" } });
    };

  return (
    <div
      className="flex flex-col md:w-52 w-full rounded-2xl bg-white/80 p-5 shadow-sm hover:shadow-md transition border border-gray-200 h-full cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
    >
      {/* badge / spacer to keep heights even */}
      <div className="h-6">
        {plan.promoBadge && (
          <span className="inline-block text-[11px] font-semibold text-white bg-teal-600/90 px-2.5 py-1 rounded-full">
            {plan.promoBadge}
          </span>
        )}
      </div>

      <h3 className="mt-2 text-xl font-bold text-gray-900">{plan.tier}</h3>
      <p className="mt-1 text-gray-600 text-sm min-h-[80px]">{plan.desc}</p>

      <div className="mt-5">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold text-gray-900">
            ${currentPrice}
          </span>
          <span className="text-gray-600">/mo</span>
        </div>
        <p className="text-[12px] text-gray-500">{priceNote}</p>
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 text-md rounded-full"
          onClick={handleBook}
        >
          Book Now
        </button>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-900"
      >
        <span>See plan features</span>
        <FaChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div id={panelId} className={`${open ? "block" : "hidden"}`}>
        <ul className="mt-3 space-y-2 text-sm text-gray-800">
          {plan.features?.map((f, i) => (
            <li key={i} className="flex gap-2">
              <FaCheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function AccBusiness() {
  const [withWireless, setWithWireless] = useState(false);
  // Single boolean: clicking any card toggles ALL cards open/closed
  const [openAll, setOpenAll] = useState(false);

  // ZIP lookup
  const [zip, setZip] = useState("");
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // mobile carousel paging (2 cards per page on ≥640px, 1 on <640px)
  const smTwoUp =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 640px)").matches;
  const pageSize = smTwoUp ? 2 : 1;
  const [page, setPage] = useState(0);
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(PLANS.length / pageSize)),
    [pageSize]
  );
  const pagedPlans = useMemo(
    () => PLANS.slice(page * pageSize, page * pageSize + pageSize),
    [page, pageSize]
  );

  const isZipValid = /^\d{5}$/.test(zip);

  const onZipChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZip(onlyDigits);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isZipValid) {
      setError("Please enter a valid 5-digit ZIP code.");
      setAvailability(null);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAvailability({ ok: true, zip });
    }, 500);
  };

  const handleBook = () =>
    navigate("/customerbookingfrom", { state: { name: "ACC Business" } });

  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>ACC Business Internet — Plans, Pricing & Availability</title>
        <meta
          name="description"
          content="Compare ACC Business internet plans, prices and availability. Check by ZIP code for high-speed business internet, bundling options and promos."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative isolate min-h-[420px] sm:min-h-[520px] lg:min-h-[560px]">
        <img
          alt="Small business counter"
          className="absolute inset-0 h-full w-full object-cover"
          src="https://www.shutterstock.com/image-photo/business-financing-accounting-banking-concept-600nw-2441922909.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/30" />
        <div className="relative max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="w-full md:w-[700px] flex flex-col gap-4">
            <p className="text-xs tracking-widest font-semibold text-gray-600">
              ACC BUSINESS®
            </p>
            <h1 className="mt-1 text-4xl md:text-5xl font-extrabold leading-tight">
              Fast, reliable internet built for business
            </h1>
            <p className="mt-3 text-gray-700 max-w-2xl">
              Check availability by ZIP code and see the best offers for your
              address. No surprises — just business-grade connectivity.
            </p>
            <div className="mt-4">
              <a
                href={`tel:${PHONE.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <FaPhoneAlt /> Call {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ZIP LOOKUP */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl flex flex-col items-center px-4">
          <div className="pt-10">
            <p className="mt-3 text-gray-700 font-semibold text-2xl sm:text-3xl">
              Check availability by ZIP code
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 mb-4 w-full sm:w-3/4 md:w-1/2 max-w-xl rounded-lg border border-gray-200 bg-white shadow-sm focus-within:ring-1 focus-within:ring-slate-600"
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
                pattern="^\\d{5}$"
                autoComplete="postal-code"
                maxLength={5}
                value={zip}
                onChange={onZipChange}
                placeholder="Enter ZIP code"
                className="w-full py-3 pr-3 pl-3 text-lg bg-white outline-none text-gray-900 placeholder:text-gray-400"
                aria-invalid={!!error}
                aria-describedby={error ? "zip-error" : undefined}
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-5 bg-blue-700 text-white font-semibold hover:bg-blue-800 disabled:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                aria-label="Search by ZIP code"
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <FaSearch className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>

          {error && (
            <p id="zip-error" className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div role="status" aria-live="polite" className="mb-12">
            {availability && (
              <div className="flex items-center text-green-600 justify-center flex-col py-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                <span className="font-semibold text-xl sm:text-2xl">
                  ACC Business is available in {availability.zip}
                </span>

                <span className="mt-6">
                  <button
                    onClick={handleBook}
                    className="px-6 py-3 border border-blue-700 text-blue-700 hover:text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    Book Now
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PLANS */}
     <section className="pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Get fast speeds and low pricing
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Pick from 300 Mbps to 5 Gbps with business-grade features.
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <PillToggle
            value={withWireless}
            onChange={setWithWireless}
            onLabel="With wireless plan"
            offLabel="Without wireless plan"
          />
          <button
            type="button"
            onClick={() => setOpenAll((v) => !v)}
            className="rounded-full border px-4 py-1.5 text-sm font-semibold hover:bg-gray-50"
          >
            {openAll ? "Collapse all features" : "Expand all features"}
          </button>
        </div>

        {/* Desktop grid */}
        <div className="mt-6 hidden md:flex flex-wrap gap-10">
          {PLANS.map((p) => (
            <PlanCard
              key={p.tier}
              plan={p}
              currentPrice={withWireless ? p.price : p.was}
              priceNote={
                withWireless
                  ? "Price with eligible wireless bundle. Taxes & fees extra."
                  : "Standalone price. Taxes & fees extra."
              }
              open={openAll}
              onToggle={() => setOpenAll((v) => !v)} // toggle ALL
            />
          ))}
        </div>

        {/* Mobile Swiper carousel */}
        <div className="mt-6 md:hidden">
          <Swiper
            spaceBetween={16}
            slidesPerView={1.1}
            centeredSlides={true}
            loop
            navigation={{
              prevEl: ".plan-prev",
              nextEl: ".plan-next",
            }}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
          >
            {PLANS.map((p) => (
              <SwiperSlide key={p.tier}>
                <PlanCard
                  plan={p}
                  currentPrice={withWireless ? p.price : p.was}
                  priceNote={
                    withWireless
                      ? "Bundled price. Taxes & fees extra."
                      : "Standalone price. Taxes & fees extra."
                  }
                  open={openAll}
                  onToggle={() => setOpenAll((v) => !v)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              className="plan-prev p-2 rounded-full border hover:bg-gray-50"
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <button
              className="plan-next p-2 rounded-full border hover:bg-gray-50"
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-gray-500 text-center">
          *Limited-time offers. Equipment, taxes & fees extra. Actual speeds
          vary and are not guaranteed.
        </p>
      </div>
    </section>

      {/* WHY */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Why ACC Business?
          </h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl bg-white border p-6 text-center"
            >
              <div className="grid place-items-center">{w.icon}</div>
              <h3 className="mt-3 font-bold text-lg">{w.title}</h3>
              <p className="text-gray-600 mt-1">{w.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center">
            The choice is simple
          </h2>

          <div className="mt-6 rounded-2xl border bg-white overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="py-4 px-4 text-left font-semibold bg-white"></th>
                  <th className="py-4 px-4 font-semibold bg-blue-700 text-white">
                    ACC Business Fiber®
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Fastest broadband tier", "Up to 5 GIG (limited areas)"],
                  ["100% symmetrical fiber", true],
                  ["Upload as fast as download", true],
                  ["No annual contract options", true],
                  ["Gateway equipment included", true],
                  ["No data caps", true],
                  ["Free installation (online orders)", true],
                ].map(([label, val]) => (
                  <tr key={label} className="odd:bg-white even:bg-gray-50/60">
                    <td className="py-3 px-4">{label}</td>
                    <td className="py-3 px-4 text-center">
                      {val === true ? (
                        <FaCheckCircle className="mx-auto text-blue-700" />
                      ) : (
                        <span className="font-semibold">{val}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="px-4 py-3 text-[11px] text-gray-500">
              Based on publicly available information; availability varies by
              location.
            </p>
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center">
            Add-ons that grow with you
          </h2>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <article className="rounded-2xl overflow-hidden bg-white border shadow-sm">
              <img
                alt="Voice services"
                className="h-56 w-full object-cover"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwl6S6V2cZUsmN18mvFctpU-OjdBfBz8miA&s"
              />
              <div className="p-6">
                <h3 className="font-extrabold text-lg">Voice</h3>
                <p className="mt-2 text-gray-700 text-sm">
                  Add business voice with auto-attendant, call routing, and
                  number porting. Keep your brand consistent across locations.
                </p>
              </div>
            </article>

            <article className="rounded-2xl overflow-hidden bg-white border shadow-sm">
              <img
                alt="Security services"
                className="h-56 w-full object-cover"
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop"
              />
              <div className="p-6">
                <h3 className="font-extrabold text-lg">Security</h3>
                <p className="mt-2 text-gray-700 text-sm">
                  Protect devices with gateway-level protections and optional
                  site security add-ons for smarter prevention & response.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div className="rounded-2xl border bg-white overflow-hidden">
            <img
              alt="Coverage map"
              className="w-full h-72 object-cover"
              src="https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1600&auto=format&fit=crop"
            />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">
              Our fiber coverage is expanding
            </h3>
            <p className="text-gray-600 mt-2">
              We’re bringing fiber-fast business internet to more locations
              nationwide. Search your address to see if it’s available for your
              business.
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-4 px-4 py-2 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-800"
            >
              Check availability
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            Frequently asked questions
          </h2>
          <div className="divide-y rounded-2xl border bg-white">
            {FAQS.map((f) => (
              <details key={f.q} className="group open:bg-gray-50">
                <summary className="cursor-pointer list-none px-4 py-4 flex items-center justify-between font-semibold">
                  {f.q}
                  <FaChevronDown className="transition group-open:rotate-180" />
                </summary>
                <p className="px-4 pb-4 text-gray-700 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
