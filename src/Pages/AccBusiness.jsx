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
import AccBusinessHeroBg from "../assets/AccBusiness-herobg.png";
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
      data-aos="fade-up"
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
          className="bg-[#E8611A] hover:bg-[#F47630] text-white px-6 py-2 text-md rounded-full"
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
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#f5f2eb]">
        {/* Background image */}
        <img
          src={AccBusinessHeroBg}
          alt="ACC Business internet solutions"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center"
        />

        {/* Responsive image overlays */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#F8F6F1] via-[#F8F6F1]/95 to-[#F8F6F1]/45
            sm:via-[#F8F6F1]/40 sm:to-transparent
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
                ACC Business®
              </p>
            </div>

            {/* Main heading */}
            <h1 className="max-w-[680px] text-[clamp(2.8rem,6vw,3.7rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#171717]">
              Fast, reliable internet
              <span className="mt-2 block tracking-[-0.04em] text-orange-700">
                Built for Business.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[620px] text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8 lg:text-xl">
              Check availability by ZIP code and see the best offers for your
              address. No surprises — just business-grade connectivity.
            </p>

            {/* Feature */}
            <div className="mt-7 flex max-w-[590px] items-start gap-4 border-l-2 border-orange-600 pl-5">
              <div>
                <p className="font-semibold text-neutral-900">
                  Dedicated Customer Support
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600 sm:text-base">
                  Expert assistance and reliable network speeds to keep your business running smoothly.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={`tel:${PHONE.replace(/\D/g, "")}`}
                aria-label={`Call ACC Business at ${PHONE}`}
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

      {/* ZIP LOOKUP */}
      <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20"
  data-aos="fade-up"
  aria-labelledby="availability-heading"
>
  {/* Background decoration */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.10),transparent_46%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-orange-100/60 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl"
  />

  <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
    <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_24px_70px_rgba(45,32,24,0.10)]">
      {/* Top accent */}
      <div
        aria-hidden="true"
        className="h-1.5 w-full bg-gradient-to-r from-[#C44E12] via-[#E8611A] to-[#FF9A5C]"
      />

      <div className="px-5 py-9 sm:px-10 sm:py-12 lg:px-14">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#E8611A]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
              Check Service Availability
            </span>

            <span className="h-px w-8 bg-[#E8611A]" />
          </div>

          <h2
            id="availability-heading"
            className="text-3xl font-bold leading-tight tracking-[-0.04em] text-neutral-900 sm:text-4xl"
          >
            Find ACC Business services{" "}
            <span className="text-[#C44E12]">near you</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
            Enter your five-digit ZIP code to check service availability for
            your business location.
          </p>
        </div>

        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          role="search"
          aria-label="Check ACC Business availability"
          className="mx-auto mt-8 max-w-2xl"
        >
          <label
            htmlFor="zipcode"
            className="mb-2.5 block text-sm font-semibold text-neutral-800"
          >
            Business ZIP code
          </label>

          <div
            className={`
              flex overflow-hidden rounded-2xl border bg-white p-1.5
              shadow-[0_10px_32px_rgba(45,32,24,0.08)]
              transition-all duration-300 focus-within:ring-4
              ${
                error
                  ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
                  : "border-neutral-200 focus-within:border-[#E8611A] focus-within:ring-[#E8611A]/10"
              }
            `}
          >
            <span
              aria-hidden="true"
              className="flex w-12 shrink-0 items-center justify-center text-neutral-400 sm:w-14"
            >
              <FaSearch className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>

            <input
              id="zipcode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{5}"
              autoComplete="postal-code"
              maxLength={5}
              value={zip}
              onChange={onZipChange}
              placeholder="Enter 5-digit ZIP code"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "zip-error" : "zip-help"}
              className="min-w-0 flex-1 bg-transparent py-3 pr-3 text-base font-medium text-neutral-900 outline-none placeholder:font-normal placeholder:text-neutral-400 sm:text-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex min-h-12 shrink-0 items-center justify-center
                gap-2 rounded-xl bg-[#C44E12] px-4 text-sm font-semibold
                text-white shadow-[0_8px_20px_rgba(196,78,18,0.22)]
                transition-all duration-300
                hover:bg-[#A83E0C]
                disabled:cursor-not-allowed disabled:bg-[#C44E12]/60
                focus-visible:outline-none focus-visible:ring-4
                focus-visible:ring-[#E8611A]/25
                sm:px-6
              "
              aria-label="Check service availability"
            >
              {loading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                  <span className="hidden sm:inline">Checking...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Check Availability</span>
                  <FaSearch className="h-4 w-4 sm:hidden" />
                  <span
                    aria-hidden="true"
                    className="hidden text-lg leading-none sm:inline"
                  >
                    →
                  </span>
                </>
              )}
            </button>
          </div>

          {!error && (
            <p
              id="zip-help"
              className="mt-2.5 text-xs leading-5 text-neutral-500"
            >
              Enter a valid five-digit US ZIP code.
            </p>
          )}

          {error && (
            <p
              id="zip-error"
              role="alert"
              className="mt-2.5 flex items-center gap-2 text-sm font-medium text-red-600"
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-xs"
              >
                !
              </span>
              {error}
            </p>
          )}
        </form>

        {/* Availability result */}
        <div role="status" aria-live="polite" aria-atomic="true">
          {availability && (
            <div
              className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/70"
              data-aos="zoom-in"
            >
              <div className="flex flex-col items-center px-5 py-7 text-center sm:px-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_8px_22px_rgba(5,150,105,0.24)]">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                  Service Available
                </p>

                <h3 className="mt-2 text-xl font-bold text-neutral-900 sm:text-2xl">
                  ACC Business is available in {availability.zip}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
                  Continue to explore available business services and select the
                  right solution for your location.
                </p>

                <button
                  type="button"
                  onClick={handleBook}
                  className="group mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#C44E12] px-7 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(196,78,18,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
                >
                  Book Now

                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trust points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-neutral-100 pt-6">
          {[
            "Quick availability check",
            "No obligation",
            "Business specialist support",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 sm:text-sm"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-emerald-500"
              />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* PLANS */}
    <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="plans-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.10),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Business Internet Plans
        </span>

        <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="plans-heading"
        className="text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.9rem]"
      >
        Fast speeds. Flexible plans.{" "}
        <span className="text-[#C44E12]">Competitive pricing.</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
        Choose speeds from 300 Mbps to 5 Gbps, with reliable connectivity
        and business-grade features built around your needs.
      </p>
    </div>

    {/* Plan controls */}
    <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/90 p-3 shadow-[0_12px_35px_rgba(45,32,24,0.06)] backdrop-blur-sm sm:flex-row sm:rounded-full">
      <PillToggle
        value={withWireless}
        onChange={setWithWireless}
        onLabel="With wireless plan"
        offLabel="Without wireless plan"
      />

      <span
        aria-hidden="true"
        className="hidden h-6 w-px bg-neutral-200 sm:block"
      />

      <button
        type="button"
        onClick={() => setOpenAll((value) => !value)}
        aria-expanded={openAll}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-neutral-700 transition-colors duration-300 hover:bg-[#FFF0E6] hover:text-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/20"
      >
        {openAll ? "Collapse all features" : "Expand all features"}

        <span
          aria-hidden="true"
          className={`text-[#C44E12] transition-transform duration-300 ${
            openAll ? "rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>
    </div>

    {/* Desktop plan grid */}
    <div className="mt-10 hidden grid-cols-2 items-stretch gap-6 md:grid xl:grid-cols-3">
      {PLANS.map((plan, index) => (
        <div
          key={plan.tier}
          className="group relative flex h-full"
          data-aos="fade-up"
          data-aos-delay={Math.min(index * 100, 300)}
          data-aos-duration="750"
          data-aos-once="true"
        >
          {/* Recommended label */}
          {index === 1 && (
            <div className="absolute inset-x-5 -top-3 z-20 flex justify-center">
              <span className="rounded-full bg-[#C44E12] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_8px_20px_rgba(196,78,18,0.28)]">
                Most Popular
              </span>
            </div>
          )}

          <div
            className={`
              flex w-full overflow-hidden rounded-[1.75rem]
              border bg-white
              shadow-[0_18px_50px_rgba(45,32,24,0.07)]
              transition-all duration-500
              group-hover:-translate-y-1.5
              group-hover:shadow-[0_28px_65px_rgba(196,78,18,0.13)]
              ${
                index === 1
                  ? "border-[#E8611A]/40 ring-4 ring-[#E8611A]/5"
                  : "border-neutral-200/80 group-hover:border-orange-200"
              }
            `}
          >
            <PlanCard
              plan={plan}
              currentPrice={withWireless ? plan.price : plan.was}
              priceNote={
                withWireless
                  ? "Price with an eligible wireless bundle. Taxes and fees are additional."
                  : "Standalone price. Taxes and fees are additional."
              }
              open={openAll}
              onToggle={() => setOpenAll((value) => !value)}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Mobile carousel */}
    <div className="mt-9 md:hidden">
      <Swiper
        spaceBetween={16}
        slidesPerView={1.05}
        centeredSlides
        loop={PLANS.length > 1}
        navigation={{
          prevEl: ".plan-prev",
          nextEl: ".plan-next",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Navigation, Pagination]}
        className="!overflow-visible !pb-12"
      >
        {PLANS.map((plan, index) => (
          <SwiperSlide key={plan.tier} className="h-auto">
            <div
              className={`
                relative h-full overflow-hidden rounded-[1.5rem]
                border bg-white
                shadow-[0_16px_42px_rgba(45,32,24,0.09)]
                ${
                  index === 1
                    ? "border-[#E8611A]/40"
                    : "border-neutral-200"
                }
              `}
            >
              {index === 1 && (
                <div className="absolute right-4 top-4 z-20">
                  <span className="rounded-full bg-[#C44E12] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <PlanCard
                plan={plan}
                currentPrice={withWireless ? plan.price : plan.was}
                priceNote={
                  withWireless
                    ? "Bundled price. Taxes and fees are additional."
                    : "Standalone price. Taxes and fees are additional."
                }
                open={openAll}
                onToggle={() => setOpenAll((value) => !value)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Mobile navigation */}
      <div className="mt-1 flex items-center justify-center gap-3">
        <button
          type="button"
          className="plan-prev inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-[#FFF0E6] hover:text-[#C44E12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/20"
          aria-label="Previous plan"
        >
          <FaChevronLeft className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          className="plan-next inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C44E12] text-white shadow-[0_10px_24px_rgba(196,78,18,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
          aria-label="Next plan"
        >
          <FaChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    {/* Pricing disclaimer */}
    <div className="mx-auto mt-8 max-w-4xl border-t border-neutral-200/80 pt-6 text-center">
      <p className="text-[11px] leading-5 text-neutral-500 sm:text-xs">
        *Limited-time offers may apply. Equipment, taxes and additional fees
        are not included. Actual speeds vary by location, network conditions
        and selected service, and are not guaranteed.
      </p>
    </div>
  </div>
</section>

      {/* WHY */}
     <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  aria-labelledby="why-acc-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.09),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-32 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div
      className="mx-auto max-w-3xl text-center"
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-once="true"
    >
      <div className="mb-4 flex items-center justify-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-8 bg-[#E8611A]"
        />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          The ACC Business Advantage
        </span>

        <span
          aria-hidden="true"
          className="h-px w-8 bg-[#E8611A]"
        />
      </div>

      <h2
        id="why-acc-heading"
        className="text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.9rem]"
      >
        Why choose{" "}
        <span className="text-[#C44E12]">ACC Business?</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
        Dependable connectivity, business-focused solutions and expert support
        designed to help your organization operate with confidence.
      </p>
    </div>

    {/* Benefits grid */}
    <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-7">
      {WHY.map((item, index) => (
        <article
          key={item.title}
          className="
            group relative flex min-h-[280px] overflow-hidden
            rounded-[1.75rem] border border-neutral-200/80 bg-white
            px-6 py-8
            shadow-[0_16px_45px_rgba(45,32,24,0.06)]
            transition-all duration-500
            hover:-translate-y-2 hover:border-orange-200
            hover:shadow-[0_28px_65px_rgba(196,78,18,0.13)]
            sm:px-7 sm:py-9 lg:min-h-[310px] lg:px-8 lg:py-10
          "
          data-aos="fade-up"
          data-aos-delay={Math.min(index * 100, 300)}
          data-aos-duration="750"
          data-aos-once="true"
        >
          {/* Hover glow */}
          <div
            aria-hidden="true"
            className="
              absolute -right-20 -top-20 h-52 w-52 rounded-full
              bg-orange-100/0 blur-3xl transition-colors duration-500
              group-hover:bg-orange-100/70
            "
          />

          {/* Top accent line */}
          <span
            aria-hidden="true"
            className="
              absolute left-8 top-0 h-1 w-12 rounded-b-full
              bg-[#E8611A] transition-all duration-500
              group-hover:w-24
            "
          />

          {/* Card number */}
          <span
            aria-hidden="true"
            className="
              absolute right-7 top-7 text-5xl font-bold leading-none
              text-neutral-100 transition-colors duration-500
              group-hover:text-orange-50
            "
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="relative flex h-full w-full flex-col items-start">
            {/* Icon */}
            <div
              className="
                flex h-16 w-16 items-center justify-center rounded-2xl
                border border-orange-100 bg-[#FFF3EA]
                text-2xl text-[#C44E12]
                shadow-[0_10px_26px_rgba(196,78,18,0.10)]
                transition-all duration-500
                group-hover:-rotate-3 group-hover:scale-110
                group-hover:border-[#C44E12] group-hover:bg-[#C44E12]
                group-hover:text-white
                [&>svg]:h-7 [&>svg]:w-7
              "
            >
              {item.icon}
            </div>

            {/* Content */}
            <h3 className="mt-6 pr-4 text-xl font-bold tracking-[-0.025em] text-neutral-900 sm:text-[1.35rem]">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-[15px] sm:leading-7">
              {item.copy}
            </p>

            {/* Bottom indicator */}
            <div className="mt-auto flex items-center gap-2 pt-7">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Business ready
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>

    {/* Bottom trust bar */}
    <div
      className="
        mt-8 flex flex-col items-center justify-between gap-5
        rounded-[1.5rem] border border-orange-100
        bg-white/90 px-6 py-6
        shadow-[0_14px_40px_rgba(45,32,24,0.06)]
        backdrop-blur-sm sm:px-8 md:flex-row
      "
      data-aos="fade-up"
      data-aos-duration="750"
      data-aos-once="true"
    >
      <div className="text-center md:text-left">
        <p className="font-bold text-neutral-900">
          Built around the needs of modern businesses
        </p>

        <p className="mt-1.5 text-sm leading-6 text-neutral-600">
          Explore reliable solutions tailored to your location, team and
          connectivity requirements.
        </p>
      </div>

      <button
        type="button"
        onClick={handleBook}
        className="
          group inline-flex min-h-12 shrink-0 items-center
          justify-center gap-3 rounded-full bg-[#C44E12]
          px-6 text-sm font-semibold text-white
          shadow-[0_12px_28px_rgba(196,78,18,0.24)]
          transition-all duration-300
          hover:-translate-y-0.5 hover:bg-[#A83E0C]
          hover:shadow-[0_16px_34px_rgba(196,78,18,0.3)]
          focus-visible:outline-none focus-visible:ring-4
          focus-visible:ring-[#E8611A]/25
        "
      >
        Explore Solutions

        <span
          aria-hidden="true"
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            bg-white/15 transition-transform duration-300
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </button>
    </div>
  </div>
</section>

      {/* COMPARISON */}
     <section
  className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="comparison-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.09),transparent_44%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-28 top-28 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
    {/* Heading */}
    <div
      className="mx-auto max-w-3xl text-center"
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-once="true"
    >
      <div className="mb-4 flex items-center justify-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-8 bg-[#E8611A]"
        />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Business Fiber Benefits
        </span>

        <span
          aria-hidden="true"
          className="h-px w-8 bg-[#E8611A]"
        />
      </div>

      <h2
        id="comparison-heading"
        className="text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-neutral-900 sm:text-4xl lg:text-[2.9rem]"
      >
        The choice is{" "}
        <span className="text-[#C44E12]">simple</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
        Explore the high-performance features designed to keep your business
        connected, productive and ready to grow.
      </p>
    </div>

    {/* Comparison table */}
    <div
      className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_24px_70px_rgba(45,32,24,0.10)] lg:mt-14"
      data-aos="zoom-in"
      data-aos-duration="850"
      data-aos-once="true"
    >
      {/* Top accent */}
      <div
        aria-hidden="true"
        className="h-1.5 bg-gradient-to-r from-[#A83E0C] via-[#E8611A] to-[#FF9A5C]"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <caption className="sr-only">
            ACC Business Fiber service features
          </caption>

          <thead>
            <tr>
              <th
                scope="col"
                className="w-[55%] border-b border-neutral-200 bg-[#FAF8F5] px-5 py-6 text-left sm:px-8"
              >
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                  Included Features
                </span>
              </th>

              <th
                scope="col"
                className="relative w-[45%] border-b border-[#A83E0C] bg-gradient-to-br from-[#A83E0C] to-[#E8611A] px-5 py-6 text-center text-white sm:px-8"
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-100">
                  Premium Connectivity
                </span>

                <span className="mt-1.5 block text-base font-bold sm:text-lg">
                  ACC Business Fiber®
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {[
              {
                label: "Fastest broadband tier",
                value: "Up to 5 GIG",
                note: "Limited availability",
              },
              {
                label: "100% symmetrical fiber",
                value: true,
              },
              {
                label: "Upload speeds as fast as downloads",
                value: true,
              },
              {
                label: "No annual contract options",
                value: true,
              },
              {
                label: "Gateway equipment included",
                value: true,
              },
              {
                label: "No data caps",
                value: true,
              },
              {
                label: "Free installation for online orders",
                value: true,
              },
            ].map((item, index) => (
              <tr
                key={item.label}
                className="group border-b border-neutral-100 last:border-b-0 transition-colors duration-300 hover:bg-[#FFF8F3]"
              >
                <th
                  scope="row"
                  className={`px-5 py-4 text-left text-sm font-semibold text-neutral-800 sm:px-8 sm:py-5 sm:text-[15px] ${
                    index % 2 === 0 ? "bg-neutral-50/60" : "bg-white"
                  } group-hover:bg-transparent`}
                >
                  {item.label}
                </th>

                <td
                  className={`border-l border-neutral-100 px-5 py-4 text-center sm:px-8 sm:py-5 ${
                    index % 2 === 0 ? "bg-neutral-50/60" : "bg-white"
                  } group-hover:bg-transparent`}
                >
                  {item.value === true ? (
                    <span
                      className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm"
                      aria-label="Included"
                      title="Included"
                    >
                      <FaCheckCircle
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    </span>
                  ) : (
                    <div>
                      <span className="block text-sm font-bold text-neutral-900 sm:text-[15px]">
                        {item.value}
                      </span>

                      {item.note && (
                        <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500">
                          {item.note}
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom note */}
      <div className="flex flex-col gap-3 border-t border-neutral-200 bg-[#FAF8F5] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="max-w-2xl text-[11px] leading-5 text-neutral-500 sm:text-xs">
          Service availability, speed tiers, equipment and installation offers
          may vary by location. Verify current terms before ordering.
        </p>

        <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-emerald-700">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-emerald-500"
          />
          Business ready
        </span>
      </div>
    </div>
  </div>
</section>

      {/* ADD-ONS */}
    <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="addons-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.10),transparent_45%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-28 top-32 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Additional Business Solutions
        </span>

        <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="addons-heading"
        className="text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-neutral-900 sm:text-4xl lg:text-[2.9rem]"
      >
        Add-ons designed to{" "}
        <span className="text-[#C44E12]">grow with you</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
        Enhance your business connectivity with professional voice and security
        solutions built for better communication, protection and scalability.
      </p>
    </div>

    {/* Add-on cards */}
    <div className="mt-11 grid gap-6 md:grid-cols-2 lg:mt-14 lg:gap-8">
      {[
        {
          title: "Business Voice",
          label: "Communication Solutions",
          copy:
            "Add professional business voice with auto-attendant, intelligent call routing and number porting while keeping your brand consistent across every location.",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwl6S6V2cZUsmN18mvFctpU-OjdBfBz8miA&s",
          alt: "Professional business voice and communication services",
          benefits: [
            "Auto-attendant and call routing",
            "Number porting support",
          ],
          aos: "fade-right",
        },
        {
          title: "Business Security",
          label: "Protection Solutions",
          copy:
            "Protect your business devices and network with gateway-level safeguards and optional site-security solutions designed for smarter prevention and response.",
          image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
          alt: "Secure business network infrastructure",
          benefits: [
            "Gateway-level protection",
            "Smarter threat prevention",
          ],
          aos: "fade-left",
        },
      ].map((item) => (
        <article
          key={item.title}
          className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_18px_50px_rgba(45,32,24,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(196,78,18,0.14)]"
          data-aos={item.aos}
          data-aos-duration="850"
          data-aos-once="true"
        >
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] sm:h-72 lg:h-[310px]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
            />

            {/* Image badge */}
            <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md sm:text-xs">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[#FF8A42]"
                />
                {item.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative flex flex-1 flex-col p-6 sm:p-8 lg:p-9">
            <span
              aria-hidden="true"
              className="absolute left-8 top-0 h-1 w-14 rounded-b-full bg-[#E8611A] transition-all duration-500 group-hover:w-24"
            />

            <h3 className="text-xl font-bold tracking-[-0.025em] text-neutral-900 sm:text-2xl">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-[15px] sm:leading-7">
              {item.copy}
            </p>

            {/* Benefits */}
            <div className="mt-6 grid gap-3 border-t border-neutral-100 pt-5 sm:grid-cols-2">
              {item.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-2.5 text-xs font-semibold leading-5 text-neutral-600 sm:text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs text-emerald-600"
                  >
                    ✓
                  </span>

                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleBook}
              className="group/button mt-7 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full border border-[#C44E12] px-6 text-sm font-semibold text-[#A83E0C] transition-all duration-300 hover:bg-[#C44E12] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/20"
            >
              Explore {item.title}

              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/button:translate-x-1"
              >
                →
              </span>
            </button>
          </div>
        </article>
      ))}
    </div>

    {/* Bottom information bar */}
    <div
      className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[1.5rem] border border-orange-100 bg-white/90 px-6 py-6 shadow-[0_14px_40px_rgba(45,32,24,0.06)] backdrop-blur-sm sm:px-8 md:flex-row"
      data-aos="fade-up"
      data-aos-once="true"
    >
      <div className="text-center md:text-left">
        <p className="font-bold text-neutral-900">
          Build a complete solution for your business
        </p>

        <p className="mt-1.5 text-sm leading-6 text-neutral-600">
          Combine internet, voice and security services based on your
          organization’s requirements.
        </p>
      </div>

      <button
        type="button"
        onClick={handleBook}
        className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#C44E12] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(196,78,18,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
      >
        Get Started

        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>
    </div>
  </div>
</section>

      {/* COVERAGE */}
     <section
  className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
  aria-labelledby="coverage-heading"
>
  {/* Background decoration */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(232,97,26,0.09),transparent_35%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
    <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
      {/* Coverage image */}
      <div
        className="group relative"
        data-aos="fade-right"
        data-aos-duration="850"
        data-aos-once="true"
      >
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-orange-100/70 to-amber-50 opacity-70 blur-xl"
        />

        <div className="relative overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-neutral-100 shadow-[0_28px_70px_rgba(45,32,24,0.14)]">
          <img
            src="https://images.unsplash.com/photo-1552083375-1447ce886485?q=85&w=1600&auto=format&fit=crop"
            alt="ACC Business fiber coverage and network expansion"
            loading="lazy"
            className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:h-[410px] lg:h-[480px]"
          />

          {/* Image treatment */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-neutral-950/65 via-neutral-950/5 to-transparent"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#C44E12]/15 to-transparent"
          />

          {/* Expansion status */}
          <div className="absolute left-5 top-5 sm:left-6 sm:top-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-neutral-950/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg backdrop-blur-md sm:text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              Network expanding
            </span>
          </div>

          {/* Bottom image content */}
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200 sm:text-xs">
              Nationwide Business Connectivity
            </p>

            <p className="mt-2 max-w-md text-base font-semibold leading-6 sm:text-lg">
              Bringing reliable, fiber-powered connectivity to more business
              locations.
            </p>
          </div>
        </div>

        {/* Floating information card */}
        <div className="absolute -bottom-6 right-4 hidden rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-[0_18px_45px_rgba(45,32,24,0.14)] sm:flex sm:items-center sm:gap-4 lg:-right-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E6] text-[#C44E12]">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
              />
              <circle cx="12" cy="10" r="2.5" strokeWidth="2" />
            </svg>
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#A83E0C]">
              Location based
            </p>

            <p className="mt-1 text-sm font-semibold text-neutral-800">
              Check service at your address
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="lg:pl-2"
        data-aos="fade-left"
        data-aos-duration="850"
        data-aos-once="true"
      >
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />

          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
            Expanding Fiber Network
          </span>
        </div>

        <h2
          id="coverage-heading"
          className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-neutral-900 sm:text-4xl lg:text-[2.9rem]"
        >
          Our fiber coverage is{" "}
          <span className="text-[#C44E12]">expanding</span>
        </h2>

        <p className="mt-5 max-w-xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
          We’re bringing fiber-fast business internet to more locations
          nationwide. Check your address to find out which connectivity
          solutions are available for your business.
        </p>

        {/* Benefits */}
        <div className="mt-7 space-y-4">
          {[
            "High-speed connectivity for growing businesses",
            "Availability based on your business location",
            "Support from experienced business specialists",
          ].map((benefit) => (
            <div key={benefit} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600"
              >
                ✓
              </span>

              <span className="text-sm font-medium leading-6 text-neutral-700 sm:text-[15px]">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#C44E12] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(196,78,18,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] hover:shadow-[0_16px_36px_rgba(196,78,18,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
        >
          Check Availability

          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </button>

        <p className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-emerald-500"
          />
          Quick location check with no obligation
        </p>
      </div>
    </div>
  </div>
</section>

      {/* FAQ */}
      <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="faq-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.10),transparent_44%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div
      className="mx-auto max-w-3xl text-center"
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-once="true"
    >
      <div className="mb-4 flex items-center justify-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Help & Support
        </span>

        <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="faq-heading"
        className="text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-neutral-900 sm:text-4xl lg:text-[2.9rem]"
      >
        Frequently asked{" "}
        <span className="text-[#C44E12]">questions</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
        Find clear answers about plans, availability, installation and business
        connectivity services.
      </p>
    </div>

    {/* FAQ list */}
    <div
      className="mx-auto mt-10 max-w-4xl space-y-3 lg:mt-14"
      data-aos="fade-up"
      data-aos-delay="100"
      data-aos-duration="800"
      data-aos-once="true"
    >
      {FAQS.map((faq, index) => (
        <details
          key={faq.q}
          className="
            group overflow-hidden rounded-2xl
            border border-neutral-200/80 bg-white
            shadow-[0_8px_28px_rgba(45,32,24,0.05)]
            transition-all duration-300
            open:border-orange-200
            open:shadow-[0_16px_40px_rgba(196,78,18,0.10)]
          "
        >
          <summary
            className="
              flex min-h-[74px] cursor-pointer list-none items-center
              justify-between gap-5 px-5 py-4
              text-left transition-colors duration-300
              hover:bg-[#FFF8F3]
              focus-visible:outline-none
              focus-visible:ring-4 focus-visible:ring-inset
              focus-visible:ring-[#E8611A]/15
              sm:min-h-[82px] sm:px-7 sm:py-5
              [&::-webkit-details-marker]:hidden
            "
          >
            <span className="flex min-w-0 items-center gap-4">
              {/* Question number */}
              <span
                aria-hidden="true"
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-xl bg-[#FFF0E6]
                  text-[11px] font-bold text-[#A83E0C]
                  transition-colors duration-300
                  group-open:bg-[#C44E12] group-open:text-white
                "
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="text-sm font-bold leading-6 text-neutral-900 sm:text-base">
                {faq.q}
              </span>
            </span>

            {/* Toggle icon */}
            <span
              aria-hidden="true"
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-full border border-neutral-200
                bg-neutral-50 text-[#C44E12]
                transition-all duration-300
                group-hover:border-orange-200 group-hover:bg-[#FFF0E6]
                group-open:rotate-180 group-open:border-[#C44E12]
                group-open:bg-[#C44E12] group-open:text-white
              "
            >
              <FaChevronDown className="h-3.5 w-3.5" />
            </span>
          </summary>

          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="border-t border-neutral-100 px-5 pb-6 pt-5 sm:ml-16 sm:px-7 sm:pb-7">
                <p className="max-w-3xl text-sm leading-7 text-neutral-600 sm:text-[15px]">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        </details>
      ))}
    </div>

    {/* Support card */}
    <div
      className="
        mx-auto mt-8 flex max-w-4xl flex-col items-center
        justify-between gap-5 rounded-[1.5rem]
        border border-orange-100 bg-white/90 px-6 py-6
        shadow-[0_14px_40px_rgba(45,32,24,0.06)]
        backdrop-blur-sm sm:px-8 md:flex-row
      "
      data-aos="fade-up"
      data-aos-duration="750"
      data-aos-once="true"
    >
      <div className="text-center md:text-left">
        <p className="font-bold text-neutral-900">
          Still have questions?
        </p>

        <p className="mt-1.5 text-sm leading-6 text-neutral-600">
          Speak with a business specialist for help choosing the right solution.
        </p>
      </div>

      <button
        type="button"
        onClick={handleBook}
        className="
          group inline-flex min-h-12 shrink-0 items-center
          justify-center gap-3 rounded-full bg-[#C44E12]
          px-6 text-sm font-semibold text-white
          shadow-[0_12px_28px_rgba(196,78,18,0.24)]
          transition-all duration-300
          hover:-translate-y-0.5 hover:bg-[#A83E0C]
          hover:shadow-[0_16px_34px_rgba(196,78,18,0.30)]
          focus-visible:outline-none
          focus-visible:ring-4 focus-visible:ring-[#E8611A]/25
        "
      >
        Contact a Specialist

        <span
          aria-hidden="true"
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full bg-white/15
            transition-transform duration-300
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </button>
    </div>
  </div>
</section>
    </div>
  );
}
