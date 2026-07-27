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
import { FaSearch, FaPhoneAlt } from "react-icons/fa";
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
import RingCentralVoipHeroBg from "../assets/ringcentralvoip-herobg.png";

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
            ? "bg-[#F47630] text-white shadow"
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
            ? "bg-[#F47630] text-white shadow"
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
        plan.popular ? "border-[#F47630]" : "border-gray-200"
      }`}
      data-aos="fade-up"
    >
      {plan.popular && (
        <div className="absolute -top-3 left-6 bg-[#F47630] text-white text-xs font-semibold px-3 py-1 rounded-full">
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
            <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 text-[#F47630]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-start items-center mt-4">
        <button
          className="bg-[#E8611A] hover:bg-[#F47630] text-white px-6 py-2 text-md rounded-full"
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
    <div className="bg-[#FEF3EC]/30 text-gray-900">
      {/* ===== Sticky notice bar ===== */}
      <div className="w-full bg-gradient-to-r from-[#F47630] to-amber-500 text-white text-center text-xs py-2">
        Limited-time: get your first month free on annual plans.{" "}
        <span className="opacity-75">T&Cs apply</span>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#f5f2eb]">
        {/* Background image */}
        <img
          src={RingCentralVoipHeroBg}
          alt="RingCentral business phone solutions"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center"
        />

        {/* Responsive image overlays */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#F8F6F1] via-[#F8F6F1]/95 to-[#F8F6F1]/45
            sm:via-[#F8F6F1]/90 sm:to-transparent
            lg:from-[#F8F6F1] lg:via-[#F8F6F1]/85 lg:to-transparent
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
                RingCentral®
              </p>
            </div>

            {/* Main heading */}
            <h1 className="max-w-[680px] text-[clamp(2.8rem,6vw,3.7rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#171717]">
              Phone System
              <span className="mt-2 block tracking-[-0.04em] text-orange-700">
                Trusted by 500K+ Teams.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[620px] text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8 lg:text-xl">
              Run calls, texts, and video in one reliable app. Stay professional anywhere with AI-powered tools and analytics that help you grow.
            </p>

            {/* Feature */}
            <div className="mt-7 flex max-w-[590px] items-start gap-4 border-l-2 border-orange-600 pl-5">
              <div>
                <p className="font-semibold text-neutral-900">
                  AI-Powered Voice & Video
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600 sm:text-base">
                  Stay professional anywhere with smart call routing, analytics, and custom integrations.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="tel:18557442407"
                aria-label="Call RingCentral at 1-855-744-2407"
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

      {/* Trusted logos row */}
      <div className="border-y bg-white py-6">
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

      {/* ===== ZIP LOOKUP ===== */}
      <section className="bg-gray-50" data-aos="fade-up">
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
                className="inline-flex items-center justify-center px-5 bg-[#E8611A] text-white font-semibold hover:bg-[#C44E12] disabled:bg-[#F47630] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8611A]"
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
            <p id="zip-error" className="mb-4 text-sm text-[#E8611A]">
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
                    className="px-6 py-3 border border-[#E8611A] text-[#E8611A] hover:text-white font-semibold rounded-full hover:bg-[#E8611A] transition duration-300"
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
          <div className="grid grid-cols-2 gap-6 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px]" data-aos="fade-right">
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
          <div data-aos="fade-left">
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
          <div className="rounded-2xl border bg-white p-6 shadow-sm" data-aos="fade-right">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-[#FDE3CF] text-[#E8611A] grid place-items-center">
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

          <div className="rounded-2xl border bg-white p-6 shadow-sm" data-aos="fade-left">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-[#FDE3CF] text-[#E8611A] grid place-items-center">
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
        <div className="flex flex-col gap-4" data-aos="fade-right">
          <span className="text-xl font-semibold text-[#E8611A]">
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
                <HiOutlineCheckCircle className="mt-0.5 text-[#F47630]" />
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
          data-aos="fade-left"
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
            <div key={it.value} data-aos="fade-up">
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-aos="fade-up">
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-aos="zoom-in">
        <div className="rounded-3xl bg-gradient-to-r from-[#F47630] to-amber-500 p-8 text-white text-center shadow">
          <h3 className="text-2xl font-extrabold">
            Switch to the most reliable business phone system
          </h3>
          <p className="mt-2 text-[#FDE3CF]">
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
