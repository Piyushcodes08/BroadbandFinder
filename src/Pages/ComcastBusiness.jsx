import React, { useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaShieldAlt,
  FaWifi,
  FaCloud,
  FaSearch,
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
          imgFirst ? "flex flex-col gap-3" : "md:order-1 flex flex-col gap-3"
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
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop')",
          height: "450px",
        }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-white" data-aos="fade-right">
          <h1 className="text-sm font-medium tracking-wide">
            BUSINESS INTERNET
          </h1>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold leading-tight">
            Internet that works as hard as you
          </h2>
          <p className="mt-4 text-gray-200 max-w-2xl">
            Power all your devices with fast, reliable Business Internet and
            24/7 support.
          </p>
          <a
            href="tel:18557442407"
            className="mt-6 inline-block px-6 py-3 rounded-full bg-[#C44E12] text-white font-semibold hover:bg-[#712C09]"
          >
            1-855 744 2407
          </a>
        </div>
      </section>

      {/* ZIP CHECK */}
      <section className="bg-gray-50 py-12" data-aos="fade-up">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">
            Check availability by ZIP code
          </h3>

          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:w-3/4 md:w-1/2 mx-auto flex rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
            role="search"
            aria-label="Check availability"
          >
            <label htmlFor="zipcode" className="sr-only">
              Enter ZIP code
            </label>
            <input
              id="zipcode"
              inputMode="numeric"
              maxLength={5}
              value={zipcode}
              onChange={(e) =>
                setZipcode(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              placeholder="Enter ZIP code"
              className="flex-1 px-4 py-3 text-lg outline-none"
              aria-invalid={!!error}
            />
            <button
              type="submit"
              className="px-5 bg-[#C44E12] text-white font-semibold hover:bg-[#712C09]"
              aria-label="Search by ZIP code"
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-[#C44E12]" role="alert">
              {error}
            </p>
          )}

          {results && (
            <div
              className="mt-8 text-green-600 font-semibold"
              role="status"
              aria-live="polite"
            >
              Comcast Business is available in {results.zipcode}
              <div className="mt-4">
                <button
                  onClick={handleBook}
                  className="px-6 py-2 rounded-full border border-[#C44E12] text-[#C44E12] hover:bg-[#C44E12] hover:text-white transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SPEED SELECTOR */}
    <section className="py-12" data-aos="fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="The internet speed your business needs"
          sub="The speeds and features most businesses choose—built to grow with you."
        />

        {/* Desktop grid */}
        <div className="hidden xl:grid grid-cols-5 gap-6 mt-8" data-aos="fade-up">
          {SPEED_PLANS.map((p, i) => (
            <SpeedCard
              key={p.title}
              plan={p}
              active={i === activeIdx}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>

        {/* Mobile Swiper carousel */}
        <div className="xl:hidden mt-8" data-aos="fade-up">
          <Swiper
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={true}
            loop
            navigation={{
              prevEl: ".speed-prev",
              nextEl: ".speed-next",
            }}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
          >
            {SPEED_PLANS.map((p, i) => (
              <SwiperSlide key={p.title}>
                <SpeedCard
                  plan={p}
                  active={i === activeIdx}
                  onClick={() => setActiveIdx(i)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <div className="flex items-center justify-between mt-4 px-1">
            <button
              className="speed-prev inline-flex items-center justify-center w-9 h-9 rounded-full border bg-white shadow hover:bg-gray-50"
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <div className="text-sm text-gray-600">
              {activeIdx + 1} / {SPEED_PLANS.length}
            </div>
            <button
              className="speed-next inline-flex items-center justify-center w-9 h-9 rounded-full border bg-white shadow hover:bg-gray-50"
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>

      {/* HELP CTA */}
      <section className="py-6" data-aos="zoom-in">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="rounded-xl bg-white border border-gray-200 p-10 sm:p-14 text-center">
            <p className="text-xl sm:text-2xl font-semibold">
              Want help choosing a plan?
            </p>
            <div className="mt-4">
              <a
                href="tel:18557442407"
                className="px-6 py-2 rounded-full border border-[#C44E12] text-[#C44E12] hover:bg-[#FEF3EC] font-semibold text-md"
              >
                ContactUs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-semibold">
              Your solutions working better — together
            </h2>
            <p className="mt-2 text-gray-600">
              Keep teams productive using a stack of solutions designed for
              great connection, on your network and on the go.
            </p>
          </div>

          <div className="mt-10 space-y-16 md:space-y-20">
            {SOLUTIONS.map((s, i) => (
              <SolutionRow key={s.title} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* VALUE TILES */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {VALUE_TILES.map((t, i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-gray-200 p-10 text-center flex flex-col items-center"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="text-5xl text-[#C44E12]">{t.icon}</div>
              <h4 className="mt-3 font-semibold text-2xl">{t.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{t.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALL-IN-ONE MGMT */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1.05fr_1fr] gap-8 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">
                All-in-one solution
                <br className="hidden sm:block" />
                management
              </h2>

              <p className="mt-4 text-[15px] text-gray-700 max-w-xl">
                Manage all aspects of your account—from connection status to
                billing—in one place.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-4 text-[15px]">
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <FaCheck className="mt-1 text-[#C44E12] shrink-0" />
                    <span>
                      Monitor the status of your connection and services
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="mt-1 text-[#C44E12] shrink-0" />
                    <span>
                      Manage settings on your public and private WiFi networks
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="mt-1 text-[#C44E12] shrink-0" />
                    <span>
                      Access and control add-ons like Connection Pro, WiFi Pro,
                      and SecurityEdge™
                    </span>
                  </li>
                </ul>

                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <FaCheck className="mt-1 text-[#C44E12] shrink-0" />
                    <span>
                      Compare data usage from the past 7, 30, or 6 months
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="mt-1 text-[#C44E12] shrink-0" />
                    <span>
                      Troubleshoot, restart, and test the speed of your gateway
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="mt-1 text-[#C44E12] shrink-0" />
                    <span>
                      View your bill, get recommendations, and chat with a live
                      agent
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div data-aos="fade-left">
              <img
                src="https://cdn.prod.website-files.com/65b7981897ba2e51087129d0/65ce4486cde877e511559ea6_AdobeStock_419881291.webp"
                alt="Managing service from a mobile app"
                className="w-full h-[420px] sm:h-[500px] object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900">
            Our team of experts is ready to help
          </h2>
          <p className="mt-3 text-center text-gray-600">
            Whether you have questions or need on-site support, we’ve got you
            covered.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <article className="rounded-xl overflow-hidden border border-gray-200 bg-white" data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1682345262055-8f95f3c513ea?q=80&w=1170&auto=format&fit=crop"
                alt="Technicians installing service"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="p-8 text-center">
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Fast, convenient installation
                </h3>
                <p className="mt-2 text-gray-600">
                  Get timely professional installation windows when you check
                  out — even online.
                </p>
              </div>
            </article>

            <article className="rounded-xl overflow-hidden border border-gray-200 bg-white" data-aos="fade-left">
              <img
                src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop"
                alt="Support representative on headset"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="p-8 text-center">
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Support when you need it
                </h3>
                <p className="mt-2 text-gray-600">
                  Get help from experts in your area, plus 24/7 support via
                  phone or chat.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
