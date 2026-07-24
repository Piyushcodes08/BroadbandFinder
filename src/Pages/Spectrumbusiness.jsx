import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaWifi,
  FaMobileAlt,
  FaTv,
  FaHeadset,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";
import { MdOutlineSpeed } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import heroBg from "../assets/spectrum-herobg.png";

const PHONE = "1-855 744 2407";
const TEL_HREF = `tel:${PHONE.replace(/\D/g, "")}`;

export const bundles = [
  {
    badge: "2 MONTHS FREE",
    title: "Internet + Phone",
    priceLeft: "Both for only",
    price: 70,
    per: "/mo",
    bullets: [
      "500 Mbps Internet",
      "Choose ONE: Business Phone, Business TV Stream, Business Connect or a paid Mobile line",
      "Free standard installation",
      "2-year price guarantee available with upgrade to 750 Mbps or higher!"
    ],
  },
  {
    badge: "3 MONTHS FREE",
    title: "Internet + Phone + TV",
    priceLeft: "All for only",
    price: 100,
    per: "/mo",
    bullets: [
      "500 Mbps Internet",
      "Business Voice",
      "Business TV Stream",
      "Speeds up to 1 Gbps available in select areas",
      "3-year price guarantee available with upgrade to 750 Mbps or higher! "
    ],
  },
  {
    badge: "4 MONTHS FREE",
    title: "Internet + Phone + TV + Mobile",
    priceLeft: "All for only",
    price: 100,
    per: "/mo",
    bullets: [
      "500 Mbps Internet",
      "1 Business Phone line",
      "Business TV Stream",
      "1 included Unlimited Mobile line for 12 months",
      "3-year price guarantee available with upgrade to 750 Mbps or higher! "
    ],
    note: "Wireless speeds may vary",
  },
];

const connections = [
  {
    icon: <MdOutlineSpeed className="text-[#E8611A] text-6xl" />,
    title: "Internet",
    text: "Keep business humming with fast, reliable Internet for your small business.",
  },
  {
    icon: <FaHeadset className="text-[#E8611A] text-6xl" />,
    title: "Phone",
    text: "Keep the same telephone number. Advanced features and unlimited local & long distance.",
  },
  {
    icon: <FaMobileAlt className="text-[#E8611A] text-6xl" />,
    title: "Mobile",
    text: "Bring your number. Nationwide 5G on America’s most reliable network.",
  },
  {
    icon: <FaTv className="text-[#E8611A] text-6xl" />,
    title: "TV",
    text: "Entertain your customers with sports, news and more — at the price you want.",
  },
];

const why = [
  {
    img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1280&auto=format&fit=crop",
    title: "Superior Experience",
    bullets: [
      "The fastest, most reliable Internet",
      "Flexible plans and pricing",
      "Three-year price guarantees available",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1280&auto=format&fit=crop",
    title: "Exceptional Service",
    bullets: [
      "24/7 U.S.-based customer support",
      "Local technicians with same-day availability",
      "30-day money-back guarantee",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop",
    title: "Leading Technology",
    bullets: [
      "Fast, secure and reliable network",
      "Advanced Wi-Fi for speed & security",
      "Nationwide 5G with Business Mobile plans",
    ],
  },
];

const faqs = [
  {
    q: "What are the benefits of Spectrum Business?",
    a: "Fast, reliable Internet with no data caps, simple bundles, and 24/7 support built for small business.",
  },
  {
    q: "How do I figure out which Spectrum Business services I need?",
    a: "Start with the number of employees/devices and the apps you rely on; then choose the speed and voice/mobile add-ons that fit.",
  },
  {
    q: "Does Spectrum Business have contracts?",
    a: "No long-term contracts are required on most plans.",
  },
  {
    q: "Does Spectrum have data caps?",
    a: "No, Spectrum Internet plans have no data caps.",
  },
];

function BundleCard({ item }) {
  const showPhone = /phone/i.test(item.title);
  const showTV = /tv/i.test(item.title);
  const showMobile = /mobile/i.test(item.title);

  const sub = showMobile
    ? "Add Mobile with nationwide 5G so you can take your business anywhere."
    : showTV
    ? "Add TV for live news, sports and more to enhance your customer experience."
    : showPhone
    ? "Add Business Voice with advanced calling features and crystal-clear quality."
    : "Accelerate your business growth with fast, reliable Internet.";

  const isPricey = (t) => /\$\s*\d+/.test(t) || /included/i.test(t);
  const id = `bundle-${item.title.toLowerCase().replace(/\W+/g, "-")}`;

  return (
    <article
      aria-labelledby={id}
      className="group relative overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(30,24,20,0.07)] transition-[border-color,box-shadow] duration-300 hover:border-orange-200 hover:shadow-[0_26px_65px_rgba(196,78,18,0.12)] sm:p-7 lg:p-9"
    >
      <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#E8611A] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="grid items-start gap-8 md:grid-cols-[1fr_230px] lg:gap-12">
        <div className="flex flex-col gap-2">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-2xl text-[#C44E12] sm:text-3xl">
            <FaWifi aria-hidden />
            {(showPhone || showTV || showMobile) && (
              <span className="text-[#F47630] text-xl sm:text-2xl">+</span>
            )}
            {showPhone && <FaHeadset aria-hidden />}
            {showTV && (
              <>
                <span className="text-[#F47630] text-xl sm:text-2xl">+</span>
                <FaTv aria-hidden />
              </>
            )}
            {showMobile && (
              <>
                <span className="text-[#F47630] text-xl sm:text-2xl">+</span>
                <FaMobileAlt aria-hidden />
              </>
            )}
          </div>

          {item.badge && (
            <span className="mb-3 inline-flex w-fit rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-[#A83E0C] sm:text-xs">
              {item.badge}
            </span>
          )}

          <h3 id={id} className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-3xl">
            {item.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">{sub}</p>

          <ul className="mt-5 space-y-3">
            {item.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-6 text-neutral-700 sm:text-base">
                <FaCheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                <span className={isPricey(b) ? "font-semibold" : ""}>{b}</span>
              </li>
            ))}
          </ul>

          {item.note && <p className="mt-3 text-xs sm:text-sm text-gray-500">{item.note}</p>}
        </div>

        <div className="w-full rounded-[22px] border border-orange-100 bg-gradient-to-br from-[#fff8f3] to-white p-5 md:w-auto">
            <div>
              <p className="text-sm font-medium text-neutral-600">{item.priceLeft || "All for only"}</p>
              <div className="mt-1 flex items-end gap-1.5">
                <span className="text-4xl font-bold tracking-[-0.05em] text-neutral-950 lg:text-5xl">${item.price}</span>
                <span className="mb-1 text-sm font-medium text-neutral-600">{item.per || "/mo"}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">for 1 yr when bundled</p>
              <div className="mt-6">
                <Link
                  to="/checkout/spectrum-business"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#C44E12] px-6 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(196,78,18,0.22)] transition-colors hover:bg-[#9F390A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C44E12]"
                >
                  Book Now
                </Link>
              </div>
            </div>
        </div>
      </div>
    </article>
  );
}

export default function SpectrumBusinessReplica() {
  const [zipcode, setZipcode] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResults({ available: true, zipcode: zip });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#f5f2eb]">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20 sm:via-white/85 sm:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/45 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[650px] w-full max-w-[1440px] items-center px-5 py-20 sm:min-h-[700px] sm:px-10 lg:min-h-[760px] lg:px-16 xl:px-20">
          <div className="w-full max-w-[700px]">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-9 rounded-full bg-[#C44E12]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">Spectrum Business®</p>
            </div>
            <h1 className="text-[2.65rem] font-bold leading-[0.98] tracking-[-0.045em] text-[#171717] sm:text-[3.8rem] lg:text-[3.35rem]">
              Get <span className="text-[#C44E12]">4 Months FREE</span>
              <span className="mt-2 block">on Internet, Phone, Mobile and TV</span>
            </h1>
            <p className="mt-6 max-w-[610px] text-base leading-7 text-[#4B4B4B] sm:mt-7 sm:text-lg sm:leading-8">
              Bundle award-winning Internet with core business services for incredible savings. The more services you add, the more is free!
            </p>
            <div className="mt-6 flex flex-wrap items-end gap-x-2 gap-y-1 border-l-[3px] border-[#E8611A] pl-5">
              <span className="text-4xl font-bold tracking-[-0.04em] text-[#171717] sm:text-5xl">$39.99</span>
              <span className="mb-1 text-base font-medium text-[#555] sm:text-lg">/mo when bundled</span>
            </div>
            <p className="mt-3 max-w-[560px] text-xs leading-5 text-neutral-500">To receive the full discount, customers must maintain qualifying services for 25 months.</p>
            <div className="mt-8">
              <a href={TEL_HREF} className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-xl bg-[#C44E12] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(196,78,18,0.25)] transition-colors hover:bg-[#9F390A] sm:text-base">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15"><FaPhoneAlt className="text-sm" /></span>
                Call {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="hidden border-y border-orange-100 bg-[#fff8f3] py-6 md:block" aria-label="Customer satisfaction">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 px-4 py-3">
          <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] text-neutral-900 md:text-3xl">
            #1 in Customer Satisfaction for Internet Service
          </h2>
        </div>
      </section>

      {/* ZIP checker */}
      <section className="bg-white py-14 sm:py-16" aria-labelledby="zip-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center">
            <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C44E12] sm:text-xs">Check Your Area</span>
            <h2 id="zip-heading" className="text-center text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-4xl">
              Check availability by ZIP code
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mb-6 mt-7 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_16px_45px_rgba(30,24,20,0.08)] focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100 sm:max-w-2xl"
              role="search"
              aria-label="Check availability"
            >
              <label htmlFor="zipcode" className="sr-only">
                Enter ZIP code
              </label>
              <div className="flex items-stretch">
                <span className="pl-4 pr-4 flex items-center text-gray-700 bg-white" aria-hidden="true">
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
                  className="inline-flex min-w-16 items-center justify-center bg-[#C44E12] px-5 font-semibold text-white transition-colors hover:bg-[#9F390A] disabled:bg-[#D88C65] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C44E12]"
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
                <p id="zipcode-error" className="px-4 pb-3 text-sm text-[#E8611A]" role="alert">
                  {error}
                </p>
              )}
            </form>

            {results && (
              <div className="flex items-center justify-center flex-col py-6 text-green-600" aria-live="polite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>

                <span className="font-semibold text-xl md:text-2xl text-center">
                  Spectrum Business is available in {results.zipcode}
                </span>

                <button
                  type="button"
                  onClick={() => navigate("/customerbookingfrom", { state: { name: "Spectrum Business" } })}
                  className="mt-6 px-6 py-3 border border-slate-600 text-slate-600 hover:text-white font-semibold rounded-full hover:bg-[#C44E12] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing / Bundles */}
      <section id="pricing" className="relative overflow-hidden bg-[#faf9f7] py-14 sm:py-20 lg:py-24" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C44E12] sm:text-xs">Business Bundles</span>
          <h2 id="pricing-heading" className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
            Save with Flexible Pricing for Any Size Business
          </h2>
          <p className="mb-10 mt-4 max-w-3xl text-sm leading-7 text-neutral-600 sm:text-base">
            Get up to <span className="font-semibold">4 months free</span> when you include Internet with two Spectrum services.
          </p>

          <div className="hidden lg:grid lg:gap-6">
            {bundles.map((b, i) => (
              <BundleCard key={i} item={b} />
            ))}
          </div>

          <div className="lg:hidden">
            <Swiper spaceBetween={16} slidesPerView={1.1} loop>
              {bundles.map((b, i) => (
                <SwiperSlide key={i}>
                  <BundleCard item={b} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="py-12 md:py-16 text-center">
            <p className="text-2xl md:text-3xl text-gray-700 mb-4">Find the best plan for your business:</p>
            <a
              href={TEL_HREF}
              className="inline-flex items-center gap-2 text-xl font-semibold text-[#C44E12] hover:text-[#9F390A] md:text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C44E12]"
              aria-label={`Call ${PHONE}`}
            >
              <FaPhoneAlt /> {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Connections */}
      <section className="bg-white py-14 sm:py-20 lg:py-24" aria-labelledby="connections-heading">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <h2 id="connections-heading" className="mb-10 text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
            Connections Built for Your Small Business
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {connections.map((c, i) => (
              <div key={i} className="flex flex-col items-start rounded-[24px] border border-neutral-200/80 bg-white p-6 shadow-[0_16px_42px_rgba(30,24,20,0.06)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 [&>svg]:text-3xl" aria-hidden="true">{c.icon}</div>
                <h3 className="mt-5 text-xl font-semibold text-neutral-950">{c.title}</h3>
                <p className="mt-2 text-sm leading-7 text-neutral-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-[#faf9f7] py-14 sm:py-20 lg:py-24" aria-labelledby="why-heading">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C44E12] sm:text-xs">Why Spectrum</span>
          <h2 id="why-heading" className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
            Why Choose Spectrum Business?
          </h2>
          <p className="mb-10 mt-4 max-w-3xl text-sm leading-7 text-neutral-600 sm:text-base">
            We are committed to keeping you connected 100% of the time. Learn more about our solutions.
          </p>

          <div className="grid gap-7 md:grid-cols-3">
            {why.map((w, i) => (
              <article key={i} className="group overflow-hidden rounded-[26px] border border-neutral-200/80 bg-white shadow-[0_18px_48px_rgba(30,24,20,0.07)]">
                <img
                  src={w.img}
                  alt={w.title}
                  className="h-52 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-6 sm:p-7">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-2xl">{w.title}</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                    {w.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3">
                        <FaCheckCircle className="mt-1 shrink-0 text-emerald-600" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Learn more */}
      <section className="bg-white py-14 sm:py-20 lg:py-24" aria-labelledby="learn-heading">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 sm:px-8 md:grid-cols-2 lg:gap-16 lg:px-12">
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[28px] bg-orange-100/70" />
            <img
              src="https://img.freepik.com/free-photo/lady-browsing-laptop-table_23-2147953167.jpg"
              alt="Learn more resources"
              className="relative h-72 w-full rounded-[28px] object-cover shadow-[0_24px_65px_rgba(30,24,20,0.12)] md:h-[430px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <aside>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C44E12] sm:text-xs">Business Resources</span>
            <h3 id="learn-heading" className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
              Learn More About Launching Your Business
            </h3>
            <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
              Explore a library of free resources and tools built for new businesses.
            </p>
            <button
              type="button"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-[#C44E12] px-6 text-sm font-semibold text-[#C44E12] transition-colors hover:bg-[#C44E12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C44E12]"
              aria-label="Explore resources"
            >
              Explore resources
            </button>
          </aside>
        </div>
      </section>

      {/* Speak with a Specialist */}
      <section className="bg-[#faf9f7] py-14 sm:py-20 lg:py-24" aria-labelledby="specialist-heading">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-12">
          <h2 id="specialist-heading" className="text-center text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
            Speak with a Specialist
          </h2>
          <p className="mx-auto mb-10 mt-4 max-w-2xl text-center text-sm leading-7 text-neutral-600 sm:text-base">
            Contact us to speak with our U.S.-based team of small business specialists.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex h-full flex-col rounded-[26px] border border-neutral-200/80 bg-white p-7 text-center shadow-[0_18px_48px_rgba(30,24,20,0.07)] sm:p-9">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50"><FaPhoneAlt className="text-2xl text-[#C44E12]" aria-hidden /></span>
              <h3 className="mt-5 text-xl font-semibold text-neutral-950 sm:text-2xl">Call to Order Business Service</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-neutral-600">Available Monday – Friday, 8am – 5pm ET.</p>
              <a
                href={TEL_HREF}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#C44E12] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9F390A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C44E12]"
                aria-label={`Call ${PHONE}`}
              >
                {PHONE}
              </a>
            </div>

            <div className="flex h-full flex-col rounded-[26px] border border-neutral-200/80 bg-white p-7 text-center shadow-[0_18px_48px_rgba(30,24,20,0.07)] sm:p-9">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50"><FaHeadset className="text-2xl text-[#C44E12]" aria-hidden /></span>
              <h3 className="mt-5 text-xl font-semibold text-neutral-950 sm:text-2xl">We’ll Call You</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-neutral-600">
                Have one of our specialists contact you during business hours.
              </p>
              <button
                type="button"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl border border-[#C44E12] px-5 text-sm font-semibold text-[#C44E12] transition-colors hover:bg-[#C44E12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C44E12]"
                aria-label="Fill out contact form"
              >
                Fill out contact form
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="bg-white py-14 sm:py-20 lg:py-24" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-[920px] px-5 sm:px-8">
          <h2 id="faq-heading" className="mb-8 text-center text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="group overflow-hidden rounded-[20px] border border-neutral-200/80 bg-white shadow-[0_12px_35px_rgba(30,24,20,0.05)] open:border-orange-200">
                <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden sm:px-6">
                  <span className="text-sm leading-6 sm:text-base">{f.q}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-xl font-light text-neutral-600 transition-transform group-open:rotate-45 group-open:border-[#C44E12] group-open:bg-[#C44E12] group-open:text-white" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="border-t border-neutral-100 px-5 pb-6 pt-4 text-sm leading-7 text-neutral-600 sm:px-6">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 mt-6 leading-relaxed">
            *Pricing and promotions vary by location and availability. Taxes, fees and surcharges extra and subject to change.
            Internet speed based on wired connection. Wireless speeds may vary. Long-term guarantees available with select higher-speed plans.
            All trademarks are the property of their respective owners.
          </p>
        </div>
      </section>
    </div>
  );
}