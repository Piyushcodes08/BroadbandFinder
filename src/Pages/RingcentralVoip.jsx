import React, { useMemo, useState } from "react";
import {
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiOutlineCog6Tooth,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import {
  FaApple,
  FaAndroid,
  FaSlack,
  FaTeamspeak,
  FaSalesforce,
} from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { HiCheck } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

/** —————————————————————————————————————————————————————————————
 * Small Business Phone – RingCentral-style replica (responsive)
 * TailwindCSS required.
 * ————————————————————————————————————————————————————————————— */

const LOGOS = [
  "Shopify",
  "Squarespace",
  "Airbnb",
  "Zendesk",
  "monday.com",
  "Asana",
];

const PLANS = [
  {
    name: "Essentials",
    blurb: "All-in-one phone & SMS.",
    monthly: 30,
    annual: 20,
    features: [
      "1 local or toll-free number",
      "Unlimited US/CA calling",
      "Mobile & desktop apps",
    ],
  },
  {
    name: "Standard",
    blurb: "Best for growing teams.",
    monthly: 35,
    annual: 25,
    popular: true,
    features: [
      "Everything in Essentials",
      "Auto-receptionist",
      "Voicemail to text",
      "Call recording (on-demand)",
    ],
  },
  {
    name: "Premium",
    blurb: "Advanced analytics & AI.",
    monthly: 45,
    annual: 35,
    features: [
      "Everything in Standard",
      "Advanced call analytics",
      "Multi-site support",
      "AI summaries & live assist",
    ],
  },
];

function PriceToggle({ annual, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 text-sm bg-white border border-gray-200 rounded-full p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-3 py-1 rounded-full transition ${
          !annual
            ? "bg-red-500 text-white shadow"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-pressed={!annual}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-3 py-1 rounded-full transition ${
          annual
            ? "bg-red-500 text-white shadow"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-pressed={annual}
      >
        Annual (save)
      </button>
    </div>
  );
}

function PlanCard({ plan, annual }) {
  const price = annual ? plan.annual : plan.monthly;
  const navigate = useNavigate();
  const handleBook = () => {
    navigate("/customerbookingfrom", { state: { name: "Ringcentral" } });
  };
  return (
    <div
      className={`relative rounded-2xl border p-6 bg-white shadow-sm hover:shadow-md transition ${
        plan.popular ? "border-red-500" : "border-gray-200"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-6 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Most popular
        </div>
      )}
      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{plan.blurb}</p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-gray-900">${price}</span>
        <span className="text-gray-600">/user/mo</span>
      </div>

      <ul className="mt-5 space-y-2 text-sm text-gray-800 h-32">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 text-red-500" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-start items-center mt-4">
        <button
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 text-md rounded-full"
          onClick={handleBook}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default function RingCentralSmallBusinessReplica() {
  const [zipcode, setZipcode] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [annual, setAnnual] = useState(true);

  const navigate = useNavigate();

  const yearSaveCopy = useMemo(
    () =>
      annual
        ? "You’re viewing annual pricing (best value)."
        : "Switch to annual and save.",
    [annual]
  );

  const onZipChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZipcode(onlyDigits);
    if (error) setError("");
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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResults({ available: true, zipcode: zip });
    }, 500);
  };

  const handleBook = () =>
    navigate("/customerbookingfrom", {
      state: { name: "RingCentral" },
    });

  return (
    <div className="bg-red-50/30 text-gray-900">
      {/* ===== Sticky notice bar ===== */}
      <div className="w-full bg-gradient-to-r from-red-500 to-amber-500 text-white text-center text-xs py-2">
        Limited-time: get your first month free on annual plans.{" "}
        <span className="opacity-75">T&Cs apply</span>
      </div>

      {/* ===== HERO ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-red-600">
              <HiOutlineShieldCheck /> Trusted by small businesses
            </span>
            <h1 className="mt-2 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              The small-business phone system, trusted by over{" "}
              <span className="text-red-600">500K businesses</span>
            </h1>
            <p className="mt-4 text-gray-700 max-w-xl">
              Run calls, texts, and video in one reliable app. Stay professional
              anywhere with AI-powered tools and analytics that help you grow.
            </p>
          </div>

          {/* Phone card image */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-[420px]">
              <img
                alt="Dialer app mock"
                loading="lazy"
                className="w-full h-auto rounded-3xl ring-1 ring-black/5"
                src="https://thumbs.dreamstime.com/b/phone-dial-screen-display-keypad-numberst-mobile-vector-stock-204294865.jpg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl border p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <HiOutlinePhone />
                  </span>
                  <div className="text-sm">
                    <div className="font-semibold">Business number</div>
                    <div className="text-gray-500">1-855 744 2407</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted logos row */}
        <div className="mt-10 border-y py-6">
          <p className="text-center text-xs text-gray-500 mb-3">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {LOGOS.map((l) => (
              <span key={l} className="text-sm font-semibold tracking-wide">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ZIP LOOKUP ===== */}
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
                pattern="^\d{5}$"
                autoComplete="postal-code"
                maxLength={5}
                value={zipcode}
                onChange={onZipChange}
                placeholder="Enter ZIP code"
                className="w-full py-3 pr-3 pl-3 text-lg bg-white outline-none text-gray-900 placeholder:text-gray-400"
                aria-invalid={!!error}
                aria-describedby={error ? "zip-error" : undefined}
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-5 bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
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
            {results && (
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
                  RingCentral is available in {results.zipcode}
                </span>

                <span className="mt-6">
                  <button
                    onClick={handleBook}
                    className="px-6 py-3 border border-red-600 text-red-600 hover:text-white font-semibold rounded-full hover:bg-red-600 transition duration-300"
                  >
                    Book Now
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Collage + Benefits ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Collage */}
          <div className="grid grid-cols-2 gap-6 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px]">
            <div className="relative col-span-1 row-span-1 overflow-hidden rounded-2xl bg-gray-100">
              <img
                loading="lazy"
                className="h-full w-full object-cover"
                src="https://t4.ftcdn.net/jpg/02/71/07/79/360_F_271077976_5CONfK9pIQWVVdzJ0DQ307r949UNpdnl.jpg"
                alt="Curbside pickup"
              />
              <div className="absolute left-3 right-3 bottom-3 rounded-xl bg-white/95 shadow-lg border border-gray-200 p-3">
                <div className="text-[10px] text-gray-500 leading-tight">
                  MESSAGES
                </div>
                <div className="mt-1 font-semibold text-gray-900 text-sm">
                  Order #341
                </div>
                <div className="text-xs text-gray-600">
                  Your order is ready for pickup!
                </div>
              </div>
            </div>

            <div className="relative col-span-1 row-span-2 overflow-hidden rounded-2xl bg-gray-100">
              <img
                loading="lazy"
                className="h-full w-full object-cover"
                src="https://img.freepik.com/premium-photo/business-man-making-phone-call-with-smartphone-outdoors-city-street-walking-talking_665053-130.jpg"
                alt="Business owner calling on mobile"
              />
              <div className="absolute top-4 left-4 rounded-2xl bg-white/95 shadow-md border border-gray-200 px-3 py-2 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-amber-100 grid place-items-center text-amber-700 text-xs font-bold">
                  •
                </div>
                <div className="text-[11px] text-gray-700">
                  To check your account balance press…
                </div>
                <div className="ml-1 h-2 w-2 rounded-full bg-amber-400" />
              </div>
            </div>

            <div className="relative col-span-1 row-span-1 overflow-hidden rounded-2xl bg-gray-100">
              <img
                loading="lazy"
                className="h-full w-full object-cover"
                src="https://images.theconversation.com/files/603049/original/file-20240626-23-fcz5tl.jpg?ixlib=rb-4.1.0&rect=0%2C10%2C6720%2C4456&q=20&auto=format&w=640&fit=clip&dpr=2&usm=12&cs=strip"
                alt="Owner on video call"
              />
            </div>
          </div>

          {/* Right: Copy / bullets */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              The small business phone
              <br /> system with big benefits
            </h2>

            <ul className="mt-6 space-y-6">
              {[
                {
                  title: "Get a second phone line in minutes",
                  desc: "Setup is easy — port over your existing business phone numbers, or pick new ones.",
                },
                {
                  title: "Stay connected in one reliable app",
                  desc: "Talk, message, meet, and support customers — from anywhere, on any device.",
                },
                {
                  title: "Create a polished brand",
                  desc: "Build custom greetings, set up dynamic call routing, and easily triage customer calls.",
                },
                {
                  title: "Never miss a customer interaction",
                  desc: "Meet your customers where they are, across voice calls and 20+ digital channels.",
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-[3px] h-5 w-5 rounded-full bg-amber-500/15 text-amber-600 grid place-items-center ring-1 ring-amber-200">
                    <HiCheck className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {item.title}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              to="/contact-us"
              className="mt-8 inline-flex items-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 transition"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
    <div>
      <h3 className="text-3xl sm:text-4xl font-extrabold">
        Pick the perfect plan
      </h3>
      <p className="text-sm text-gray-600 mt-1">{yearSaveCopy}</p>
    </div>
    <PriceToggle annual={annual} onChange={setAnnual} />
  </div>

  <div className="mt-6">
    {/* Mobile: Swiper carousel */}
    <div className="md:hidden">
      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="pb-8"
      >
        {PLANS.map((p, i) => (
          <SwiperSlide key={i}>
            <PlanCard plan={p} annual={annual} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    {/* Desktop: Grid */}
    <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
      {PLANS.map((p) => (
        <PlanCard key={p.name} plan={p} annual={annual} />
      ))}
    </div>
  </div>
</section>

      {/* ===== Features grid ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h3 className="text-3xl sm:text-4xl font-extrabold text-center">
          Features small businesses love
        </h3>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-red-100 text-red-600 grid place-items-center">
                <HiOutlineSparkles className="h-5 w-5" />
              </span>
              <h4 className="font-bold text-2xl">Noise removal & AI notes</h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Block background noise and get automatic conversation summaries
              sent to your inbox.
            </p>
            <img
              loading="lazy"
              className="mt-4 rounded-xl border"
              alt="AI notes feature"
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop"
            />
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-red-100 text-red-600 grid place-items-center">
                <HiOutlineCog6Tooth className="h-5 w-5" />
              </span>
              <h4 className="font-bold text-2xl">Auto-receptionist</h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Greet callers with professional menus that route calls to the
              right person — every time.
            </p>
            <img
              loading="lazy"
              className="mt-4 rounded-xl border"
              alt="Auto receptionist"
              src="https://vizito.eu/images/blog/company_receptionist.png"
            />
          </div>
        </div>
      </section>

      {/* ===== AI Receptionist single ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-4">
          <span className="text-xl font-semibold text-red-600">
            Hello, AI Receptionist.
          </span>
          <h3 className="mt-1 text-4xl sm:text-5xl font-extrabold">
            Smarter inbound calls — without extra headcount
          </h3>
          <p className="mt-2 text-gray-700 text-lg sm:text-xl">
            Give every caller a VIP experience. IVR menus and directory lookup
            route people instantly, whether you’re in the office or on the go.
          </p>
          <ul className="mt-3 space-y-2 text-base sm:text-lg">
            {[
              "Custom greetings",
              "Time-of-day routing",
              "Dial-by-name directory",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <HiOutlineCheckCircle className="mt-0.5 text-red-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <img
          loading="lazy"
          className="rounded-2xl border shadow-sm"
          alt="AI Receptionist"
          src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1400&auto=format&fit=crop"
        />
      </section>

      {/* ===== Results / Stats ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.05]">
          Real results for small businesses of all sizes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {[
            {
              value: "35%",
              lines: (
                <>
                  Boost in productivity with deeper
                  <br className="hidden sm:block" />
                  call reporting insights for{" "}
                  <a
                    href="#"
                    className="underline decoration-2 underline-offset-[3px]"
                  >
                    IrisVision
                  </a>
                </>
              ),
            },
            {
              value: "$1k+",
              lines: (
                <>
                  Estimated savings for{" "}
                  <a
                    href="#"
                    className="underline decoration-2 underline-offset-[3px]"
                  >
                    Stumptown
                  </a>{" "}
                  after switching to
                  <br className="hidden sm:block" />
                  RingCentral
                </>
              ),
            },
            {
              value: "9.1",
              lines: (
                <>
                  Average attendee NPS score by{" "}
                  <a
                    href="#"
                    className="underline decoration-2 underline-offset-[3px]"
                  >
                    356 Labs
                  </a>
                </>
              ),
            },
            {
              value: "40%",
              lines: (
                <>
                  Average increase in agent
                  <br className="hidden sm:block" />
                  productivity at{" "}
                  <a
                    href="#"
                    className="underline decoration-2 underline-offset-[3px]"
                  >
                    Workato
                  </a>
                </>
              ),
            },
          ].map((it) => (
            <div key={it.value}>
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none">
                {it.value}
              </div>
              <p className="mt-4 text-[15px] sm:text-base text-gray-700 leading-relaxed">
                {it.lines}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h3 className="text-3xl font-extrabold text-center">
          Questions? We’ve got you covered.
        </h3>
        <div className="mt-6 divide-y rounded-2xl border bg-white shadow-sm">
          <Accordion
            items={[
              {
                q: "What’s included in the small business plan?",
                a: "Business phone number, mobile and desktop apps, team messaging, voicemail transcription, unlimited domestic calling, and basic analytics.",
              },
              {
                q: "Can I port my existing phone number?",
                a: "Yes, you can port most numbers during or after signup. We’ll guide you through the easy steps.",
              },
              {
                q: "Do you support desk phones?",
                a: "Absolutely. Use your existing SIP phones (if compatible), or purchase pre-provisioned phones that work out of the box.",
              },
              {
                q: "Is there an annual discount?",
                a: "Yes. Pay annually to unlock lower per-user pricing across all tiers.",
              },
            ]}
          />
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl bg-gradient-to-r from-red-500 to-amber-500 p-8 text-white text-center shadow">
          <h3 className="text-2xl font-extrabold">
            Switch to the most reliable business phone system
          </h3>
          <p className="mt-2 text-red-100">
            Start free — no credit card required.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact-us"
              className="rounded-xl border border-white/70 px-6 py-3 font-semibold hover:bg-white/10"
            >
              Contact sales
            </Link>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-4 text-center">
          Some claims are illustrative and may vary by region and use case.
        </p>
      </section>

      {/* Footer mini */}
      <footer className="py-10 border-t bg-white/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
          © {new Date().getFullYear()} Your Company — This page is a visual
          replica for demo purposes.
        </div>
      </footer>
    </div>
  );
}

/* —————————————— Helpers —————————————— */

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <button
              type="button"
              className="w-full text-left px-5 py-4 font-semibold flex items-center justify-between"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              {it.q}
              <span
                className={`ml-3 inline-block h-5 w-5 rounded-full border grid place-items-center transition ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm text-gray-700">{it.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
