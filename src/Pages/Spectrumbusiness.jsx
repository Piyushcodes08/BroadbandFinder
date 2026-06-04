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
    icon: <MdOutlineSpeed className="text-red-600 text-6xl" />,
    title: "Internet",
    text: "Keep business humming with fast, reliable Internet for your small business.",
  },
  {
    icon: <FaHeadset className="text-red-600 text-6xl" />,
    title: "Phone",
    text: "Keep the same telephone number. Advanced features and unlimited local & long distance.",
  },
  {
    icon: <FaMobileAlt className="text-red-600 text-6xl" />,
    title: "Mobile",
    text: "Bring your number. Nationwide 5G on America’s most reliable network.",
  },
  {
    icon: <FaTv className="text-red-600 text-6xl" />,
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
  const navigate = useNavigate();
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
      className="rounded-xl border bg-gradient-to-tr from-white via-red-50/10 to-slate-50 p-4 sm:p-6 md:p-8 md:h-min h-[650px]"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-10 items-start">
        <div className="flex flex-col gap-2">
          <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-6 text-red-600 text-2xl sm:text-3xl">
            <FaWifi aria-hidden />
            {(showPhone || showTV || showMobile) && (
              <span className="text-red-500 text-xl sm:text-2xl">+</span>
            )}
            {showPhone && <FaHeadset aria-hidden />}
            {showTV && (
              <>
                <span className="text-red-500 text-xl sm:text-2xl">+</span>
                <FaTv aria-hidden />
              </>
            )}
            {showMobile && (
              <>
                <span className="text-red-500 text-xl sm:text-2xl">+</span>
                <FaMobileAlt aria-hidden />
              </>
            )}
          </div>

          {item.badge && (
            <span className="w-fit inline-block bg-amber-400 text-gray-900 text-xs sm:text-sm md:text-base font-semibold tracking-wide px-2 sm:px-3 py-1 mb-3 rounded">
              {item.badge}
            </span>
          )}

          <h3 id={id} className="text-xl sm:text-2xl md:text-4xl font-semibold text-gray-800">
            {item.title}
          </h3>
          <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg">{sub}</p>

          <ul className="mt-4 space-y-2">
            {item.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-800 text-sm sm:text-base md:text-lg">
                <span className="mt-[6px] text-red-500">•</span>
                <span className={isPricey(b) ? "font-semibold" : ""}>{b}</span>
              </li>
            ))}
          </ul>

          {item.note && <p className="mt-3 text-xs sm:text-sm text-gray-500">{item.note}</p>}
        </div>

        <div className="w-full md:w-auto md:min-w-[200px] lg:min-w-[260px]">
          <div className="flex md:flex-col items-center md:items-start gap-4">
            <div className="hidden md:block w-[3px] h-full bg-gradient-to-b from-red-600 to-green-500 rounded" aria-hidden />
            <div className="text-center md:text-left">
              <p className="text-gray-700 text-sm sm:text-base font-medium">{item.priceLeft || "All for only"}</p>
              <div className="flex items-end justify-center md:justify-start gap-1 sm:gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">${item.price}</span>
                <span className="text-gray-700 text-sm sm:text-base font-medium">{item.per || "/mo"}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">for 1 yr when bundled</p>
              <div className="py-6 sm:py-8 md:py-10">
                <Link
                  to="/checkout/spectrum-business"
                  className="bg-red-600 hover:bg-red-500 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-md rounded-full w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                 
                  
                >
                  Book Now
                </Link>
              </div>
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
      <section
        className="relative bg-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop')",
        }}
        aria-label="Spectrum Business promotion"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-7xl grid lg:grid-cols-12 gap-6 items-center px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <p className="text-sm md:text-base tracking-[0.2em] font-semibold text-gray-600">SPECTRUM BUSINESS®</p>

            <h1 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-gray-900">
              Get <span className="text-red-700">4 Months FREE</span>
              <br className="hidden md:block" /> on Internet, Phone,
              <br className="hidden md:block" /> Mobile and TV
            </h1>

            <p className="mt-4 text-gray-600 max-w-xl text-lg md:text-2xl">
              Bundle award-winning Internet with core business services for incredible savings. The more services you add, the more is free!
            </p>

            <p className="mt-4 text-xs text-gray-500">
              To receive full discount, customer must maintain qualifying services for 25 months.
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex items-start">
                <span className="hidden sm:block h-12 w-[4px] rounded bg-gradient-to-b from-red-600 via-red-500 to-green-500 mr-3" aria-hidden />
                <div>
                  <p className="text-base font-semibold text-gray-800">Internet starting at</p>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-gray-900">$39.99</span>
                    <span className="text-gray-700 text-lg md:text-xl">/mo when bundled</span>
                  </div>
                </div>
              </div>

              <a
                href={TEL_HREF}
                className="inline-flex items-center gap-2 text-gray-800 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
                aria-label={`Call ${PHONE}`}
              >
                <FaPhoneAlt className="text-gray-700" />
                {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-red-50 py-6 hidden md:block" aria-label="Customer satisfaction">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-6 px-4 py-4 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug text-center">
            #1 in Customer Satisfaction for Internet Service
          </h2>
        </div>
      </section>

      {/* ZIP checker */}
      <section className="bg-gray-50" aria-labelledby="zip-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-center">
            <h2 id="zip-heading" className="text-gray-700 font-medium text-2xl md:text-3xl text-center">
              Check availability by ZIP code
            </h2>

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
                <p id="zipcode-error" className="px-4 pb-3 text-sm text-red-600" role="alert">
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
                  className="mt-6 px-6 py-3 border border-slate-600 text-slate-600 hover:text-white font-semibold rounded-full hover:bg-slate-700 transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing / Bundles */}
      <section id="pricing" className="py-8 sm:py-12 bg-gray-50" aria-labelledby="pricing-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="pricing-heading" className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            Save with Flexible Pricing for Any Size Business
          </h2>
          <p className="text-gray-600 mb-10">
            Get up to <span className="font-semibold">4 months free</span> when you include Internet with two Spectrum services.
          </p>

          <div className="hidden lg:grid lg:gap-4">
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
              className="inline-flex items-center gap-2 text-xl md:text-2xl font-semibold text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              aria-label={`Call ${PHONE}`}
            >
              <FaPhoneAlt /> {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Connections */}
      <section className="py-12" aria-labelledby="connections-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="connections-heading" className="text-2xl md:text-4xl font-semibold mb-10">
            Connections Built for Your Small Business
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {connections.map((c, i) => (
              <div key={i} className="border flex flex-col items-center justify-center bg-white rounded-xl p-6 shadow-sm">
                <div aria-hidden="true">{c.icon}</div>
                <h3 className="mt-4 font-semibold text-xl md:text-2xl">{c.title}</h3>
                <p className="mt-2 text-gray-600 text-center text-base md:text-lg">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-gray-50 py-12" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="why-heading" className="text-2xl md:text-5xl font-bold text-gray-800">
            Why Choose Spectrum Business?
          </h2>
          <p className="text-justify md:text-left text-lg md:text-2xl text-gray-600 mt-2 mb-10">
            We are committed to keeping you connected 100% of the time. Learn more about our solutions.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {why.map((w, i) => (
              <article key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border">
                <img
                  src={w.img}
                  alt={w.title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-6">
                  <h3 className="text-2xl md:text-3xl font-semibold">{w.title}</h3>
                  <ul className="mt-3 space-y-2 text-gray-700 text-base md:text-lg">
                    {w.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <FaCheckCircle className="text-green-600 mt-[3px]" aria-hidden />
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
      <section className="py-12" aria-labelledby="learn-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
          <img
            src="https://img.freepik.com/free-photo/lady-browsing-laptop-table_23-2147953167.jpg"
            alt="Learn more resources"
            className="h-64 md:h-96 w-full object-cover rounded-xl"
            loading="lazy"
            decoding="async"
          />
          <aside>
            <h3 id="learn-heading" className="text-3xl md:text-5xl font-semibold">
              Learn More About Launching Your Business
            </h3>
            <p className="text-gray-600 mt-3">
              Explore a library of free resources and tools built for new businesses.
            </p>
            <button
              type="button"
              className="mt-5 px-4 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-700 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              aria-label="Explore resources"
            >
              Explore resources
            </button>
          </aside>
        </div>
      </section>

      {/* Speak with a Specialist */}
      <section className="bg-gray-50 py-12" aria-labelledby="specialist-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="specialist-heading" className="text-3xl md:text-5xl font-bold">
            Speak with a Specialist
          </h2>
          <p className="mt-2 mb-10 text-lg md:text-2xl text-gray-600">
            Contact us to speak with our U.S.-based team of small business specialists.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm text-center flex flex-col h-full py-10">
              <FaPhoneAlt className="mx-auto text-red-700 text-5xl" aria-hidden />
              <h3 className="mt-3 font-semibold text-2xl">Call to Order Business Service</h3>
              <p className="text-gray-600 text-lg flex-1">Available Monday – Friday, 8am – 5pm ET.</p>
              <a
                href={TEL_HREF}
                className="mt-3 px-4 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-700 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                aria-label={`Call ${PHONE}`}
              >
                {PHONE}
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm text-center flex flex-col h-full py-10">
              <FaHeadset className="mx-auto text-red-700 text-5xl" aria-hidden />
              <h3 className="mt-3 font-semibold text-2xl">We’ll Call You</h3>
              <p className="text-gray-600 text-lg flex-1">
                Have one of our specialists contact you during business hours.
              </p>
              <button
                type="button"
                className="mt-3 px-4 py-2 border border-red-700 text-red-700 rounded-full hover:bg-red-700 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                aria-label="Fill out contact form"
              >
                Fill out contact form
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-12" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="divide-y border rounded-xl bg-white">
            {faqs.map((f, i) => (
              <details key={i} className="group p-4">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 list-none">
                  {f.q}
                  <span className="transition-transform group-open:rotate-180" aria-hidden>
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-gray-700">{f.a}</p>
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
