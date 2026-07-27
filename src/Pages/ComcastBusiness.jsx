import React, { useRef, useState } from "react";
import bgimg from "../assets/compact.png"
import {
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaShieldAlt,
  FaWifi,
  FaCloud,
  FaSearch,
  FaPhoneAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


/* ================================
   DATA
================================ */
const SPEED_PLANS = [
  {
    title: "Business Internet Essential",
    download: 150,
    unit: "Mbps",
    uploadNote: "Up to 35 Mbps",
    bestFor: [
      "Basic email needs",
      "Small to medium file downloads and uploads",
      "Supports about 4 devices",
    ],
  },
  {
    title: "Business Internet Standard",
    download: 300,
    unit: "Mbps",
    uploadNote: "Up to 35 Mbps",
    bestFor: [
      "Streaming high-quality audio and video",
      "Browsing content-rich sites",
      "Supports about 5 devices",
    ],
    featured: true,
  },
  {
    title: "Business Internet Performance",
    download: 500,
    unit: "Mbps",
    uploadNote: "Up to 35 Mbps",
    bestFor: [
      "Fast downloads on multiple devices",
      "Large file transfers",
      "Supports about 8 devices",
    ],
  },
  {
    title: "Business Internet Advanced",
    download: 800,
    unit: "Mbps",
    uploadNote: "Up to 35 Mbps",
    bestFor: [
      "Connecting many users simultaneously",
      "Process multiple transactions faster",
      "Supports about 11 devices",
    ],
  },
  {
    title: "Business Internet Gigabit Extra",
    download: 1.25,
    unit: "Gbps",
    uploadNote: "Up to 35 Mbps",
    bestFor: [
      "Run multiple cloud-based apps, servers, and backup",
      "Fast, simultaneous, large file download and real-time analytics",
      "Supports unlimited devices",
    ],
  },
];

const VALUE_TILES = [
  {
    icon: <FaWifi />,
    title: "Business WiFi Pro",
    copy: "AI-powered WiFi insights.",
  },
  {
    icon: <FaCloud />,
    title: "Static IP",
    copy: "For hosted services & VPNs.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Security Edge™",
    copy: "Help block threats at the gateway.",
  },
];

const SOLUTIONS = [
  {
    eyebrow: "BE SECURED",
    title: "Helping you stay connected plus protected",
    copy: "Get offers that include advanced cybersecurity — to help protect against phishing, malware attacks, and more. And to help keep you connected if you lose power, add 4G LTE backup to your Business Internet plan at checkout.",
    image:
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1600&auto=format&fit=crop",
    items: [
      { label: "Security Edge™", caption: "Network threat protection" },
      { label: "WiFi Pro", caption: "Smart, managed business WiFi" },
    ],
  },
  {
    eyebrow: "WI-FI YOUR WAY",
    title: "Onsite access that works the way you need it",
    copy: "All Comcast Business Internet plans include basic WiFi, with reliable connectivity for laptops, smartphones, and other devices at your business. When business is booming, provide a fast WiFi connection with wider coverage and separate customer / employee networks.",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1600&auto=format&fit=crop",
    items: [
      { label: "Guest WiFi", caption: "Branded captive portal" },
      { label: "Private SSID", caption: "Separate employee network" },
    ],
  },
  {
    eyebrow: "TAKE YOUR NETWORK TO GO",
    title: "Drive business in a hybrid world",
    copy: "Whether your team is in the office, on the go, or a mix of both, help them stay productive with a network that keeps up. Comcast Business Mobile offers flexible data options and access to millions of WiFi hotspots nationwide.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop",
    items: [
      { label: "WiFi Pro", caption: "Coverage + insights" },
      { label: "Advanced speeds", caption: "Scale as you grow" },
    ],
  },
];

/* ================================
   SMALL COMPONENTS
================================ */
const SectionHeading = ({ eyebrow, title, sub }) => (
  <div className="text-center py-10">
    {eyebrow && (
      <p className="text-xs tracking-widest font-semibold text-gray-500 uppercase">
        {eyebrow}
      </p>
    )}
    <h2 className="mt-1 text-2xl md:text-5xl font-semibold text-gray-900">
      {title}
    </h2>
    {sub && <p className="mt-2 text-gray-600">{sub}</p>}
  </div>
);

function SpeedCard({ plan, active, onClick }) {
  const navigate = useNavigate();
    const handleBook = () => {
    navigate("/customerbookingfrom", { state: { name: "Comcast Business" } });
  };

  return (
    <button
      onClick={onClick}
      className={`group text-left bg-white rounded-md shadow-sm border transition h-full w-full ${
        active
          ? "border-[#E8611A] ring-1 ring-[#E8611A] shadow-md"
          : "border-gray-200 hover:shadow"
      }`}
      aria-pressed={active}
    >
      <div
        className={`h-1 w-full rounded-t-md ${
          active ? "bg-[#E8611A]" : "bg-transparent"
        }`}
      />
      <div className="p-5">
        <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase h-10">
          {plan.title}
        </p>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-gray-500">Up to</p>
          <div className="flex items-end justify-center gap-1">
            <span className="text-5xl font-semibold text-gray-900">
              {plan.download}
            </span>
            <span className="pb-1 text-gray-700 font-medium">{plan.unit}</span>
          </div>
          <p className="text-[12px] text-gray-500 mt-1">download speed</p>
        </div>

        <div className="mt-6">
          <div className="text-[12px] font-semibold text-gray-700">
            Upload Speed
          </div>
          <div className="mt-2 rounded-md bg-gray-50 border border-gray-200 p-3">
            <div className="flex items-center gap-2 text-[12px] text-gray-700">
              <FaCheck className="text-[#E8611A]" /> {plan.uploadNote}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[12px] font-semibold text-gray-700">
            Best for
          </div>
          <ul className="mt-2 space-y-2 h-40 text-[12px] text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded-md">
            {plan.bestFor.map((b, i) => (
              <li key={i} className="flex gap-2">
                <FaCheck className="text-[#E8611A] mt-[2px]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center items-center mt-4">
          <button
            className="bg-[#E8611A] hover:bg-[#F47630] text-white px-6 py-2 text-md rounded-full"
            onClick={handleBook}
          >
            Book Now
          </button>
        </div>
      </div>
    </button>
  );
}

function SolutionRow({ s, index }) {
  const imgFirst = index % 2 === 0;
  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className={imgFirst ? "" : "md:order-2"} data-aos={imgFirst ? "fade-right" : "fade-left"}>
        <img
          src={s.image}
          alt={s.title}
          className="w-full h-64 md:h-[480px] object-cover rounded-xl shadow-sm"
        />
      </div>
      <div
        className={
          imgFirst ? "flex flex-col gap-3 p-4 " : "md:order-1 flex flex-col gap-3 p-4"
        }
        data-aos={imgFirst ? "fade-left" : "fade-right"}
      >
        <p className="text-sm tracking-widest font-semibold text-gray-500 uppercase">
          {s.eyebrow}
        </p>
        <h3 className="mt-1 text-2xl md:text-4xl font-semibold text-gray-900">
          {s.title}
        </h3>
        <p className="mt-2 text-gray-600 text-sm">{s.copy}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 max-w-md">
          {s.items.map((it) => (
            <div
              key={it.label}
              className="rounded-md border border-gray-200 hover:border-gray-300 hover:shadow-sm transition p-3"
            >
              <div className="text-[11px] text-gray-500">{it.caption}</div>
              <div className="font-semibold text-gray-900">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================
   PAGE
================================ */
export default function ComcastBusinessFullPage() {
  const [zipcode, setZipcode] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [activeIdx, setActiveIdx] = useState(
    Math.max(
      0,
      SPEED_PLANS.findIndex((p) => p.featured)
    ) || 0
  );

  const scrollerRef = useRef(null);
  const scrollByCards = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("button");
    const step = card ? card.clientWidth + 16 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const zip = zipcode.trim();
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      setResults(null);
      return;
    }
    setError("");
    setResults({ available: true, zipcode: zip });
  };

  const handleBook = () => {
    navigate("/customerbookingfrom", { state: { name: "Comcast Business" } });
  };

  return (
    <div className="bg-[#f7f8fa] text-gray-900">
      {/* HERO */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#f5f2eb]">
        {/* Background image */}
        <img
          src={bgimg}
          alt="Comcast Business internet solutions"
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
                Comcast Business®
              </p>
            </div>

            {/* Main heading */}
            <h1 className="max-w-[680px] text-[clamp(2.8rem,6vw,3.7rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#171717]">
              Business Internet
              <span className="mt-2 block tracking-[-0.04em] text-orange-700">
                Built to Perform.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[620px] text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8 lg:text-xl">
              Power all your devices with fast, reliable Business Internet and 24/7 support.
            </p>

            {/* Feature */}
            <div className="mt-7 flex max-w-[590px] items-start gap-4 border-l-2 border-orange-600 pl-5">
              <div>
                <p className="font-semibold text-neutral-900">
                  24/7 Support Included
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600 sm:text-base">
                  Greater speed, stronger coverage and enhanced security for your business.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="tel:18557442407"
                aria-label="Call Comcast Business at 1-855-744-2407"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full hover:bg-white px-7 text-base font-semibold hover:text-black text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 bg-orange-700 hover:shadow-[0_20px_45px_rgba(194,65,12,0.25)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                  <FaPhoneAlt className="text-sm" />
                </span>
                <span>Call 1-855-744-2407</span>
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

      {/* ZIP CHECK */}
      <section
  id="availability"
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="availability-heading"
>
  {/* Background details */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.11),transparent_45%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl"
  />

  <div className="relative mx-auto max-w-[980px] px-5 sm:px-8 lg:px-12">
    {/* Heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Service Availability
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="availability-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Check availability at your{" "}
        <span className="text-[#C44E12]">business location</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Enter your five-digit ZIP code to discover available Comcast Business
        internet services in your area.
      </p>
    </div>

    {/* Search card */}
    <div className="relative mx-auto mt-10 max-w-2xl lg:mt-12">
      <div
        aria-hidden="true"
        className="absolute inset-x-10 -bottom-5 h-24 rounded-full bg-[#E8611A]/15 blur-2xl"
      />

      <div className="relative rounded-[1.75rem] border border-white/90 bg-white/90 p-5 shadow-[0_22px_65px_rgba(45,32,24,0.10)] backdrop-blur-sm sm:p-7 lg:p-8">
        <form
          onSubmit={handleSubmit}
          role="search"
          aria-label="Check Comcast Business availability by ZIP code"
          noValidate
        >
          <label
            htmlFor="zipcode"
            className="mb-2.5 block text-sm font-bold text-neutral-900"
          >
            Business ZIP code
          </label>

          <div
            className={`
              flex flex-col gap-3 rounded-2xl border bg-[#FAF8F5] p-2
              transition-all duration-300
              focus-within:bg-white focus-within:ring-4
              sm:flex-row sm:items-center
              ${
                error
                  ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
                  : "border-neutral-200 focus-within:border-[#E8611A] focus-within:ring-[#E8611A]/10"
              }
            `}
          >
            <div className="flex min-h-14 flex-1 items-center gap-3 px-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E6] text-[#C44E12]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>

              <input
                id="zipcode"
                name="zipcode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={zipcode}
                onChange={(e) =>
                  setZipcode(e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                placeholder="Enter 5-digit ZIP code"
                className="min-w-0 flex-1 bg-transparent py-3 text-base font-medium text-neutral-900 outline-none placeholder:font-normal placeholder:text-neutral-400 sm:text-lg"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "zipcode-error" : "zipcode-help"}
              />
            </div>

            <button
              type="submit"
              className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C44E12] px-6 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(196,78,18,0.23)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] hover:shadow-[0_16px_32px_rgba(196,78,18,0.3)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25 sm:text-base"
              aria-label="Check availability by ZIP code"
            >
              <FaSearch
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
              />

              <span>Check Availability</span>
            </button>
          </div>

          {!error && (
            <p
              id="zipcode-help"
              className="mt-3 flex items-start gap-2 text-xs leading-5 text-neutral-500"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8611A]"
              />
              Availability and service options may vary by business address.
            </p>
          )}

          {error && (
            <p
              id="zipcode-error"
              className="mt-3 flex items-center gap-2 text-sm font-medium text-red-600"
              role="alert"
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

        {/* Success result */}
        {results && (
          <div
            className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white shadow-[0_8px_20px_rgba(5,150,105,0.22)]"
                >
                  ✓
                </span>

                <div>
                  <p className="text-base font-bold text-emerald-900 sm:text-lg">
                    Service is available
                  </p>

                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    Comcast Business is available in ZIP code{" "}
                    <strong>{results.zipcode}</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBook}
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(4,120,87,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              >
                Book Now
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Trust indicators */}
    <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-7 gap-y-3">
      {[
        "Quick availability check",
        "No obligation",
        "Business specialist support",
      ].map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 sm:text-sm"
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
</section>

      {/* SPEED SELECTOR */}
    <section
  className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
  data-aos="fade-up"
  aria-labelledby="speed-plans-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.09),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
    {/* Heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Flexible Business Speeds
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="speed-plans-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        The internet speed your{" "}
        <span className="text-[#C44E12]">business needs</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Compare the speeds and features businesses choose most, with flexible
        options designed to grow alongside your team.
      </p>
    </div>

    {/* Desktop grid */}
    <div
      className="mt-10 hidden grid-cols-5 gap-4 xl:grid 2xl:gap-5"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      {SPEED_PLANS.map((plan, index) => (
        <div
          key={plan.title}
          className={`
            relative rounded-[1.5rem] transition-all duration-500
            ${
              index === activeIdx
                ? "-translate-y-2 shadow-[0_24px_55px_rgba(196,78,18,0.16)]"
                : "hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(30,24,20,0.10)]"
            }
          `}
        >
          {/* Recommended label */}
          {index === activeIdx && (
            <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#C44E12] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(196,78,18,0.28)]">
              Selected Plan
            </span>
          )}

          <div
            className={`
              h-full overflow-hidden rounded-[1.5rem] border bg-white
              transition-colors duration-300
              ${
                index === activeIdx
                  ? "border-[#E8611A] ring-4 ring-[#E8611A]/10"
                  : "border-neutral-200/80 hover:border-orange-200"
              }
            `}
          >
            <SpeedCard
              plan={plan}
              active={index === activeIdx}
              onClick={() => setActiveIdx(index)}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Tablet and mobile carousel */}
    <div
      className="relative mt-10 xl:hidden"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-12 bottom-0 h-20 rounded-full bg-[#E8611A]/10 blur-2xl"
      />

      <Swiper
        spaceBetween={16}
        slidesPerView={1.08}
        centeredSlides
        loop={SPEED_PLANS.length > 1}
        grabCursor
        watchSlidesProgress
        navigation={{
          prevEl: ".speed-prev",
          nextEl: ".speed-next",
        }}
        pagination={{
          clickable: true,
          el: ".speed-pagination",
          bulletClass:
            "inline-block h-2 w-2 rounded-full bg-neutral-300 transition-all duration-300 cursor-pointer",
          bulletActiveClass: "!w-7 !bg-[#C44E12]",
        }}
        breakpoints={{
          480: {
            slidesPerView: 1.2,
            spaceBetween: 18,
          },
          640: {
            slidesPerView: 1.65,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2.15,
            spaceBetween: 22,
          },
          1024: {
            slidesPerView: 3.1,
            spaceBetween: 24,
            centeredSlides: false,
          },
        }}
        modules={[Navigation, Pagination]}
        onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
        className="!overflow-visible"
      >
        {SPEED_PLANS.map((plan, index) => (
          <SwiperSlide key={plan.title} className="h-auto py-4">
            <div
              className={`
                h-full overflow-hidden rounded-[1.5rem] border bg-white
                transition-all duration-500
                ${
                  index === activeIdx
                    ? "-translate-y-1 border-[#E8611A] shadow-[0_22px_50px_rgba(196,78,18,0.15)] ring-4 ring-[#E8611A]/10"
                    : "border-neutral-200/80 shadow-[0_14px_36px_rgba(30,24,20,0.07)]"
                }
              `}
            >
              <SpeedCard
                plan={plan}
                active={index === activeIdx}
                onClick={() => setActiveIdx(index)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Carousel controls */}
      <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-[#FAF8F5] px-3 py-2.5 sm:px-4">
        <button
          type="button"
          className="speed-prev group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-[#E8611A] hover:text-[#C44E12] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="View previous speed plan"
        >
          <FaChevronLeft className="text-sm transition-transform group-hover:-translate-x-0.5" />
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="speed-pagination flex min-h-2 items-center justify-center gap-2" />

          <p
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500"
            aria-live="polite"
          >
            Plan {activeIdx + 1} of {SPEED_PLANS.length}
          </p>
        </div>

        <button
          type="button"
          className="speed-next group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all duration-300 hover:translate-x-0.5 hover:border-[#E8611A] hover:text-[#C44E12] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="View next speed plan"
        >
          <FaChevronRight className="text-sm transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>

    {/* Bottom information */}
    <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-5 rounded-2xl border border-neutral-200/80 bg-[#FAF8F5] px-6 py-5 sm:flex-row sm:px-7">
      <div>
        <p className="text-center text-sm font-bold text-neutral-900 sm:text-left">
          Not sure which speed fits your business?
        </p>

        <p className="mt-1 text-center text-xs leading-5 text-neutral-500 sm:text-left">
          A business specialist can recommend a plan based on your devices,
          users and daily activity.
        </p>
      </div>

      <a
        href="#contact"
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C44E12] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,78,18,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
      >
        Get a Recommendation
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</section>

      {/* HELP CTA */}
   <section
  className="relative isolate overflow-hidden bg-white py-10 sm:py-14"
  data-aos="zoom-in"
  aria-labelledby="plan-help-heading"
>
  <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
    <div className="relative overflow-hidden rounded-[1.75rem] border border-orange-100 bg-[#FAF8F5] px-6 py-9 shadow-[0_18px_50px_rgba(45,32,24,0.07)] sm:px-10 sm:py-11">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(232,97,26,0.13),transparent_35%)]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-16 -top-20 h-52 w-52 rounded-full border border-[#E8611A]/10"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-24 right-8 h-44 w-44 rounded-full bg-orange-100/70 blur-2xl"
      />

      <div className="relative flex flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">
        {/* Content */}
        <div className="max-w-2xl">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <span className="h-px w-8 bg-[#E8611A]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A83E0C] sm:text-xs">
              Personalized Assistance
            </span>
          </div>

          <h2
            id="plan-help-heading"
            className="mt-4 text-2xl font-bold tracking-[-0.035em] text-[#171717] sm:text-3xl"
          >
            Want help choosing the right plan?
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
            Speak with a business specialist and get a recommendation based on
            your team size, devices and connectivity needs.
          </p>
        </div>

        {/* CTA */}
        <a
          href="tel:18557442407"
          aria-label="Call a business specialist at 1-855-744-2407"
          className="group inline-flex min-h-13 shrink-0 items-center justify-center gap-3 rounded-full bg-[#C44E12] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(196,78,18,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] hover:shadow-[0_16px_34px_rgba(196,78,18,0.3)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25 sm:text-base"
        >
          <span>Contact Us</span>

          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>

      {/* Trust points */}
      <div className="relative mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-neutral-200/80 pt-5 md:justify-start">
        {[
          "Personalized guidance",
          "No obligation",
          "Business specialist support",
        ].map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 sm:text-sm"
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
</section>

      {/* SOLUTIONS */}
      <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  aria-labelledby="solutions-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.09),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
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
    >
      <div className="mb-4 flex items-center justify-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-8 bg-[#E8611A]"
        />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Connected Business Solutions
        </span>

        <span
          aria-hidden="true"
          className="h-px w-8 bg-[#E8611A]"
        />
      </div>

      <h2
        id="solutions-heading"
        className="text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.9rem]"
      >
        Your solutions work better{" "}
        <span className="text-[#C44E12]">together</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
        Keep your teams productive with connected solutions built for reliable
        communication, collaboration and performance—wherever business happens.
      </p>
    </div>

    {/* Solution rows */}
    <div className="relative mt-12 sm:mt-14 lg:mt-16">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#E8611A]/15 to-transparent lg:block"
      />

      <div className="relative space-y-10 sm:space-y-12 lg:space-y-16">
        {SOLUTIONS.map((solution, index) => (
          <div
            key={solution.title}
            className="group relative"
            data-aos="fade-up"
            data-aos-delay={Math.min(index * 100, 300)}
            data-aos-duration="800"
          >
            {/* Row number */}
            <div
              aria-hidden="true"
              className="absolute left-3 top-5 z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-orange-200 bg-white text-xs font-bold text-[#C44E12] shadow-sm xl:flex"
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Premium row container */}
            <div className="overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_18px_55px_rgba(45,32,24,0.07)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-orange-200 group-hover:shadow-[0_24px_65px_rgba(45,32,24,0.11)]">
              <SolutionRow
                s={solution}
                index={index}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom assistance card */}
    <div
      className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[1.5rem] border border-orange-100 bg-white/85 px-6 py-6 shadow-[0_14px_40px_rgba(45,32,24,0.06)] backdrop-blur-sm sm:px-8 md:flex-row"
      data-aos="fade-up"
    >
      <div className="text-center md:text-left">
        <p className="text-base font-bold text-neutral-900">
          Need help building the right solution stack?
        </p>

        <p className="mt-1.5 text-sm leading-6 text-neutral-600">
          Talk with a business specialist about connectivity, communication and
          security solutions for your team.
        </p>
      </div>

      <a
        href="tel:18557442407"
        aria-label="Call a business specialist at 1-855-744-2407"
        className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#C44E12] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(196,78,18,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] hover:shadow-[0_16px_34px_rgba(196,78,18,0.3)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
      >
        Speak With a Specialist

        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </a>
    </div>
  </div>
</section>

      {/* VALUE TILES */}
      <section
  className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
  aria-labelledby="business-value-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.09),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
    {/* Optional section heading */}
    <div
      className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
      data-aos="fade-up"
    >
      <div className="mb-4 flex items-center justify-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Built for Business
        </span>

        <span aria-hidden="true" className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="business-value-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Everything your business needs to{" "}
        <span className="text-[#C44E12]">stay connected</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Reliable performance, dedicated support and flexible solutions designed
        to keep your business moving forward.
      </p>
    </div>

    {/* Value cards */}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {VALUE_TILES.map((tile, index) => (
        <article
          key={tile.title}
          className="
            group relative overflow-hidden rounded-[1.75rem]
            border border-neutral-200/80 bg-white
            px-6 py-8 text-center
            shadow-[0_14px_40px_rgba(45,32,24,0.06)]
            transition-all duration-500
            hover:-translate-y-2 hover:border-orange-200
            hover:shadow-[0_24px_60px_rgba(196,78,18,0.13)]
            sm:px-7 sm:py-9 lg:px-8 lg:py-10
          "
          data-aos="fade-up"
          data-aos-delay={Math.min(index * 100, 300)}
          data-aos-duration="750"
          data-aos-once="true"
        >
          {/* Card glow */}
          <div
            aria-hidden="true"
            className="
              absolute -right-20 -top-20 h-48 w-48 rounded-full
              bg-orange-100/0 blur-2xl transition-colors duration-500
              group-hover:bg-orange-100/70
            "
          />

          {/* Top accent */}
          <span
            aria-hidden="true"
            className="
              absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2
              rounded-b-full bg-[#E8611A]
              transition-all duration-500 group-hover:w-24
            "
          />

          <div className="relative flex h-full flex-col items-center">
            {/* Icon */}
            <div
              className="
                flex h-16 w-16 items-center justify-center rounded-2xl
                border border-orange-100 bg-[#FFF4EC]
                text-3xl text-[#C44E12]
                shadow-[0_10px_25px_rgba(196,78,18,0.10)]
                transition-all duration-500
                group-hover:-rotate-3 group-hover:scale-110
                group-hover:border-[#E8611A]/30 group-hover:bg-[#C44E12]
                group-hover:text-white
                sm:h-[4.5rem] sm:w-[4.5rem] sm:text-[2rem]
              "
            >
              {tile.icon}
            </div>

            {/* Content */}
            <h3 className="mt-6 text-xl font-bold tracking-[-0.025em] text-neutral-900 sm:text-2xl">
              {tile.title}
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600 sm:text-[15px] sm:leading-7">
              {tile.copy}
            </p>

            {/* Bottom detail */}
            <div className="mt-auto pt-7">
              <span
                className="
                  inline-flex items-center gap-2 text-xs font-bold
                  uppercase tracking-[0.14em] text-[#C44E12]
                  opacity-70 transition-opacity duration-300
                  group-hover:opacity-100
                "
              >
                Learn more

                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

      {/* ALL-IN-ONE MGMT */}
      <section
  className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
  aria-labelledby="account-management-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(232,97,26,0.1),transparent_38%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-20">
      {/* Content */}
      <div
        data-aos="fade-right"
        data-aos-duration="850"
        data-aos-once="true"
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-9 bg-[#E8611A]"
          />

          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
            Simple Account Control
          </span>
        </div>

        <h2
          id="account-management-heading"
          className="mt-5 max-w-xl text-3xl font-bold leading-[1.08] tracking-[-0.045em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
        >
          All-in-one solution{" "}
          <span className="text-[#C44E12]">management</span>
        </h2>

        <p className="mt-5 max-w-xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
          Manage your connection, network settings, account services and
          billing from one convenient place.
        </p>

        {/* Features */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-x-6">
          {[
            "Monitor your connection and service status",
            "Manage public and private WiFi networks",
            "Control Connection Pro, WiFi Pro and SecurityEdge™",
            "Compare usage from the past 7 days, 30 days or 6 months",
            "Troubleshoot, restart and test your gateway speed",
            "View bills, get recommendations and chat with an agent",
          ].map((feature, index) => (
            <div
              key={feature}
              className="group flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white/75 p-4 shadow-[0_8px_24px_rgba(45,32,24,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white hover:shadow-[0_12px_30px_rgba(196,78,18,0.08)]"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF0E6] text-[#C44E12] transition-colors duration-300 group-hover:bg-[#C44E12] group-hover:text-white"
              >
                <FaCheck className="h-3 w-3" />
              </span>

              <p className="text-sm font-medium leading-6 text-neutral-700">
                {feature}
              </p>
            </div>
          ))}
        </div>

        {/* Support note */}
        <div className="mt-7 flex items-center gap-3 border-t border-neutral-200/80 pt-6">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </span>

          <p className="text-sm text-neutral-600">
            Account tools and specialist support available whenever you need
            assistance.
          </p>
        </div>
      </div>

      {/* Image */}
      <div
        className="relative"
        data-aos="fade-left"
        data-aos-duration="850"
        data-aos-once="true"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-10 -bottom-6 h-32 rounded-full bg-[#E8611A]/15 blur-3xl"
        />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white p-2.5 shadow-[0_28px_75px_rgba(45,32,24,0.14)] sm:p-3">
          <div className="relative overflow-hidden rounded-[1.5rem]">
            <img
              src="https://cdn.prod.website-files.com/65b7981897ba2e51087129d0/65ce4486cde877e511559ea6_AdobeStock_419881291.webp"
              alt="Business owner managing internet services from a mobile application"
              loading="lazy"
              className="h-[380px] w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03] sm:h-[480px] lg:h-[560px]"
            />

            {/* Image overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            />

            {/* Floating information card */}
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-[0_14px_35px_rgba(0,0,0,0.14)] backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-[280px] sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E6] text-[#C44E12]">
                  <FaCheck className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-sm font-bold text-neutral-900">
                    Manage from anywhere
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-600">
                    Access essential account and network controls from your
                    preferred device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative badge */}
        <div className="absolute -right-3 top-8 hidden rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(45,32,24,0.1)] sm:block lg:-right-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A83E0C]">
            One Platform
          </p>

          <p className="mt-1 text-sm font-bold text-neutral-900">
            Complete control
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* EXPERTS */}
     <section
  className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
  aria-labelledby="expert-support-heading"
>
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.08),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
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
          Expert Installation & Support
        </span>

        <span
          aria-hidden="true"
          className="h-px w-8 bg-[#E8611A]"
        />
      </div>

      <h2
        id="expert-support-heading"
        className="text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.9rem]"
      >
        Our experts are ready to{" "}
        <span className="text-[#C44E12]">help your business</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base sm:leading-8">
        From professional installation to ongoing assistance, get dependable
        support throughout every stage of your service.
      </p>
    </div>

    {/* Support cards */}
    <div className="mt-11 grid gap-6 md:grid-cols-2 lg:mt-14 lg:gap-8">
      {[
        {
          title: "Fast, convenient installation",
          copy:
            "Choose a convenient professional installation window during checkout—even when ordering online.",
          image:
            "https://images.unsplash.com/photo-1682345262055-8f95f3c513ea?q=80&w=1600&auto=format&fit=crop",
          alt: "Professional technicians installing business services",
          label: "Professional Installation",
          aos: "fade-right",
        },
        {
          title: "Support when you need it",
          copy:
            "Get assistance from knowledgeable specialists in your area, with additional support available by phone or chat.",
          image:
            "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop",
          alt: "Customer support specialist assisting a business customer",
          label: "Dedicated Assistance",
          aos: "fade-left",
        },
      ].map((item) => (
        <article
          key={item.title}
          className="group relative overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_18px_50px_rgba(45,32,24,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(196,78,18,0.14)]"
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
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] sm:h-72 lg:h-[320px]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
            />

            {/* Image label */}
            <div className="absolute bottom-5 left-5">
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
          <div className="relative p-6 sm:p-8 lg:p-9">
            <span
              aria-hidden="true"
              className="absolute left-8 top-0 h-1 w-14 rounded-b-full bg-[#E8611A] transition-all duration-500 group-hover:w-24"
            />

            <h3 className="text-xl font-bold tracking-[-0.025em] text-neutral-900 sm:text-2xl">
              {item.title}
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-[15px] sm:leading-7">
              {item.copy}
            </p>

            <div className="mt-6 flex items-center gap-2 border-t border-neutral-100 pt-5 text-xs font-semibold text-neutral-500 sm:text-sm">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
              >
                ✓
              </span>
              Reliable help from trained professionals
            </div>
          </div>
        </article>
      ))}
    </div>

    {/* Assistance bar */}
    <div
      className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[1.5rem] border border-orange-100 bg-[#FAF8F5] px-6 py-6 shadow-[0_14px_40px_rgba(45,32,24,0.06)] sm:px-8 md:flex-row"
      data-aos="fade-up"
      data-aos-once="true"
    >
      <div className="text-center md:text-left">
        <p className="font-bold text-neutral-900">
          Need assistance with your business service?
        </p>

        <p className="mt-1.5 text-sm leading-6 text-neutral-600">
          Connect with a business specialist for personalized guidance and
          support.
        </p>
      </div>

      <a
        href="tel:18557442407"
        aria-label="Call a business specialist at 1-855-744-2407"
        className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#C44E12] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(196,78,18,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] hover:shadow-[0_16px_34px_rgba(196,78,18,0.3)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8611A]/25"
      >
        Contact Support

        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </a>
    </div>
  </div>
</section>
    </div>
  );
}
