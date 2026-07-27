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
        {/* Background image */}
        <img
          src={heroBg}
          alt="Spectrum Business internet, phone, mobile and TV services"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center"
        />

        {/* Responsive image overlays */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#F8F6F1] via-[#F8F6F1]/95 to-[#F8F6F1]/45
            sm:via-[#F8F6F1]/10 sm:to-transparent
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
                Spectrum Business®
              </p>
            </div>

            {/* Main heading */}
            <h1 className="max-w-[680px] text-[clamp(2.8rem,6vw,3.7rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#171717]">
              Get 4 Months Free
              <span className="mt-2 block tracking-[-0.04em] text-orange-700">
                on Bundle Services.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[620px] text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8 lg:text-xl">
              Bundle award-winning Internet with essential business services and unlock incredible savings. The more services you add, the more you get free.
            </p>

            {/* Feature */}
            <div className="mt-7 flex max-w-[590px] items-start gap-4 border-l-2 border-orange-600 pl-5">
              <div>
                <p className="font-semibold text-neutral-900">
                  Plans starting at $39.99/mo
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600 sm:text-base">
                  When bundled. Fast Internet, Unlimited Phone, Mobile and TV.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={TEL_HREF}
                aria-label={`Call Spectrum Business at ${PHONE}`}
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

      {/* Trust band */}
      <section
        className="relative overflow-hidden border-y border-orange-100 bg-[#FFF8F3]"
        aria-labelledby="customer-satisfaction-title"
        data-aos="fade-up"
      >
  {/* Decorative background */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,97,26,0.10),transparent_65%)]"
  />

  <div className="relative mx-auto max-w-[1440px] px-5 py-7 sm:px-10 sm:py-9 lg:px-16">
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-6">
      
      {/* Ranking badge */}
      <div className="inline-flex shrink-0 items-center rounded-full border border-[#E8611A]/20 bg-white px-4 py-2 shadow-sm">
        <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#C44E12]">
          #1 Ranked
        </span>
      </div>

      {/* Divider */}
      <span
        aria-hidden="true"
        className="hidden h-10 w-px bg-orange-200 md:block"
      />

      {/* Content */}
      <div className="flex flex-col items-center gap-2 md:items-start md:text-left">
        <h2
          id="customer-satisfaction-title"
          className="text-xl font-bold leading-tight tracking-[-0.025em] text-[#1C1C1C] sm:text-2xl lg:text-[1.75rem]"
        >
          #1 in Customer Satisfaction for Internet Service
        </h2>

        <p className="max-w-2xl text-sm leading-6 text-neutral-600 sm:text-[15px]">
          Trusted business connectivity backed by reliable service and
          dedicated customer support.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* ZIP checker */}
      <section
        className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
        aria-labelledby="zip-heading"
        data-aos="fade-up"
      >
  {/* Decorative background */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(232,97,26,0.08),transparent_42%)]"
  />
  <div
    aria-hidden="true"
    className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl"
  />
  <div
    aria-hidden="true"
    className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-50 blur-3xl"
  />

  <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-3xl text-center">
      {/* Eyebrow */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Check Your Area
        </span>
        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="zip-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.75rem]"
      >
        Check availability by ZIP code
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Enter your business ZIP code to check whether Spectrum Business
        services are available in your area.
      </p>
    </div>

    {/* Search card */}
    <div className="mx-auto mt-9 max-w-3xl rounded-[1.75rem] border border-neutral-200/80 bg-white p-3 shadow-[0_20px_60px_rgba(30,24,20,0.10)] sm:mt-10 sm:p-4">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Check Spectrum Business availability"
      >
        <label
          htmlFor="zipcode"
          className="mb-2.5 block px-1 text-left text-sm font-semibold text-neutral-800"
        >
          Business ZIP code
        </label>

        <div
          className="
            flex min-h-[60px] items-stretch overflow-hidden rounded-xl
            border border-neutral-300 bg-white
            transition-all duration-200
            focus-within:border-[#E8611A]
            focus-within:ring-4 focus-within:ring-[#E8611A]/10
            sm:min-h-[66px]
          "
        >
          <span
            className="flex shrink-0 items-center justify-center pl-5 pr-3 text-neutral-500"
            aria-hidden="true"
          >
            <FaSearch className="h-[18px] w-[18px]" />
          </span>

          <input
            id="zipcode"
            name="zipcode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{5}"
            maxLength={5}
            value={zipcode}
            onChange={onZipChange}
            placeholder="Enter 5-digit ZIP code"
            className="
              min-w-0 flex-1 bg-transparent px-1 py-4
              text-base font-medium text-neutral-900 outline-none
              placeholder:font-normal placeholder:text-neutral-400
              sm:text-lg
            "
            aria-describedby={error ? "zipcode-error" : "zipcode-help"}
            aria-invalid={Boolean(error)}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              group m-1.5 inline-flex min-w-[58px] shrink-0 items-center
              justify-center rounded-lg bg-[#C44E12] px-5
              font-semibold text-white
              shadow-[0_8px_20px_rgba(196,78,18,0.20)]
              transition-all duration-300
              hover:bg-[#A83E0C]
              hover:shadow-[0_10px_25px_rgba(196,78,18,0.28)]
              disabled:cursor-not-allowed disabled:bg-[#D88C65]
              disabled:shadow-none
              focus-visible:outline-none focus-visible:ring-4
              focus-visible:ring-[#E8611A]/25
              sm:min-w-[145px] sm:gap-2
            "
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
                <FaSearch
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Check Now</span>
              </>
            )}
          </button>
        </div>

        <div className="min-h-[26px] px-1 pt-2">
          {error ? (
            <p
              id="zipcode-error"
              className="text-left text-sm font-medium text-red-600"
              role="alert"
            >
              {error}
            </p>
          ) : (
            <p
              id="zipcode-help"
              className="text-left text-xs leading-5 text-neutral-500 sm:text-sm"
            >
              We’ll use your ZIP code only to check local service availability.
            </p>
          )}
        </div>
      </form>
    </div>

    {/* Availability result */}
    {results && (
      <div
        className="
          mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl
          border border-emerald-200 bg-emerald-50/70
          shadow-[0_12px_35px_rgba(16,185,129,0.08)]
        "
        aria-live="polite"
      >
        <div className="flex flex-col items-center px-5 py-7 text-center sm:px-8 sm:py-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_8px_20px_rgba(5,150,105,0.22)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Service Available
          </p>

          <h3 className="mt-2 text-xl font-bold tracking-[-0.025em] text-neutral-900 sm:text-2xl">
            Spectrum Business is available in {results.zipcode}
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
            Continue to view your business service options and submit your
            booking request.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/customerbookingfrom", {
                state: { name: "Spectrum Business" },
              })
            }
            className="
              mt-6 inline-flex min-h-[52px] w-full items-center justify-center
              rounded-xl bg-[#C44E12] px-7 text-sm font-semibold text-white
              shadow-[0_10px_24px_rgba(196,78,18,0.22)]
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-[#A83E0C]
              hover:shadow-[0_14px_30px_rgba(196,78,18,0.28)]
              focus-visible:outline-none focus-visible:ring-4
              focus-visible:ring-[#E8611A]/25
              sm:w-auto sm:text-base
            "
          >
            Book Now
          </button>
        </div>
      </div>
    )}
  </div>
</section>

      {/* Pricing / Bundles */}
      <section
        id="pricing"
        className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
        aria-labelledby="pricing-heading"
        data-aos="fade-up"
      >
  {/* Background decoration */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(232,97,26,0.10),transparent_35%)]"
  />
  <div
    aria-hidden="true"
    className="absolute -left-28 top-1/3 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
  />
  <div
    aria-hidden="true"
    className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div className="mx-auto max-w-4xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Business Bundles
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="pricing-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Flexible plans built for every business
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Bundle Internet with two qualifying Spectrum services and receive up to{" "}
        <span className="font-semibold text-[#C44E12]">
          4 months free.
        </span>
      </p>
    </div>

    {/* Desktop cards */}
    <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-1 xl:mt-12">
      {bundles.map((bundle, index) => (
        <div
          key={bundle.id ?? index}
          data-aos="fade-up"
          data-aos-delay={index * 100}
          className="
            rounded-[1.75rem] border border-neutral-200/80 bg-white
            shadow-[0_18px_55px_rgba(35,27,22,0.07)]
            transition-all duration-300
            hover:-translate-y-1 hover:border-orange-200
            hover:shadow-[0_24px_65px_rgba(35,27,22,0.11)]
          "
        >
          <BundleCard item={bundle} />
        </div>
      ))}
    </div>

    {/* Mobile and tablet slider */}
    <div className="-mx-5 mt-9 sm:-mx-8 lg:hidden">
      <Swiper
        spaceBetween={16}
        slidesPerView={1.08}
        centeredSlides={false}
        grabCursor
        breakpoints={{
          640: {
            slidesPerView: 1.35,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1.7,
            spaceBetween: 22,
          },
        }}
        className="!px-5 !pb-8 sm:!px-8"
      >
        {bundles.map((bundle, index) => (
          <SwiperSlide key={bundle.id ?? index} className="h-auto">
            <div
              className="
                h-full overflow-hidden rounded-2xl border
                border-neutral-200/80 bg-white
                shadow-[0_14px_40px_rgba(35,27,22,0.08)]
              "
            >
              <BundleCard item={bundle} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    {/* Consultation CTA */}
    <div
      data-aos="fade-up"
      className="
        relative mt-10 overflow-hidden rounded-[1.75rem]
        border border-orange-100 bg-white
        px-5 py-8 text-center
        shadow-[0_18px_50px_rgba(35,27,22,0.07)]
        sm:px-8 sm:py-10 lg:mt-12
      "
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,97,26,0.08),transparent_68%)]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center">
        <span
          className="
            inline-flex rounded-full border border-orange-200
            bg-[#FFF7F2] px-4 py-2
            text-[10px] font-bold uppercase tracking-[0.18em]
            text-[#A83E0C] sm:text-xs
          "
        >
          Need help choosing?
        </span>

        <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#1A1A1A] sm:text-3xl">
          Find the right plan for your business
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
          Speak with a business specialist to compare services, pricing and
          bundle options available in your area.
        </p>

        <a
          href={TEL_HREF}
          aria-label={`Call a business specialist at ${PHONE}`}
          className="
            group mt-6 inline-flex min-h-[56px] w-full items-center
            justify-center gap-3 rounded-xl bg-[#C44E12] px-7
            text-sm font-semibold text-white
            shadow-[0_12px_28px_rgba(196,78,18,0.24)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:bg-[#A83E0C]
            hover:shadow-[0_16px_34px_rgba(196,78,18,0.30)]
            focus-visible:outline-none focus-visible:ring-4
            focus-visible:ring-[#E8611A]/25
            sm:w-auto sm:text-base
          "
        >
          <span
            className="
              flex h-9 w-9 items-center justify-center rounded-lg
              bg-white/15 transition-colors group-hover:bg-white/20
            "
          >
            <FaPhoneAlt className="text-sm" aria-hidden="true" />
          </span>

          Call {PHONE}
        </a>

        <p className="mt-3 text-xs text-neutral-500">
          Talk directly with a business connectivity specialist
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Connections */}
      <section
        className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
        aria-labelledby="connections-heading"
        data-aos="fade-up"
      >
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(232,97,26,0.07),transparent_32%)]"
  />
  <div
    aria-hidden="true"
    className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Business Connectivity
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="connections-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Connections built for your small business
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Reliable connectivity solutions designed to keep your team productive,
        your customers connected and your business moving forward.
      </p>
    </div>

    {/* Feature cards */}
    <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-4">
      {connections.map((connection, index) => (
        <article
          key={connection.id ?? index}
          data-aos="fade-up"
          data-aos-delay={index * 100}
          className="
            group relative flex min-h-[280px] flex-col overflow-hidden
            rounded-[1.5rem] border border-neutral-200/80 bg-white p-6
            shadow-[0_16px_45px_rgba(30,24,20,0.06)]
            transition-all duration-300
            hover:-translate-y-1.5 hover:border-orange-200
            hover:shadow-[0_24px_60px_rgba(30,24,20,0.11)]
            sm:p-7
          "
        >
          {/* Hover glow */}
          <div
            aria-hidden="true"
            className="
              absolute -right-16 -top-16 h-36 w-36 rounded-full
              bg-orange-100/70 blur-3xl
              transition-all duration-500
              group-hover:scale-150 group-hover:bg-orange-200/60
            "
          />

          {/* Top accent */}
          <span
            aria-hidden="true"
            className="
              absolute inset-x-6 top-0 h-[3px] origin-left
              scale-x-0 rounded-b-full bg-[#E8611A]
              transition-transform duration-300
              group-hover:scale-x-100
            "
          />

          {/* Icon */}
          <div
            className="
              relative flex h-14 w-14 shrink-0 items-center justify-center
              rounded-2xl border border-orange-100 bg-[#FFF5EE]
              text-[#C44E12]
              shadow-[0_8px_20px_rgba(232,97,26,0.10)]
              transition-all duration-300
              group-hover:-rotate-3 group-hover:scale-105
              group-hover:border-[#E8611A]/30 group-hover:bg-white
              group-hover:text-black
              [&>svg]:h-6 [&>svg]:w-6
            "
            aria-hidden="true"
          >
            {connection.icon}
          </div>

          {/* Content */}
          <div className="relative mt-6">
            <h3 className="text-xl font-bold leading-snug tracking-[-0.025em] text-[#1A1A1A]">
              {connection.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-neutral-600">
              {connection.text}
            </p>
          </div>

          {/* Card number */}
          <span
            aria-hidden="true"
            className="
              relative mt-auto pt-6 text-xs font-bold
              tracking-[0.16em] text-neutral-300
              transition-colors duration-300
              group-hover:text-[#C44E12]
            "
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </article>
      ))}
    </div>

    {/* Supporting trust line */}
    <div className="mt-9 flex justify-center sm:mt-10" data-aos="fade-up">
      <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-center text-xs font-medium text-neutral-600 shadow-sm sm:text-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Flexible solutions with dependable business support
      </p>
    </div>
  </div>
</section>

      {/* Why Choose */}
      <section
        className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
        aria-labelledby="why-heading"
        data-aos="fade-up"
      >
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(232,97,26,0.09),transparent_34%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Why Spectrum
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="why-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Why choose Spectrum Business?
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Reliable connectivity, dedicated support and flexible solutions
        designed to keep your business moving forward.
      </p>
    </div>

    {/* Cards */}
    <div className="mt-10 grid gap-6 md:grid-cols-3 lg:mt-12 lg:gap-7">
      {why.map((item, index) => (
        <article
          key={item.id ?? index}
          data-aos="fade-up"
          data-aos-delay={index * 150}
          className="
            group relative flex h-full flex-col overflow-hidden
            rounded-[1.75rem] border border-neutral-200/80 bg-white
            shadow-[0_18px_50px_rgba(30,24,20,0.07)]
            transition-all duration-500
            hover:-translate-y-1.5 hover:border-orange-200
            hover:shadow-[0_26px_65px_rgba(30,24,20,0.13)]
          "
        >
          {/* Image */}
          <div className="relative h-56 overflow-hidden sm:h-60 md:h-52 xl:h-60">
            <img
              src={item.img}
              alt={item.title}
              className="
                h-full w-full object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-[1.06]
              "
              loading="lazy"
              decoding="async"
            />

            {/* Image overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#E8611A]/0 transition-colors duration-500 group-hover:bg-[#E8611A]/5"
            />

            {/* Card number */}
            <span
              aria-hidden="true"
              className="
                absolute left-5 top-5 inline-flex h-10 min-w-10
                items-center justify-center rounded-full
                border border-white/30 bg-black/25 px-3
                text-xs font-bold tracking-[0.12em] text-white
                shadow-lg backdrop-blur-md
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Image title */}
            <h3
              className="
                absolute inset-x-5 bottom-5
                text-xl font-bold leading-snug tracking-[-0.025em]
                text-white drop-shadow-md sm:text-2xl
              "
            >
              {item.title}
            </h3>
          </div>

          {/* Card content */}
          <div className="relative flex flex-1 flex-col p-6 sm:p-7">
            {/* Accent line */}
            <span
              aria-hidden="true"
              className="
                absolute left-6 top-0 h-[3px] w-12 rounded-full
                bg-[#E8611A] transition-all duration-300
                group-hover:w-20 sm:left-7
              "
            />

            <ul className="space-y-4 text-sm leading-6 text-neutral-700">
              {item.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="flex items-start gap-3">
                  <span
                    className="
                      mt-0.5 flex h-6 w-6 shrink-0 items-center
                      justify-center rounded-full bg-emerald-50
                      text-emerald-600
                    "
                  >
                    <FaCheckCircle
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </span>

                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>

    {/* Bottom trust message */}
    <div className="mt-10 flex justify-center lg:mt-12" data-aos="fade-up">
      <div
        className="
          flex max-w-3xl flex-col items-center gap-3 rounded-2xl
          border border-orange-100 bg-white px-5 py-4 text-center
          shadow-[0_10px_30px_rgba(30,24,20,0.05)]
          sm:flex-row sm:px-6 sm:text-left
        "
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF2E9]"
        >
          <FaCheckCircle className="h-5 w-5 text-[#C44E12]" />
        </span>

        <p className="text-sm font-medium leading-6 text-neutral-700 sm:text-[15px]">
          Business connectivity backed by dependable service and
          around-the-clock customer support.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Learn more */}
      <section
        className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
        aria-labelledby="learn-heading"
        data-aos="fade-up"
      >
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,rgba(232,97,26,0.08),transparent_34%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
    <div
      className="
        grid items-center gap-10 overflow-hidden rounded-[2rem]
        border border-neutral-200/80 bg-[#FAF8F5]
        p-4 shadow-[0_24px_70px_rgba(30,24,20,0.08)]
        md:grid-cols-[1.04fr_0.96fr] md:p-6
        lg:gap-14 lg:p-8 xl:gap-20
      "
    >
      {/* Image */}
      <div className="group relative min-h-[330px] overflow-hidden rounded-[1.5rem] sm:min-h-[400px] md:h-full md:min-h-[470px]">
        <img
          src="https://img.freepik.com/free-photo/lady-browsing-laptop-table_23-2147953167.jpg"
          alt="Business owner exploring resources on a laptop"
          className="
            absolute inset-0 h-full w-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-[1.04]
          "
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

        {/* Floating label */}
        <div
          className="
            absolute bottom-5 left-5 right-5 rounded-2xl
            border border-white/25 bg-white/90 p-4
            shadow-[0_14px_35px_rgba(0,0,0,0.14)]
            backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[310px]
          "
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C44E12] text-sm font-bold text-white">
              01
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A83E0C]">
                Free Business Guides
              </p>

              <p className="mt-1 text-sm font-semibold leading-5 text-neutral-900">
                Practical insights for every stage of growth
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <aside className="px-2 pb-5 sm:px-4 md:px-2 md:py-8 lg:pr-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-9 bg-[#E8611A]" />

          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
            Business Resources
          </span>
        </div>

        <h2
          id="learn-heading"
          className="
            max-w-xl text-3xl font-bold leading-[1.08]
            tracking-[-0.04em] text-[#171717]
            sm:text-4xl lg:text-[2.8rem]
          "
        >
          Learn more about launching and growing your business
        </h2>

        <p className="mt-5 max-w-xl text-[15px] leading-7 text-neutral-600 sm:text-base">
          Explore free guides, practical tools and expert resources designed to
          help you plan, launch and confidently grow your business.
        </p>

        {/* Resource highlights */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
          {[
            "Business planning guides",
            "Growth-focused tools",
            "Connectivity insights",
            "Expert support resources",
          ].map((resource) => (
            <div
              key={resource}
              className="
                flex items-center gap-3 rounded-xl border
                border-neutral-200 bg-white px-4 py-3
                text-sm font-medium text-neutral-700
                shadow-[0_6px_18px_rgba(30,24,20,0.04)]
              "
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100"
              >
                <span className="h-2 w-2 rounded-full bg-[#C44E12]" />
              </span>

              {resource}
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Explore business resources"
          className="
            group mt-8 inline-flex min-h-[56px] w-full items-center
            justify-center gap-3 rounded-xl bg-[#C44E12] px-7
            text-sm font-semibold text-white
            shadow-[0_12px_28px_rgba(196,78,18,0.24)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:bg-[#A83E0C]
            hover:shadow-[0_16px_34px_rgba(196,78,18,0.30)]
            focus-visible:outline-none focus-visible:ring-4
            focus-visible:ring-[#E8611A]/25
            sm:w-auto sm:text-base
          "
        >
          Explore Resources

          <span
            aria-hidden="true"
            className="text-lg transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </aside>
    </div>
  </div>
</section>

      {/* Speak with a Specialist */}
      <section
        className="relative isolate overflow-hidden bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
        aria-labelledby="specialist-heading"
        data-aos="fade-up"
      >
  {/* Background decoration */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.10),transparent_42%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-28 top-20 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-12">
    {/* Heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Expert Assistance
        </span>

        <span className="h-px w-8 bg-[#E8611A]" />
      </div>

      <h2
        id="specialist-heading"
        className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[2.8rem]"
      >
        Speak with a business specialist
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 sm:text-base">
        Connect with our U.S.-based small business team for personalized help
        with services, pricing and availability.
      </p>
    </div>

    {/* Contact cards */}
    <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-12">
      {/* Call card */}
      <article
        data-aos="fade-right"
        className="
          group relative flex min-h-[390px] flex-col overflow-hidden
          rounded-[1.75rem] border border-neutral-200/80 bg-white p-7
          shadow-[0_18px_50px_rgba(30,24,20,0.07)]
          transition-all duration-300
          hover:-translate-y-1 hover:border-orange-200
          hover:shadow-[0_26px_65px_rgba(30,24,20,0.12)]
          sm:p-8 lg:p-9
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute -right-16 -top-16 h-44 w-44 rounded-full
            bg-orange-100/60 blur-3xl transition-transform duration-500
            group-hover:scale-125
          "
        />

        <div className="relative flex flex-1 flex-col items-center text-center">
          <span
            className="
              flex h-16 w-16 items-center justify-center rounded-2xl
              border border-orange-100 bg-[#FFF4EC] text-[#C44E12]
              shadow-[0_10px_25px_rgba(232,97,26,0.12)]
              transition-all duration-300
              group-hover:-rotate-3 group-hover:scale-105
              group-hover:bg-[#C44E12] group-hover:text-white
            "
            aria-hidden="true"
          >
            <FaPhoneAlt className="h-6 w-6" />
          </span>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A83E0C] sm:text-xs">
            Speak Directly
          </p>

          <h3 className="mt-2 text-xl font-bold leading-snug tracking-[-0.025em] text-[#171717] sm:text-2xl">
            Call to order business service
          </h3>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-neutral-600">
            Talk with a specialist for help selecting and ordering the right
            services for your business.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-600">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-emerald-500"
            />
            Monday–Friday, 8 AM–5 PM ET
          </div>

          <a
            href={TEL_HREF}
            aria-label={`Call a business specialist at ${PHONE}`}
            className="
              mt-auto inline-flex min-h-[56px] w-full items-center
              justify-center gap-3 rounded-xl bg-[#C44E12] px-6 pt-0
              text-sm font-semibold text-white
              shadow-[0_12px_28px_rgba(196,78,18,0.24)]
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-[#A83E0C]
              hover:shadow-[0_16px_34px_rgba(196,78,18,0.30)]
              focus-visible:outline-none focus-visible:ring-4
              focus-visible:ring-[#E8611A]/25 sm:text-base
            "
          >
            <FaPhoneAlt className="h-4 w-4" aria-hidden="true" />
            Call {PHONE}
          </a>
        </div>
      </article>

      {/* Callback card */}
      <article
        data-aos="fade-left"
        className="
          group relative flex min-h-[390px] flex-col overflow-hidden
          rounded-[1.75rem] border border-neutral-200/80 bg-white p-7
          shadow-[0_18px_50px_rgba(30,24,20,0.07)]
          transition-all duration-300
          hover:-translate-y-1 hover:border-orange-200
          hover:shadow-[0_26px_65px_rgba(30,24,20,0.12)]
          sm:p-8 lg:p-9
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute -right-16 -top-16 h-44 w-44 rounded-full
            bg-orange-100/60 blur-3xl transition-transform duration-500
            group-hover:scale-125
          "
        />

        <div className="relative flex flex-1 flex-col items-center text-center">
          <span
            className="
              flex h-16 w-16 items-center justify-center rounded-2xl
              border border-orange-100 bg-[#FFF4EC] text-[#C44E12]
              shadow-[0_10px_25px_rgba(232,97,26,0.12)]
              transition-all duration-300
              group-hover:rotate-3 group-hover:scale-105
              group-hover:bg-[#C44E12] group-hover:text-white
            "
            aria-hidden="true"
          >
            <FaHeadset className="h-7 w-7" />
          </span>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A83E0C] sm:text-xs">
            Request a Callback
          </p>

          <h3 className="mt-2 text-xl font-bold leading-snug tracking-[-0.025em] text-[#171717] sm:text-2xl">
            We’ll call you
          </h3>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-neutral-600">
            Share your contact details and one of our specialists will reach
            out during regular business hours.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-600">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-emerald-500"
            />
            Quick and convenient
          </div>

          <button
            type="button"
            aria-label="Open the specialist contact form"
            className="
              mt-auto inline-flex min-h-[56px] w-full items-center
              justify-center gap-3 rounded-xl border-2 border-[#C44E12]
              bg-white px-6 text-sm font-semibold text-[#C44E12]
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-[#C44E12]
              hover:text-white
              hover:shadow-[0_14px_30px_rgba(196,78,18,0.22)]
              focus-visible:outline-none focus-visible:ring-4
              focus-visible:ring-[#E8611A]/20 sm:text-base
            "
          >
            Fill Out Contact Form
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </div>
      </article>
    </div>

    {/* Trust message */}
    <p className="mt-7 flex items-center justify-center gap-2 text-center text-xs leading-5 text-neutral-500 sm:text-sm" data-aos="fade-up">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-[#E8611A]"
      />
      Personalized assistance with no obligation
    </p>
  </div>
</section>

      {/* FAQs */}
      <section
        id="faq"
        className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
        aria-labelledby="faq-heading"
        data-aos="fade-up"
      >
  {/* Background accents */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,97,26,0.08),transparent_38%)]"
  />

  <div
    aria-hidden="true"
    className="absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
  />

  <div className="relative mx-auto max-w-[960px] px-5 sm:px-8">
    {/* Heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#E8611A]" />

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C] sm:text-xs">
          Help Center
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
        Find clear answers about business internet, pricing, availability and
        service options.
      </p>
    </div>

    {/* Accordion */}
    <div className="mt-10 space-y-3 sm:mt-12 sm:space-y-4">
      {faqs.map((faq, index) => (
        <details
          key={faq.id ?? index}
          data-aos="fade-up"
          data-aos-delay={index * 50}
          className="
            group relative overflow-hidden rounded-2xl border
            border-neutral-200/80 bg-white
            shadow-[0_10px_35px_rgba(30,24,20,0.05)]
            transition-all duration-300
            hover:border-orange-200
            hover:shadow-[0_16px_45px_rgba(30,24,20,0.08)]
            open:border-orange-200
            open:shadow-[0_18px_50px_rgba(196,78,18,0.10)]
          "
        >
          {/* Open-state accent */}
          <span
            aria-hidden="true"
            className="
              absolute bottom-0 left-0 top-0 w-1
              origin-top scale-y-0 bg-[#E8611A]
              transition-transform duration-300
              group-open:scale-y-100
            "
          />

          <summary
            className="
              flex min-h-[76px] cursor-pointer list-none items-center
              gap-4 px-5 py-4
              [&::-webkit-details-marker]:hidden
              sm:min-h-[82px] sm:gap-5 sm:px-6
            "
          >
            {/* Question number */}
            <span
              aria-hidden="true"
              className="
                hidden h-9 w-9 shrink-0 items-center justify-center
                rounded-xl bg-neutral-100 text-[11px] font-bold
                tracking-[0.08em] text-neutral-400
                transition-colors duration-300
                group-open:bg-[#FFF0E6] group-open:text-[#C44E12]
                sm:flex
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span
              className="
                flex-1 text-left text-sm font-semibold leading-6
                text-neutral-900 transition-colors duration-300
                group-open:text-[#A83E0C] sm:text-base
              "
            >
              {faq.q}
            </span>

            {/* Plus icon */}
            <span
              aria-hidden="true"
              className="
                relative flex h-10 w-10 shrink-0 items-center justify-center
                rounded-full border border-neutral-200 bg-[#FFFFFF]
                text-neutral-600 shadow-sm
                transition-all duration-300
                group-hover:border-orange-200 group-hover:text-[#C44E12]
                group-open:rotate-45 group-open:border-[#C44E12]
                group-open:bg-[#C44E12] group-open:text-white
                group-open:shadow-[0_8px_18px_rgba(196,78,18,0.22)]
              "
            >
              <span className="absolute h-[2px] w-4 rounded-full bg-current" />
              <span className="absolute h-4 w-[2px] rounded-full bg-current" />
            </span>
          </summary>

          {/* Answer */}
          <div className="px-5 pb-6 sm:px-[5.25rem] sm:pb-7">
            <div className="border-t border-neutral-100 pt-4">
              <p className="text-sm leading-7 text-neutral-600 sm:text-[15px]">
                {faq.a}
              </p>
            </div>
          </div>
        </details>
      ))}
    </div>

    {/* Legal disclosure */}
    <div
      className="
        mt-8 rounded-2xl border border-neutral-200/80
        bg-[#FAF8F5] px-5 py-5 sm:px-6
      "
      data-aos="fade-up"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="
            mt-0.5 flex h-6 w-6 shrink-0 items-center
            justify-center rounded-full bg-white
            text-xs font-bold text-[#C44E12] shadow-sm
          "
        >
          i
        </span>

        <p className="text-[11px] leading-5 text-neutral-500 sm:text-xs sm:leading-6">
          Pricing and promotions vary by location and availability. Taxes, fees
          and surcharges are extra and subject to change. Internet speeds are
          based on a wired connection; wireless speeds may vary. Long-term
          guarantees are available with select higher-speed plans. All
          trademarks remain the property of their respective owners.
        </p>
      </div>
    </div>

    {/* Support CTA */}
    <div className="mt-8 text-center" data-aos="fade-up">
      <p className="text-sm text-neutral-600">
        Still have questions?{" "}
        <a
          href={TEL_HREF}
          aria-label={`Call a business specialist at ${PHONE}`}
          className="
            font-semibold text-[#C44E12] underline
            decoration-orange-200 underline-offset-4
            transition-colors hover:text-[#A83E0C]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#E8611A]/30
          "
        >
          Speak with a specialist
        </a>
      </p>
    </div>
  </div>
</section>
    </div>
  );
}