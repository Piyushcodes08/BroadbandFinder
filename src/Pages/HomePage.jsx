import { useEffect, useRef, useState } from "react";
import { FaPhoneAlt, FaRegUserCircle, FaStar, FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Att from "../assets/att.png";
import BandWidth from "../assets/bandwidth.png";
import Comcast from "../assets/comcast.png";
import Home1 from "../assets/24x7 bg.png";
import Home2 from "../assets/home2.jpeg";
import Home3 from "../assets/home3.jpeg";
import Home4 from "../assets/home4.jpeg";
import Home5 from "../assets/home5.jpeg";
import Spectrum from "../assets/spectrum.png";
import SpeedoMeter from "../assets/speedometer.png";
import PlaceHolder from "../assets/placeholder.png";
import Acc from "../assets/Acc.png";

import { testimonials } from "../data/testimonial";
import { TiTick, TiArrowLeft, TiArrowRight } from "react-icons/ti";
import { Helmet } from "react-helmet-async";

import BandwidthCalculatorModal from "../Components/BandwidthCalculatorModal";
import SpeedTestEmbed from "../Components/SpeedTestEmbed";
import { PROVIDER_META } from "../data/PROVIDER_META";
import { PROVIDER_DETAILS } from "../data/PROVIDER_DETAILS";

/* ------------------------------ Helpers ------------------------------ */

const PHONE = "1-855-744-2407";
const normalize = (s = "") => s.toLowerCase().trim();

const VOIP_PROVIDERS = [
  { name: "ACC Business", typeName: "ACC Business" },
  { name: "RingCentral", typeName: "RingCentral" },
  { name: "Spectrum VoIP", typeName: "Spectrum VoIP" },
];

/* ----------------------------- Main Page ------------------------------ */

export default function BusinessInternetPage() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [selectedZip, setSelectedZip] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSugIdx, setActiveSugIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsProvider, setDetailsProvider] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(2);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const abortRef = useRef(null);
  const reqIdRef = useRef(0);
  const sugTimeout = useRef(null);

  // Floating CTA scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to determine items per slide based on screen width
  const updateItemsPerSlide = () => {
    if (window.innerWidth >= 1024) {
      // Desktop
      setItemsPerSlide(3);
    } else if (window.innerWidth >= 640) {
      // Tablet
      setItemsPerSlide(2);
    } else {
      // Mobile
      setItemsPerSlide(2);
    }
  };

  useEffect(() => {
    // Set initial items per slide
    updateItemsPerSlide();

    // Add resize listener
    const handleResize = () => {
      updateItemsPerSlide();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (abortRef?.current) abortRef.current.abort();
      if (sugTimeout?.current) clearTimeout(sugTimeout.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isDetailsOpen) setCurrentSlide(0);
  }, [isDetailsOpen, detailsProvider]);

  /* ------------------------- ZIP Suggestion Fetch ------------------------- */
  const fetchZipSuggestions = (partial) => {
    if (sugTimeout?.current) clearTimeout(sugTimeout.current);

    sugTimeout.current = setTimeout(async () => {
      if (!/^\d{5}$/.test(partial)) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${partial}`);
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = await res.json();
        const list = (data?.places || []).map((place) => ({
          zip: data?.["post code"],
          city: place?.["place name"],
          state: place?.["state abbreviation"],
        }));
        setSuggestions(list);
      } catch {
        setSuggestions([]);
      }
    }, 200);
  };

  const onZipChange = (e) => {
    const v = e.target.value.replace(/[^\d\s,-]/g, "");
    setZipInput(v);
    setActiveSugIdx(-1);
    const zip5 = v.match(/\b\d{5}\b/)?.[0] || "";
    if (zip5) {
      setSelectedZip(zip5);
      fetchZipSuggestions(zip5);
    } else {
      setSuggestions([]);
    }
  };

  const onZipKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSugIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSugIdx((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeSugIdx >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSugIdx]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveSugIdx(-1);
    }
  };

  const handleSelectSuggestion = (s) => {
    setZipInput(`${s.zip} ${s.city}, ${s.state}`);
    setSelectedZip(s.zip);
    setSuggestions([]);
    setActiveSugIdx(-1);
  };

  /* ------------------------- Provider Search/Render ------------------------ */

  const fetchProviders = async (zip) => {
    if (!/^\d{5}$/.test(zip)) {
      alert("Please enter a valid 5-digit ZIP code.");
      return;
    }

    if (abortRef?.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setResults([]);
    const myReqId = ++reqIdRef.current;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/search/providers`,
        {
          params: { zipcode: zip, _: Date.now() },
          headers: { "Cache-Control": "no-store" },
          signal: controller.signal,
        }
      );

      const apiProviders = Array.isArray(res?.data?.providers)
        ? res.data.providers
        : [];

      const apiByName = new Map();
      for (const p of apiProviders) {
        const n = normalize(p?.typeName || p?.name);
        if (!n) continue;
        if (!apiByName.has(n)) apiByName.set(n, p);
      }

      for (const vp of VOIP_PROVIDERS) {
        const n = normalize(vp?.typeName || vp?.name);
        if (!n) continue;
        if (!apiByName.has(n)) apiByName.set(n, vp);
      }

      const hasATT =
        [...apiByName.keys()].includes("at&t business") ||
        apiProviders.some(
          (p) => normalize(p?.typeName || p?.name) === "at&t business"
        );
      if (!hasATT) {
        apiByName.delete("acc business");
      }

      const combined = [...apiByName.values()];

      if (myReqId !== reqIdRef.current) return;
      setResults(combined);
    } catch (error) {
      if (axios.isCancel?.(error) || error?.name === "CanceledError") return;

      const fallback = [...VOIP_PROVIDERS];
      const filtered = fallback.filter(
        (p) => normalize(p?.name) !== "acc business"
      );

      if (myReqId !== reqIdRef.current) return;
      setResults(filtered);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  };

  const handleSearch = () => {
    setHasSearched(true);
    const zip = selectedZip || zipInput.match(/\b\d{5}\b/)?.[0] || "";
    fetchProviders(zip.trim());
  };

  const openDetails = (providerDisplayName) => {
    setDetailsProvider(providerDisplayName);
    setIsDetailsOpen(true);
  };

  const handleBook = (provider) => {
    const name = provider?.name || provider?.typeName || "Provider";
    navigate("/customerbookingfrom", { state: { name } });
  };

  /* --------------------------------- FAQ --------------------------------- */
  const faqs = [
    {
      question: "Which is the best internet provider in my area?",
      answer:
        "It depends on your location. Use the ZIP code search to view top providers available in your region.",
    },
    {
      question: "What speed do I need for streaming?",
      answer:
        "At least 25 Mbps per user is recommended for smooth HD streaming. For 4K or multiple devices, go higher.",
    },
    {
      question: "Are there any installation charges?",
      answer:
        "Some providers offer free installation, while others charge a one-time fee. Check the plan details.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, most providers allow upgrades or downgrades. Contract plans may have restrictions.",
    },
  ];

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Helmet>
        <title>
          Business Internet Near You | Spectrum, AT&T & Comcast Plans
        </title>
        <meta
          name="description"
          content="Compare business internet providers in your area. Enter your ZIP code to check Spectrum, AT&T, Comcast and VoIP plans. Get reliable speeds, bundles and 24/7 support."
        />
        <meta
          name="keywords"
          content="business internet providers, spectrum business internet, at&t business internet, comcast business internet, internet by zip code, broadband availability, small business internet plans, compare providers, business wifi, voip services"
        />
        <link
          rel="canonical"
          href="https://zenith.cloudastro.space/business-internet"
        />
      </Helmet>

      {/* Floating CTA */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isScrolled ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
      >
        <a
          href={`tel:${PHONE.replaceAll?.("-", "")}`}
          className="flex items-center gap-3 px-5 py-3 bg-[#C44E12] text-white font-semibold rounded-full shadow-xl hover:bg-[#712C09] transition-all duration-300 hover:shadow-2xl animate-pulse"
        >
          <FaPhoneAlt className="w-5 h-5" />
          <span className="hidden sm:inline">Call {PHONE}</span>
        </a>
      </div>

      {showCalculator && (
        <BandwidthCalculatorModal onClose={() => setShowCalculator(false)} />
      )}
      {showSpeedTest && (
        <SpeedTestEmbed onClose={() => setShowSpeedTest(false)} />
      )}

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

      {/* Premium Hero Section */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#f5f2eb]">
        {/* Background image */}
        <img
          src={Home1}
          alt="Spectrum Business internet solutions"
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
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1440px] items-center px-5  sm:px-10 lg:px-16 xl:px-20">
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
              Business Internet

              <span className="mt-2 block  tracking-[-0.04em] text-orange-700">
                Built to Perform.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[620px] text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8 lg:text-xl">
              Get 100 Mbps Fiber-Powered Business Internet Advantage free
              forever when you add four Business Mobile lines.
            </p>

            {/* Feature */}
            <div className="mt-7 flex max-w-[590px] items-start gap-4 border-l-2 border-orange-600 pl-5">
              <div>
                <p className="font-semibold text-neutral-900">
                  Advanced WiFi included
                </p>

                <p className="mt-1 text-sm leading-6 text-neutral-600 sm:text-base">
                  Greater speed, stronger coverage and enhanced security for your
                  business.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={`tel:${PHONE.replaceAll("-", "")}`}
                aria-label={`Call Spectrum Business at ${PHONE}`}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full hover:bg-white px-7 text-base font-semibold hover:text-black text-white  shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 bg-orange-700 hover:shadow-[0_20px_45px_rgba(194,65,12,0.25)]"
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
        <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-black lg:flex">
          <span>Explore</span>
          <span className="h-px w-12 bg-black" />
        </div>
      </section>

      {/* Trust Banner */}
      <section
        className="relative overflow-hidden bg-[#f7f7f5] py-8 sm:py-10 lg:py-12"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[80%] -translate-x-1/2 rounded-full bg-orange-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16 xl:px-20">
          <div className="group relative overflow-hidden rounded-2xl border border-orange-200/70 bg-gradient-to-r from-[#fffaf6] via-white to-[#fff4eb] px-5 py-6 shadow-[0_16px_45px_rgba(68,38,20,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(194,65,12,0.13)] sm:px-8 sm:py-7 lg:rounded-3xl lg:px-12">

            {/* Top accent */}
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

            {/* Decorative circles */}
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border border-orange-200/60" />
            <div className="absolute -right-5 -top-10 h-28 w-28 rounded-full bg-orange-100/50 blur-xl" />

            <div className="relative flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-5">
              {/* Ranking badge */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-700 text-sm font-bold text-white shadow-[0_12px_28px_rgba(194,65,12,0.28)] transition-transform duration-500 group-hover:rotate-[-5deg] group-hover:scale-105 sm:h-14 sm:w-14 sm:text-base">
                #1
              </div>

              <div className="sm:text-left">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-700 sm:text-xs">
                  Customer Recognition
                </p>

                <h2 className="text-xl font-semibold leading-tight tracking-[-0.025em] text-neutral-950 sm:text-2xl lg:text-[2rem]">
                  #1 in Customer Satisfaction
                  <span className="font-normal text-neutral-600">
                    {" "}for Internet Service
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Premium ZIP Search Section */}
      <section
        className="relative isolate overflow-visible bg-gradient-to-b from-[#f7f7f5] via-white to-[#faf8f5] py-14 sm:py-16 lg:py-20"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-72 w-[75%] -translate-x-1/2 rounded-full bg-orange-100/55 blur-[110px]" />

          <div className="absolute -left-20 top-20 h-44 w-44 rounded-full border border-orange-100/80" />
          <div className="absolute -right-24 bottom-0 h-60 w-60 rounded-full border border-orange-100/70" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16 xl:px-20">
          <div className="mx-auto max-w-[960px]">
            {/* Heading */}
            <div className="mx-auto mb-8 max-w-[720px] text-center sm:mb-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.12)]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                  Check Availability
                </span>
              </div>

              <h2 className="mx-auto max-w-[760px] text-balance text-3xl font-semibold leading-[1.08] tracking-[0.035em] text-neutral-950 sm:text-4xl lg:text-[2.75rem]">
                Find Internet Providers
                <span className="mt-1 block text-orange-700 sm:mt-2">
                  Available in Your Area
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-[620px] text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7 lg:text-lg">
                Enter your five-digit ZIP code to explore available internet
                providers and plans for your business location.
              </p>
            </div>

            {/* Search card */}
            <div className="relative z-20 rounded-[24px] border border-white bg-white/90 p-3 shadow-[0_24px_80px_rgba(30,24,20,0.10)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_30px_90px_rgba(194,65,12,0.13)] sm:rounded-[30px] sm:p-4">
              {/* Top highlight */}
              <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                {/* ZIP input */}
                <div className="relative min-w-0 flex-1">
                  <label
                    htmlFor="provider-zip-code"
                    className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500 sm:hidden"
                  >
                    Business ZIP code
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-orange-50 text-orange-700 transition-colors duration-300 group-focus-within:bg-orange-700 group-focus-within:text-white sm:left-5">
                      <FaSearch className="text-sm" />
                    </div>

                    <input
                      id="provider-zip-code"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{5}"
                      maxLength={5}
                      autoComplete="postal-code"
                      placeholder="Enter your 5-digit ZIP code"
                      value={zipInput}
                      onChange={onZipChange}
                      onKeyDown={onZipKeyDown}
                      aria-label="Enter your five-digit ZIP code"
                      aria-autocomplete="list"
                      aria-expanded={suggestions.length > 0}
                      aria-controls="zip-suggest"
                      className="h-[66px] w-full rounded-2xl border border-neutral-200 bg-[#fafafa] pl-[4.5rem] pr-4 text-sm font-medium text-neutral-900 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-neutral-400 hover:border-neutral-300 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 sm:h-[72px] sm:pl-20 sm:text-base"
                    />

                    <span className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 shadow-sm ring-1 ring-neutral-200 md:block">
                      ZIP
                    </span>
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <ul
                      id="zip-suggest"
                      role="listbox"
                      className="absolute left-0 right-0 top-full z-50 mt-3 max-h-72 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
                    >
                      {suggestions.map((s, i) => (
                        <li
                          key={`${s.zip}-${i}`}
                          role="option"
                          aria-selected={activeSugIdx === i}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectSuggestion(s);
                          }}
                          className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 sm:px-4 ${activeSugIdx === i
                              ? "bg-orange-50 text-orange-800"
                              : "text-neutral-800 hover:bg-neutral-50"
                            }`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${activeSugIdx === i
                                ? "bg-orange-700 text-white"
                                : "bg-neutral-100 text-neutral-600 group-hover:bg-orange-50 group-hover:text-orange-700"
                              }`}
                          >
                            {s.zip.slice(0, 2)}
                          </span>

                          <div className="min-w-0">
                            <div className="font-semibold">{s.zip}</div>
                            <div className="truncate text-xs text-neutral-500 sm:text-sm">
                              {s.city}, {s.state}
                            </div>
                          </div>

                          <span className="ml-auto text-orange-600 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                            →
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Search button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="group inline-flex h-[58px] shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#171717] px-7 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_18px_38px_rgba(194,65,12,0.3)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 sm:h-[72px] sm:min-w-[210px] sm:px-8 sm:text-base"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>

                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>Search Providers</span>
                      <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-medium text-neutral-500 sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                  ✓
                </span>
                No obligation
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                  ✓
                </span>
                Fast availability check
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                  ✓
                </span>
                Business plans compared
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Provider Results Section */}
      <section className="relative overflow-hidden bg-[#f3efe8] ">


        <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">
          {loading ? (
            /* Loading state */
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-neutral-200/80 bg-white/80 px-6 text-center shadow-[0_20px_60px_rgba(30,24,20,0.06)] backdrop-blur-xl">
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-orange-100" />

                <span className="relative h-12 w-12 animate-spin rounded-full border-[3px] border-orange-100 border-t-orange-600" />
              </div>

              <h3 className="text-xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-2xl">
                Finding the best providers
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500 sm:text-base">
                Checking available internet services and plans in your area.
              </p>
            </div>
          ) : hasSearched && results.length === 0 ? (
            /* Empty state */
            <div className="mx-auto max-w-[760px] rounded-[28px] border border-neutral-200/80 bg-white px-6 py-12 text-center shadow-[0_24px_70px_rgba(30,24,20,0.08)] sm:px-10 sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl shadow-inner">
                📡
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-700 sm:text-xs">
                Availability Update
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-3xl">
                No providers found
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600 sm:text-base">
                We couldn&apos;t find an available provider for this ZIP code. Check
                the number or search another location.
              </p>

              <button
                type="button"
                onClick={() => {
                  setZipInput("");
                  setSelectedZip("");
                  setResults([]);
                  setHasSearched(false);
                }}
                className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_18px_38px_rgba(194,65,12,0.28)]"
              >
                Try Another ZIP Code
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          ) : (
            <div data-aos="fade-up" data-aos-duration="700">
              {/* Results heading */}
              {hasSearched && results.length > 0 && (
                <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="h-px w-8 bg-orange-600" />

                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                        Available Providers
                      </p>
                    </div>

                    <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-3xl lg:text-[2.5rem]">
                      Plans available in your area
                    </h2>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 shadow-sm sm:text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                    {results.length}{" "}
                    {results.length === 1 ? "provider" : "providers"} found
                  </div>
                </div>
              )}

              {/* Provider cards */}
              <div className="space-y-5 sm:space-y-6">
                {results.map((p, index) => {
                  const rawName = p?.typeName || p?.name || "";
                  const name =
                    rawName === "Sepctrum Business"
                      ? "Spectrum Business"
                      : rawName;

                  const key = p?._id || p?.id || normalize(name);
                  const meta = PROVIDER_META?.[normalize(name)] || {};
                  const logo = meta?.logo || p?.img || PlaceHolder;
                  const startingPrice =
                    p?.startingPrice || meta?.startingPrice || "$29.99";
                  const speed = p?.speed || meta?.speed || "100 Mbps";
                  const conditions =
                    p?.conditions || meta?.conditions || "Conditions apply";

                  const hideSpeedUpTo = [
                    "spectrum voip",
                    "ringcentral",
                  ].includes(normalize(name));

                  return (
                    <article
                      key={key}
                      className="group relative overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-[0_16px_50px_rgba(30,24,20,0.07)] transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_70px_rgba(194,65,12,0.12)] sm:rounded-[28px]"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Premium top accent */}
                      <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="p-5 sm:p-7 lg:p-8">
                        <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-8">
                          {/* Provider identity */}
                          <div className="flex items-center gap-4 border-b border-neutral-100 pb-5 lg:flex-col lg:items-start lg:border-b-0 lg:border-r lg:pb-0 lg:pr-7">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-[#fafafa] p-3 shadow-sm transition-all duration-500 group-hover:border-orange-200 group-hover:bg-orange-50/40 sm:h-24 sm:w-24">
                              <img
                                src={logo}
                                alt={`${name} logo`}
                                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-orange-700 sm:text-[10px]">
                                Internet Provider
                              </p>

                              <h3 className="truncate text-lg font-semibold tracking-[-0.025em] text-neutral-950 sm:text-xl lg:whitespace-normal">
                                {name}
                              </h3>

                              <button
                                type="button"
                                onClick={() => openDetails(name)}
                                className="mt-2 hidden items-center gap-1 text-xs font-semibold text-neutral-500 transition-colors hover:text-orange-700 lg:inline-flex"
                              >
                                Provider details
                                <span>→</span>
                              </button>
                            </div>
                          </div>

                          {/* Plan information */}
                          <div className="flex min-w-0 flex-col">
                            <div
                              className={`grid gap-3 ${hideSpeedUpTo
                                  ? "sm:grid-cols-1"
                                  : "sm:grid-cols-2"
                                }`}
                            >
                              {/* Pricing */}
                              <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-[#fff8f2] to-[#fffdfb] p-4 sm:p-5">
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-100/70 blur-2xl" />

                                <div className="relative">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                                    Plans starting at
                                  </p>

                                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-orange-700 sm:text-[2rem]">
                                    {startingPrice}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                                    {conditions}
                                  </p>
                                </div>
                              </div>

                              {/* Speed */}
                              {!hideSpeedUpTo && (
                                <div className="rounded-2xl border border-neutral-200 bg-[#fafafa] p-4 transition-colors duration-300 group-hover:bg-white sm:p-5">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                                    Speeds up to
                                  </p>

                                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-[2rem]">
                                    {speed}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                                    Availability and speeds may vary by location
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                              <button
                                type="button"
                                onClick={() => handleBook(p)}
                                className="group/button inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_16px_34px_rgba(194,65,12,0.28)] active:translate-y-0"
                              >
                                Book Appointment
                                <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                                  →
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => openDetails(name)}
                                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 active:scale-[0.98]"
                              >
                                View Plans
                              </button>

                              <button
                                type="button"
                                onClick={() => openDetails(name)}
                                className="text-center text-xs font-semibold text-neutral-500 hover:text-orange-700 lg:hidden"
                              >
                                View provider details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Premium Details Modal */}
      {isDetailsOpen &&
        detailsProvider &&
        (() => {
          const details =
            PROVIDER_DETAILS?.find((x) => x?.name === detailsProvider) || null;

          const plans = details?.plans || [];
          const totalSlides = Math.max(
            1,
            Math.ceil(plans.length / itemsPerSlide)
          );
          const safeIndex =
            ((currentSlide % totalSlides) + totalSlides) % totalSlides;
          const startIndex = safeIndex * itemsPerSlide;
          const visiblePlans =
            plans.slice(startIndex, startIndex + itemsPerSlide) || [];
          const phoneDisplay = details?.phone || PHONE;

          const handlePrev = () =>
            setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));

          const handleNext = () =>
            setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));

          return (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/70 p-3 backdrop-blur-md animate-fadeIn sm:p-5"
              role="dialog"
              aria-modal="true"
              aria-labelledby="provider-plans-title"
              onClick={() => setIsDetailsOpen(false)}
            >
              <div
                className="relative flex max-h-[92svh] w-full max-w-[1120px] flex-col overflow-hidden rounded-[24px] border border-white/20 bg-[#fbfaf8] shadow-[0_35px_120px_rgba(0,0,0,0.45)] sm:rounded-[32px]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative accents */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-200/35 blur-[80px]" />
                <div className="pointer-events-none absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

                {/* Header */}
                <div className="relative flex shrink-0 items-start justify-between border-b border-neutral-200/80 bg-white/80 px-5 py-5 backdrop-blur-xl sm:px-8 sm:py-7">
                  <div className="min-w-0 pr-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.12)]" />
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-[11px]">
                        Available Internet Plans
                      </p>
                    </div>

                    <h2
                      id="provider-plans-title"
                      className="truncate text-xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-2xl lg:text-[2rem]"
                    >
                      {details?.name || detailsProvider}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-neutral-500 sm:text-sm">
                      Compare pricing, speeds and included features.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(false)}
                    className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-neutral-500 shadow-sm transition-all duration-300 hover:rotate-90 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 sm:h-11 sm:w-11"
                    aria-label="Close plan details"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                {/* Scrollable content keeps the modal usable on small screens */}
                <div className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-7 sm:py-7 lg:px-8">
                  {!details ? (
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white px-6 text-center shadow-sm">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                        📡
                      </div>

                      <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-neutral-950">
                        Plan details unavailable
                      </h3>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                        Please call our business team for current plans and
                        availability in your location.
                      </p>
                    </div>
                  ) : plans.length === 0 ? (
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white px-6 text-center shadow-sm">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                        📋
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-neutral-950">
                        No plans listed
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-500">
                        Contact a business specialist for the latest available plans.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Carousel toolbar */}
                      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            Choose the right plan
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            Showing {startIndex + 1}–
                            {Math.min(startIndex + itemsPerSlide, plans.length)} of{" "}
                            {plans.length}
                          </p>
                        </div>

                        {plans.length > itemsPerSlide && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handlePrev}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 active:scale-95"
                              aria-label="Previous plans"
                            >
                              <TiArrowLeft className="text-xl" />
                            </button>

                            <span className="min-w-[52px] text-center text-xs font-semibold text-neutral-500">
                              {safeIndex + 1} / {totalSlides}
                            </span>

                            <button
                              type="button"
                              onClick={handleNext}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all duration-300 hover:translate-x-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 active:scale-95"
                              aria-label="Next plans"
                            >
                              <TiArrowRight className="text-xl" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Plan cards */}
                      <div
                        className={`grid grid-cols-1 gap-4 ${itemsPerSlide >= 2 ? "md:grid-cols-2" : ""
                          } ${itemsPerSlide >= 3 ? "lg:grid-cols-3" : ""}`}
                      >
                        {visiblePlans.map((plan, idx) => (
                          <article
                            key={`${startIndex + idx}-${plan?.title}`}
                            className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[22px] border border-neutral-200 bg-white p-5 shadow-[0_14px_40px_rgba(30,24,20,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_55px_rgba(194,65,12,0.12)] sm:p-6"
                            style={{ animationDelay: `${idx * 0.08}s` }}
                          >
                            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="mb-5">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-orange-700">
                                    Business Internet
                                  </p>
                                  <h3 className="mt-1.5 text-lg font-semibold leading-tight tracking-[-0.025em] text-neutral-950">
                                    {plan?.title}
                                  </h3>
                                </div>

                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-700">
                                  {startIndex + idx + 1}
                                </span>
                              </div>

                              <div className="mt-5 flex items-end gap-1">
                                <span className="text-[2rem] font-semibold leading-none tracking-[-0.05em] text-orange-700 sm:text-[2.25rem]">
                                  {plan?.price}
                                </span>
                                <span className="pb-1 text-xs font-medium text-neutral-500">
                                  /mo
                                </span>
                              </div>
                            </div>

                            {plan?.details?.length > 0 && (
                              <div className="mb-5 border-t border-neutral-100 pt-5">
                                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                                  Plan features
                                </p>

                                <ul className="space-y-2.5">
                                  {plan.details.slice(0, 3).map((feature, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2.5 text-xs leading-5 text-neutral-600 sm:text-sm"
                                    >
                                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                        <TiTick className="text-sm" />
                                      </span>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {plan?.inbundle && (
                              <div className="mb-5 rounded-xl border border-orange-100 bg-orange-50/60 p-3.5">
                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-orange-700">
                                  Bundle includes
                                </p>
                                <p className="mt-1 text-xs leading-5 text-neutral-700">
                                  {plan.inbundle}
                                </p>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                handleBook({
                                  name: details?.name || detailsProvider,
                                });
                                setIsDetailsOpen(false);
                              }}
                              className="group/button mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_16px_34px_rgba(194,65,12,0.28)]"
                            >
                              Book This Plan
                              <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                                →
                              </span>
                            </button>
                          </article>
                        ))}
                      </div>

                      {/* Pagination */}
                      {plans.length > itemsPerSlide && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                          {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${idx === safeIndex
                                  ? "w-8 bg-orange-600"
                                  : "w-2 bg-neutral-300 hover:bg-orange-300"
                                }`}
                              aria-label={`Go to plan page ${idx + 1}`}
                              aria-current={idx === safeIndex ? "page" : undefined}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="relative shrink-0 border-t border-neutral-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                        <FaPhoneAlt className="text-sm" />
                      </span>

                      <div>
                        <p className="text-[10px] font-medium text-neutral-500">
                          Need help choosing?
                        </p>
                        <a
                          href={`tel:${phoneDisplay?.replaceAll?.("-", "")}`}
                          className="text-sm font-semibold text-neutral-950 transition-colors hover:text-orange-700 sm:text-base"
                        >
                          Call {phoneDisplay}
                        </a>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDetailsOpen(false)}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-700 transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-800"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Premium Providers Section */}
      <section
        className="relative isolate overflow-hidden bg-[#faf9f7] py-14 sm:py-16 lg:py-20"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-80 w-[75%] -translate-x-1/2 rounded-full bg-orange-100/45 blur-[120px]" />
          <div className="absolute -left-24 top-24 h-56 w-56 rounded-full border border-orange-100/80" />
          <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full border border-orange-100/70" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
          {/* Section heading */}
          <div className="mx-auto mb-10 max-w-[760px] text-center sm:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.12)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                Trusted Provider Network
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.75rem]">
              Our Internet Service
              <span className="mt-1 block text-orange-700 sm:mt-2">
                Providers
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7 lg:text-lg">
              Compare trusted business internet providers and find reliable
              connectivity built around your company’s needs.
            </p>
          </div>

          {/* Provider cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {/* Spectrum */}
            <article
              className="group relative overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-[0_16px_45px_rgba(30,24,20,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_26px_65px_rgba(194,65,12,0.13)]"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex min-h-[132px] items-center justify-center rounded-2xl border border-neutral-100 bg-gradient-to-br from-[#fafafa] to-white p-5 transition-all duration-500 group-hover:border-orange-100 group-hover:bg-orange-50/40">
                  <img
                    src={Spectrum}
                    alt="Spectrum Business"
                    className="h-20 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col pt-6">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    Business Internet
                  </p>

                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-neutral-950">
                    Spectrum Business
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">
                    Blazing-fast internet with unlimited data for streaming, remote
                    work and everyday business operations.
                  </p>

                  <Link
                    to="/internet/SpectrumBusiness"
                    aria-label="Explore Spectrum Business plans"
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-xl hover:bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(0,0,0,0.15)] transition-all duration-300 bg-orange-700 hover:shadow-[0_16px_32px_rgba(194,65,12,0.28)]"
                  >
                    <span>Explore Plans</span>
                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>

            {/* AT&T */}
            <article
              className="group relative overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-[0_16px_45px_rgba(30,24,20,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_26px_65px_rgba(194,65,12,0.13)]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex min-h-[132px] items-center justify-center rounded-2xl border border-neutral-100 bg-gradient-to-br from-[#fafafa] to-white p-5 transition-all duration-500 group-hover:border-orange-100 group-hover:bg-orange-50/40">
                  <img
                    src={Att}
                    alt="AT&T Business"
                    className="h-20 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col pt-6">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    Business Internet
                  </p>

                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-neutral-950">
                    AT&amp;T Business
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">
                    Flexible business internet packages backed by extensive coverage
                    and dedicated customer support.
                  </p>

                  <Link
                    to="/internet/AttBusiness"
                    aria-label="Explore AT&T Business plans"
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-xl hover:bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(0,0,0,0.15)] transition-all duration-300 bg-orange-700 hover:shadow-[0_16px_32px_rgba(194,65,12,0.28)]"
                  >
                    <span>Explore Plans</span>
                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>

            {/* Comcast */}
            <article
              className="group relative overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-[0_16px_45px_rgba(30,24,20,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_26px_65px_rgba(194,65,12,0.13)]"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex min-h-[132px] items-center justify-center rounded-2xl border border-neutral-100 bg-gradient-to-br from-[#fafafa] to-white p-5 transition-all duration-500 group-hover:border-orange-100 group-hover:bg-orange-50/40">
                  <img
                    src={Comcast}
                    alt="Comcast Business"
                    className="h-20 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col pt-6">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    Cable &amp; Fiber
                  </p>

                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-neutral-950">
                    Comcast Business
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">
                    Fast and consistent business connectivity with scalable cable
                    and fiber internet options.
                  </p>

                  <Link
                    to="/internet/ComcastBusiness"
                    aria-label="Explore Comcast Business plans"
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-xl hover:bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(0,0,0,0.15)] transition-all duration-300 bg-orange-700 hover:shadow-[0_16px_32px_rgba(194,65,12,0.28)]"
                  >
                    <span>Explore Plans</span>
                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>

            {/* ACC Business */}
            <article
              className="group relative overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-[0_16px_45px_rgba(30,24,20,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_26px_65px_rgba(194,65,12,0.13)]"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex min-h-[132px] items-center justify-center rounded-2xl border border-neutral-100 bg-gradient-to-br from-[#fafafa] to-white p-5 transition-all duration-500 group-hover:border-orange-100 group-hover:bg-orange-50/40">
                  <img
                    src={Acc}
                    alt="ACC Business"
                    className="h-20 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col pt-6">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    Enterprise Solutions
                  </p>

                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-neutral-950">
                    ACC Business
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">
                    Reliable internet solutions designed for growing companies,
                    enterprises and small businesses.
                  </p>

                  <Link
                    to="/internet/AccBusiness"
                    aria-label="Explore ACC Business plans"
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-xl hover:bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(0,0,0,0.15)] transition-all duration-300 bg-orange-700 hover:shadow-[0_16px_32px_rgba(194,65,12,0.28)]"
                  >
                    <span>Explore Plans</span>
                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Bottom trust message */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-medium text-neutral-500 sm:text-sm">
            {[
              "Trusted business providers",
              "Plans compared by location",
              "Expert assistance available",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                  ✓
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Explanation Section */}
      <section
        className="relative isolate overflow-hidden bg-white py-14 sm:py-16 lg:py-24"
        data-aos="fade-up"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-orange-100/50 blur-[120px]" />
          <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-50/80 blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            {/* Image */}
            <div
              className="order-2 lg:order-1"
              data-aos="fade-right"
              data-aos-duration="700"
            >
              <div className="relative mx-auto max-w-[620px] lg:mx-0">
                {/* Decorative frame */}
                <div className="absolute -bottom-5 -left-5 h-full w-full rounded-[28px] border border-orange-200/70 bg-orange-50/60 sm:-bottom-7 sm:-left-7 sm:rounded-[34px]" />

                {/* Main image card */}
                <div className="group relative overflow-hidden rounded-[26px] border border-white/80 bg-white p-2 shadow-[0_28px_80px_rgba(30,24,20,0.16)] sm:rounded-[34px] sm:p-3">
                  <div className="relative overflow-hidden rounded-[20px] sm:rounded-[27px]">
                    <img
                      src={Home5}
                      alt="Check business internet providers available in your area"
                      className="h-[300px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:h-[420px] lg:h-[500px]"
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/65 via-neutral-950/5 to-transparent" />

                    {/* Image content */}
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.16)]" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                          Location-Based Availability
                        </span>
                      </div>

                      <p className="mt-3 max-w-sm text-base font-medium leading-6 sm:text-lg">
                        Compare reliable connectivity options for your business
                        location.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating trust card */}
                <div className="absolute -right-2 top-6 hidden items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/95 p-3.5 shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur-xl sm:flex lg:-right-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-700">
                    ⚡
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                      Quick Search
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                      Check by ZIP code
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className="order-1 lg:order-2"
              data-aos="fade-left"
              data-aos-duration="700"
            >
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-orange-600" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                  Find the Right Connection
                </span>
              </div>

              <h2 className="max-w-[620px] text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
                Find Internet Providers
                <span className="mt-1 block text-orange-700">
                  Available in Your Area
                </span>
              </h2>

              <p className="mt-5 max-w-[620px] text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg lg:leading-8">
                Explore reliable business internet services from trusted providers.
                Availability, connection type and plan options may vary depending on
                your location.
              </p>

              {/* Information cards */}
              <div className="mt-7 space-y-3">
                <div className="group flex gap-4 rounded-2xl border border-neutral-200/80 bg-[#fafafa] p-4 transition-all duration-300 hover:border-orange-200 hover:bg-white hover:shadow-[0_14px_35px_rgba(194,65,12,0.08)] sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700 transition-colors duration-300 group-hover:bg-orange-700 group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
                      />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-neutral-950 sm:text-base">
                      Coverage depends on your location
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Spectrum, AT&amp;T and Comcast availability can differ by ZIP
                      code and service address.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-4 rounded-2xl border border-neutral-200/80 bg-[#fafafa] p-4 transition-all duration-300 hover:border-orange-200 hover:bg-white hover:shadow-[0_14px_35px_rgba(194,65,12,0.08)] sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700 transition-colors duration-300 group-hover:bg-orange-700 group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 17l4-4 3 3 6-7"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 9h3v3"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-neutral-950 sm:text-base">
                      Multiple factors affect internet speed
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Your plan, connection type, network distance and Wi-Fi
                      equipment can influence actual performance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Provider logos */}
              <div className="mt-8 border-t border-neutral-200 pt-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                      Compare leading providers
                    </p>

                    <p className="mt-1 text-sm font-medium text-neutral-700">
                      Trusted business connectivity options
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {[
                      { src: Spectrum, name: "Spectrum" },
                      { src: Att, name: "AT&T" },
                      { src: Comcast, name: "Comcast" },
                    ].map((provider) => (
                      <div
                        key={provider.name}
                        title={provider.name}
                        className="flex h-14 min-w-[76px] items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md sm:h-16 sm:min-w-[88px]"
                      >
                        <img
                          src={provider.src}
                          alt={`${provider.name} logo`}
                          className="max-h-8 max-w-[66px] object-contain sm:max-h-9 sm:max-w-[74px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Band */}
      <section
        className="relative isolate overflow-hidden bg-[#faf9f7] py-12 sm:py-16 lg:py-20"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-orange-100/70 blur-[110px]" />
          <div className="absolute -right-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-50/80 blur-[120px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#eeeeee_1px,transparent_1px),linear-gradient(to_bottom,#eeeeee_1px,transparent_1px)] bg-[size:48px_48px] opacity-20 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="group relative overflow-hidden rounded-[28px] bg-neutral-950 px-5 py-10 shadow-[0_28px_80px_rgba(23,23,23,0.22)] sm:rounded-[36px] sm:px-10 sm:py-12 lg:px-16 lg:py-14">
            {/* Internal background effects */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-orange-600/25 blur-[100px]" />
              <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-orange-900/30 blur-[100px]" />

              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.04)_50%,transparent_80%)]" />

              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/80 to-transparent" />
            </div>

            <div className="relative grid items-center gap-8 text-center lg:grid-cols-[minmax(0,1fr)_auto] lg:text-left">
              {/* CTA content */}
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300 sm:text-xs">
                    Internet Experts Available
                  </span>
                </div>

                <h2 className="max-w-[760px] text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.7rem]">
                  Find the right internet plan
                  <span className="mt-1 block">
                    for your business
                  </span>
                </h2>

                <p className="mx-auto mt-4 max-w-[650px] text-sm leading-6 text-neutral-300 sm:text-base sm:leading-7 lg:mx-0">
                  Speak with our team for personalized plan recommendations,
                  availability details and expert assistance.
                </p>

                {/* Trust indicators */}
                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
                  {[
                    "Personalized assistance",
                    "Location-based availability",
                    "No-obligation consultation",
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 sm:text-sm"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-[10px] font-bold text-emerald-400">
                        ✓
                      </span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Call card */}
              <div className="mx-auto w-full max-w-[390px] lg:mx-0 lg:min-w-[360px]">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:rounded-[26px] sm:p-4">
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.06] p-5 sm:p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-[0_12px_30px_rgba(234,88,12,0.35)] transition-transform duration-300 group-hover:scale-105">
                        <FaPhoneAlt className="text-lg" />
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                        Call our specialists
                      </p>

                      <a
                        href={`tel:${PHONE.replace(/\D/g, "")}`}
                        aria-label={`Call ${PHONE}`}
                        className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-white transition-colors duration-300 hover:text-orange-400 sm:text-3xl"
                      >
                        {PHONE}
                      </a>

                      <p className="mt-2 text-xs leading-5 text-neutral-400 sm:text-sm">
                        Get personalized help choosing your business plan.
                      </p>

                      <a
                        href={`tel:${PHONE.replace(/\D/g, "")}`}
                        className="group/button mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(234,88,12,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-[0_18px_38px_rgba(234,88,12,0.4)] active:translate-y-0"
                      >
                        <FaPhoneAlt className="text-xs" />

                        <span>Call Now</span>

                        <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Why Choose Us Section */}
      <section
        className="relative isolate overflow-hidden bg-[#faf9f7] py-14 sm:py-16 lg:py-24"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-orange-100/60 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-50/80 blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#eeeeee_1px,transparent_1px),linear-gradient(to_bottom,#eeeeee_1px,transparent_1px)] bg-[size:52px_52px] opacity-25 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          {/* Section heading */}
          <div className="mx-auto mb-10 max-w-[760px] text-center sm:mb-12 lg:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.12)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                Why Businesses Choose Us
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
              Connectivity designed around
              <span className="mt-1 block text-orange-700">
                your business needs
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[650px] text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg lg:leading-8">
              Reliable connectivity, responsive assistance and modern technology
              designed to keep your business moving forward.
            </p>
          </div>

          {/* Premium cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-7">
            {/* Superior Experience */}
            <article
              className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-neutral-200/80 bg-white shadow-[0_18px_50px_rgba(30,24,20,0.07)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(194,65,12,0.14)]"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Image */}
              <div className="relative m-3 overflow-hidden rounded-[19px] sm:m-4">
                <img
                  src={Home2}
                  alt="Superior business internet experience"
                  className="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] sm:h-60"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/5 to-transparent" />

                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 13a8 8 0 0116 0"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 13a5 5 0 0110 0M10 13a2 2 0 014 0"
                    />
                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                  </svg>
                </div>

                <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-neutral-950/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  Reliable
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col px-5 pb-6 pt-2 sm:px-6 sm:pb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                  Dependable Connectivity
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-2xl">
                  Superior Experience
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Business connectivity designed for consistent performance,
                  flexibility and long-term value.
                </p>

                <ul className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
                  {[
                    "Fast, reliable business Internet",
                    "Flexible plans and pricing",
                    "Multi-year price guarantees available",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                        ✓
                      </span>

                      <span className="text-sm leading-5 text-neutral-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Exceptional Service */}
            <article
              className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-neutral-200/80 bg-white shadow-[0_18px_50px_rgba(30,24,20,0.07)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(194,65,12,0.14)]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative m-3 overflow-hidden rounded-[19px] sm:m-4">
                <img
                  src={Home3}
                  alt="Exceptional business customer service"
                  className="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] sm:h-60"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/5 to-transparent" />

                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 11a7 7 0 0114 0v5a2 2 0 01-2 2h-2v-6h4M5 12v6H3a2 2 0 01-2-2v-5"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 18c0 2-1.5 3-4 3"
                    />
                  </svg>
                </div>

                <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-neutral-950/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  24/7 Support
                </span>
              </div>

              <div className="flex flex-1 flex-col px-5 pb-6 pt-2 sm:px-6 sm:pb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                  Dedicated Assistance
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-2xl">
                  Exceptional Service
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Responsive customer care and dependable technical support whenever
                  your business needs help.
                </p>

                <ul className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
                  {[
                    "24/7 customer support",
                    "Local technicians with same-day availability",
                    "30-day money-back guarantee",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                        ✓
                      </span>

                      <span className="text-sm leading-5 text-neutral-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Leading Technology */}
            <article
              className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-neutral-200/80 bg-white shadow-[0_18px_50px_rgba(30,24,20,0.07)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(194,65,12,0.14)]"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative m-3 overflow-hidden rounded-[19px] sm:m-4">
                <img
                  src={Home4}
                  alt="Advanced business internet technology"
                  className="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] sm:h-60"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/5 to-transparent" />

                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 2L5 14h6l-1 8 9-13h-6V2z"
                    />
                  </svg>
                </div>

                <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-neutral-950/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  Future Ready
                </span>
              </div>

              <div className="flex flex-1 flex-col px-5 pb-6 pt-2 sm:px-6 sm:pb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                  Advanced Infrastructure
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-2xl">
                  Leading Technology
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Modern network technology built to deliver greater speed, coverage
                  and business security.
                </p>

                <ul className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
                  {[
                    "Fast, secure network",
                    "Advanced Wi-Fi for speed and security",
                    "Nationwide 5G with business mobile plans",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                        ✓
                      </span>

                      <span className="text-sm leading-5 text-neutral-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          {/* Bottom trust line */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-neutral-500 sm:mt-11 sm:text-sm">
            {[
              "Reliable business connectivity",
              "Expert customer assistance",
              "Flexible service options",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Contact Options */}
      <section
        className="relative isolate overflow-hidden bg-white py-14 sm:py-16 lg:py-24"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-36 top-24 h-80 w-80 rounded-full bg-orange-100/60 blur-[120px]" />
          <div className="absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-blue-50/80 blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f1f1_1px,transparent_1px),linear-gradient(to_bottom,#f1f1f1_1px,transparent_1px)] bg-[size:52px_52px] opacity-25 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
          {/* Heading */}
          <div className="mx-auto mb-10 max-w-[720px] text-center sm:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                Business Specialists Available
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
              Let’s find the right solution
              <span className="mt-1 block text-orange-700">
                for your business
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg">
              Connect with a specialist for personalized recommendations, service
              availability and business internet options.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {/* Call card */}
            <article
              className="group relative overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white p-2 shadow-[0_18px_50px_rgba(30,24,20,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(194,65,12,0.15)]"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col rounded-[22px] bg-gradient-to-br from-[#fffaf6] via-white to-white p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-[0_14px_30px_rgba(234,88,12,0.28)] transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105 sm:h-16 sm:w-16">
                    <FaPhoneAlt className="text-lg sm:text-xl" />
                  </div>

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-700 sm:text-[10px]">
                    Call Directly
                  </span>
                </div>

                <div className="mt-7 flex flex-1 flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    Speak With an Expert
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                    Call to order business service
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600 sm:text-base">
                    Discuss available plans and get personalized assistance from one
                    of our business specialists.
                  </p>

                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="12" cy="12" r="8" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 2"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-neutral-900">
                        Business hours
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        Monday–Friday, 8:00 AM–5:00 PM ET
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${PHONE.replace(/\D/g, "")}`}
                    aria-label={`Call ${PHONE}`}
                    className="group/button mt-6 inline-flex min-h-14 w-full items-center justify-between rounded-xl hover:bg-white px-5 text-sm font-semibold hover:font-bold text-white hover:text-orange-700  shadow-[0_14px_30px_rgba(23,23,23,0.18)] transition-all duration-300 hover:-translate-y-0.5 border hover:border-orange-600 bg-orange-700 hover:shadow-[0_18px_38px_rgba(194,65,12,0.28)]"
                  >
                    <span className="inline-flex items-center gap-3">
                      <FaPhoneAlt className="text-xs text-orange-400 transition-colors group-hover/button:text-white" />
                      {PHONE}
                    </span>

                    <span className="text-lg transition-transform duration-300 group-hover/button:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </article>

            {/* Callback card */}
            <article
              className="group relative overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white p-2 shadow-[0_18px_50px_rgba(30,24,20,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(194,65,12,0.15)]"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col rounded-[22px] bg-gradient-to-br from-neutral-50 via-white to-[#fffaf6] p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-700 transition-all duration-500 group-hover:rotate-3 group-hover:scale-105 group-hover:bg-orange-600 group-hover:text-white sm:h-16 sm:w-16">
                    <FaRegUserCircle className="text-xl sm:text-2xl" />
                  </div>

                  <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-orange-700 sm:text-[10px]">
                    Request a Callback
                  </span>
                </div>

                <div className="mt-7 flex flex-1 flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    Contact at Your Convenience
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                    Prefer that we call you?
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600 sm:text-base">
                    Share your details and a business specialist will contact you
                    during regular business hours.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      ["01", "Submit details"],
                      ["02", "Receive a call"],
                    ].map(([number, label]) => (
                      <div
                        key={number}
                        className="rounded-2xl border border-neutral-200/80 bg-white p-4"
                      >
                        <span className="text-[10px] font-bold tracking-[0.18em] text-orange-600">
                          {number}
                        </span>

                        <p className="mt-1 text-xs font-semibold text-neutral-800 sm:text-sm">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact-us"
                    aria-label="Open business contact form"
                    className="group/button mt-6 inline-flex min-h-14 w-full items-center justify-between rounded-xl border border-orange-600 bg-white px-5 text-sm font-semibold text-orange-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:text-white hover:shadow-[0_18px_38px_rgba(194,65,12,0.25)]"
                  >
                    <span>Fill Out Contact Form</span>

                    <span className="text-lg transition-transform duration-300 group-hover/button:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Trust line */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-neutral-500 sm:mt-10 sm:text-sm">
            {[
              "Personalized recommendations",
              "Location-based availability",
              "No-obligation assistance",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                  ✓
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Speed Guidance */}
      <section
        className="relative isolate overflow-hidden bg-[#faf9f7] py-14 sm:py-16 lg:py-24"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-orange-100/60 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-50/80 blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#eeeeee_1px,transparent_1px),linear-gradient(to_bottom,#eeeeee_1px,transparent_1px)] bg-[size:52px_52px] opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          {/* Heading */}
          <div className="mx-auto mb-10 max-w-[760px] text-center sm:mb-12 lg:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.12)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                Business Speed Guide
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
              How much internet speed
              <span className="mt-1 block text-orange-700">
                does your business need?
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[650px] text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg lg:leading-8">
              Compare speed levels based on your team size, connected devices and
              everyday online activities.
            </p>
          </div>

          {/* Speed cards */}
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-7">
            {[
              {
                speed: "25+",
                unit: "Mbps",
                label: "Essential",
                subtitle: "For light business use",
                percentage: "30%",
                accent: "bg-amber-500",
                iconBg: "bg-amber-50",
                iconColor: "text-amber-700",
                badge: "border-amber-200 bg-amber-50 text-amber-700",
                delay: "100",
                features: [
                  "Web browsing and business email",
                  "HD video streaming",
                  "Supports 1–2 connected devices",
                  "Ideal for 1–2 users",
                ],
              },
              {
                speed: "100+",
                unit: "Mbps",
                label: "Recommended",
                subtitle: "For growing small teams",
                percentage: "70%",
                accent: "bg-orange-600",
                iconBg: "bg-orange-50",
                iconColor: "text-orange-700",
                badge: "border-orange-200 bg-orange-50 text-orange-700",
                delay: "200",
                featured: true,
                features: [
                  "Ultra HD and 4K streaming",
                  "Reliable video conferencing",
                  "Supports 3–5 connected devices",
                  "Ideal for teams of 2–6 users",
                ],
              },
              {
                speed: "1",
                unit: "Gig",
                label: "Premium",
                subtitle: "For demanding operations",
                percentage: "100%",
                accent: "bg-neutral-950",
                iconBg: "bg-neutral-100",
                iconColor: "text-neutral-900",
                badge: "border-neutral-200 bg-neutral-100 text-neutral-700",
                delay: "300",
                features: [
                  "Multiple simultaneous 4K streams",
                  "Cloud apps and large file transfers",
                  "Supports multiple connected devices",
                  "Ideal for teams of 6+ users",
                ],
              },
            ].map((plan) => (
              <article
                key={plan.label}
                data-aos="fade-up"
                data-aos-delay={plan.delay}
                className={`group relative flex h-full flex-col rounded-[28px] border bg-white p-2 transition-all duration-500 hover:-translate-y-2 ${plan.featured
                    ? "border-orange-300 shadow-[0_24px_65px_rgba(194,65,12,0.16)]"
                    : "border-neutral-200/80 shadow-[0_18px_50px_rgba(30,24,20,0.07)] hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(194,65,12,0.13)]"
                  }`}
              >
                {/* Recommended label */}
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
                    <span className="inline-flex whitespace-nowrap rounded-full bg-orange-600 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(234,88,12,0.3)] sm:text-[10px]">
                      Best for Small Business
                    </span>
                  </div>
                )}

                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-[22px] p-5 sm:p-6 ${plan.featured
                      ? "bg-gradient-to-b from-[#fff7f1] via-white to-white"
                      : "bg-gradient-to-b from-neutral-50/80 to-white"
                    }`}
                >
                  {/* Decorative glow */}
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[75px] transition-opacity duration-500 group-hover:opacity-100 ${plan.featured
                        ? "bg-orange-200/70 opacity-80"
                        : "bg-orange-100/60 opacity-30"
                      }`}
                  />

                  {/* Card header */}
                  <div className="relative flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${plan.iconBg} ${plan.iconColor} transition-all duration-500 group-hover:scale-105`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-6 w-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 13a8 8 0 0116 0"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 13a5 5 0 0110 0M10 13a2 2 0 014 0"
                        />
                        <circle cx="12" cy="17" r="1" fill="currentColor" />
                      </svg>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] ${plan.badge}`}
                    >
                      {plan.label}
                    </span>
                  </div>

                  {/* Speed */}
                  <div className="relative mt-7">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-semibold leading-none tracking-[-0.05em] text-neutral-950 sm:text-5xl">
                        {plan.speed}
                      </span>

                      <span className="pb-1 text-lg font-semibold text-neutral-500">
                        {plan.unit}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-medium text-neutral-600">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Speed meter */}
                  <div className="relative mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                        Speed Capacity
                      </span>

                      <span className="text-xs font-semibold text-neutral-700">
                        {plan.percentage}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-neutral-200/80">
                      <div
                        className={`h-full rounded-full ${plan.accent} transition-all duration-1000 ease-out`}
                        style={{ width: plan.percentage }}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="relative mt-7 flex-1 space-y-3 border-t border-neutral-200/80 pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                          ✓
                        </span>

                        <span className="text-sm leading-5 text-neutral-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Bottom indicator */}
                  <div className="relative mt-7 flex items-center justify-between border-t border-neutral-100 pt-5">
                    <span className="text-xs font-medium text-neutral-500">
                      Estimated business usage
                    </span>

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${plan.accent} shadow-[0_0_0_4px_rgba(0,0,0,0.04)]`}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mx-auto mt-9 flex max-w-[850px] items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:mt-11 sm:items-center sm:px-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11v5M12 8h.01"
                />
              </svg>
            </div>

            <p className="text-xs leading-5 text-neutral-500 sm:text-sm">
              Recommended speeds are general estimates. Actual requirements may vary
              based on simultaneous users, applications, equipment and network
              conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Smart Tools Section */}
      <section
        className="relative isolate overflow-hidden bg-white py-14 sm:py-16 lg:py-24"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-12 h-80 w-80 rounded-full bg-orange-100/60 blur-[120px]" />
          <div className="absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-blue-50/80 blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:52px_52px] opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
          {/* Heading */}
          <div className="mx-auto mb-10 max-w-[760px] text-center sm:mb-12 lg:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.12)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                Free Business Tools
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
              Make a smarter choice
              <span className="mt-1 block text-orange-700">
                before selecting your plan
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[650px] text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg lg:leading-8">
              Estimate your ideal bandwidth and evaluate your current connection with
              simple tools designed to help your business choose confidently.
            </p>
          </div>

          {/* Tool cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {/* Bandwidth Calculator */}
            <article
              className="group relative overflow-hidden rounded-[30px] border border-neutral-200/80 bg-white p-2 shadow-[0_18px_50px_rgba(30,24,20,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_30px_75px_rgba(194,65,12,0.15)]"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[23px] bg-gradient-to-br from-[#fff8f2] via-white to-white p-6 sm:p-8">
                {/* Decorative glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-200/50 blur-[85px] transition-all duration-700 group-hover:bg-orange-300/60" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-orange-200/80 bg-white shadow-[0_14px_32px_rgba(194,65,12,0.13)] transition-all duration-500 group-hover:-rotate-3 group-hover:scale-105 sm:h-[72px] sm:w-[72px]">
                    <img
                      src={BandWidth}
                      alt="Bandwidth calculator"
                      className="h-8 w-8 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-10 sm:w-10"
                    />
                  </div>

                  <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-orange-700 sm:text-[10px]">
                    Plan Advisor
                  </span>
                </div>

                <div className="relative mt-7 flex flex-1 flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    Estimate Your Requirements
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-[1.7rem]">
                    Bandwidth Calculator
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                    Get a personalized speed recommendation based on your team,
                    connected devices and everyday business activities.
                  </p>

                  {/* Tool details */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      ["01", "Add devices"],
                      ["02", "Get speed estimate"],
                    ].map(([number, label]) => (
                      <div
                        key={number}
                        className="rounded-2xl border border-neutral-200/80 bg-white/90 p-4 shadow-sm"
                      >
                        <span className="text-[10px] font-bold tracking-[0.18em] text-orange-600">
                          {number}
                        </span>

                        <p className="mt-1 text-xs font-semibold leading-5 text-neutral-800 sm:text-sm">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCalculator(true)}
                    className="group/button mt-7 inline-flex min-h-14 w-full items-center justify-between rounded-xl hover:bg-white px-5 text-sm font-semibold text-white hover:text-orange-700 shadow-[0_14px_30px_rgba(23,23,23,0.18)] transition-all duration-300 hover:-translate-y-0.5 bg-orange-600 hover:shadow-[0_18px_38px_rgba(194,65,12,0.28)] active:translate-y-0 border hover:border-orange-700"
                  >
                    <span className="inline-flex items-center gap-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5 text-white transition-colors duration-300 group-hover/button:text-orange-600"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="4" y="3" width="16" height="18" rx="2" />
                        <path
                          strokeLinecap="round"
                          d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2"
                        />
                      </svg>

                      Calculate My Bandwidth
                    </span>

                    <span className="text-lg transition-transform duration-300 group-hover/button:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </article>

            {/* Speed Test */}
            <article
              className="group relative overflow-hidden rounded-[30px] border border-neutral-200/80 bg-white p-2 shadow-[0_18px_50px_rgba(30,24,20,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_30px_75px_rgba(194,65,12,0.15)]"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[23px] bg-gradient-to-br from-neutral-50 via-white to-[#fff8f2] p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-100/70 blur-[85px] transition-all duration-700 group-hover:bg-orange-200/60" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-neutral-200 bg-white shadow-[0_14px_32px_rgba(30,24,20,0.1)] transition-all duration-500 group-hover:rotate-3 group-hover:scale-105 sm:h-[72px] sm:w-[72px]">
                    <img
                      src={SpeedoMeter}
                      alt="Internet speed test"
                      className="h-8 w-8 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-10 sm:w-10"
                    />
                  </div>

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-700 sm:text-[10px]">
                    Live Connection Test
                  </span>
                </div>

                <div className="relative mt-7 flex flex-1 flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    Measure Current Performance
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-[1.7rem]">
                    Internet Speed Test
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                    Check your current download and upload performance directly from
                    the page with a quick, easy-to-use connection test.
                  </p>

                  {/* Test indicators */}
                  <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      ["↓", "Download"],
                      ["↑", "Upload"],
                      ["↔", "Response"],
                    ].map(([symbol, label]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-neutral-200/80 bg-white/90 p-3 text-center shadow-sm sm:p-4"
                      >
                        <span className="text-base font-semibold text-orange-600">
                          {symbol}
                        </span>

                        <p className="mt-1 truncate text-[10px] font-semibold text-neutral-700 sm:text-xs">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSpeedTest(true)}
                    className="group/button mt-7 inline-flex min-h-14 w-full items-center justify-between rounded-xl border border-orange-600 bg-white px-5 text-sm font-semibold text-orange-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:text-white hover:shadow-[0_18px_38px_rgba(194,65,12,0.25)] active:translate-y-0"
                  >
                    <span className="inline-flex items-center gap-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 13a8 8 0 0116 0"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 13l4-4"
                        />
                        <circle cx="12" cy="13" r="1.5" />
                      </svg>

                      Run Speed Test
                    </span>

                    <span className="text-lg transition-transform duration-300 group-hover/button:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Bottom information */}
          <div className="mx-auto mt-9 flex max-w-[850px] items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:mt-11 sm:items-center sm:px-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11v5M12 8h.01"
                />
              </svg>
            </div>

            <p className="text-xs leading-5 text-neutral-500 sm:text-sm">
              Speed-test results can vary depending on your device, Wi-Fi connection,
              network traffic and other active applications.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Testimonials */}
      <section
        className="relative isolate overflow-hidden bg-[#faf9f7] py-14 sm:py-16 lg:py-24"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-orange-100/60 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-50/80 blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#eeeeee_1px,transparent_1px),linear-gradient(to_bottom,#eeeeee_1px,transparent_1px)] bg-[size:52px_52px] opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          {/* Heading */}
          <div className="mx-auto mb-10 max-w-[760px] text-center sm:mb-12 lg:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="flex text-[10px] tracking-[2px] text-amber-500">
                ★★★★★
              </span>

              <span className="h-3 w-px bg-neutral-300" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700 sm:text-xs">
                Customer Stories
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
              Trusted by businesses that
              <span className="mt-1 block text-orange-700">
                depend on reliable connectivity
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[650px] text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg lg:leading-8">
              Discover what customers say about their service experience,
              performance and support.
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {testimonials.map((testimonial, index) => {
              const rating = Math.min(
                5,
                Math.max(0, Number(testimonial?.rating) || 0)
              );

              return (
                <article
                  key={testimonial?.id ?? index}
                  className={`group relative flex h-full flex-col rounded-[28px] border bg-white p-2 transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_28px_70px_rgba(194,65,12,0.14)] ${index === 1
                      ? "border-orange-200 shadow-[0_24px_65px_rgba(194,65,12,0.12)]"
                      : "border-neutral-200/80 shadow-[0_18px_50px_rgba(30,24,20,0.07)]"
                    }`}
                  data-aos="fade-up"
                  data-aos-delay={(index % 3) * 120}
                >
                  {/* Top highlight */}
                  <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-gradient-to-b from-white via-white to-[#fffaf6] p-5 sm:p-6">
                    {/* Decorative quote */}
                    <div className="pointer-events-none absolute -right-2 -top-7 font-serif text-[130px] leading-none text-orange-100/70 transition-all duration-500 group-hover:text-orange-100">
                      “
                    </div>

                    {/* Rating and verification */}
                    <div className="relative flex items-center justify-between gap-3">
                      <div
                        className="flex items-center gap-1"
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {[...Array(5)].map((_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            className={`text-sm sm:text-base ${starIndex < Math.round(rating)
                                ? "text-amber-400"
                                : "text-neutral-200"
                              }`}
                          />
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[8px] text-white">
                          ✓
                        </span>
                        Verified
                      </span>
                    </div>

                    {/* Review */}
                    <blockquote className="relative mt-7 flex-1">
                      <p className="text-[15px] leading-7 text-neutral-700 sm:text-base">
                        “{testimonial?.comment}”
                      </p>
                    </blockquote>

                    {/* Customer */}
                    <div className="relative mt-7 flex items-center gap-4 border-t border-neutral-200/80 pt-5">
                      <div className="relative shrink-0">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-orange-500 to-amber-300 opacity-70 blur-[1px] transition-opacity duration-300 group-hover:opacity-100" />

                        <img
                          src={testimonial?.image}
                          alt={`${testimonial?.name || "Customer"} profile`}
                          loading="lazy"
                          className="relative h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-500 group-hover:scale-105 sm:h-14 sm:w-14"
                        />

                        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-orange-600 text-[9px] font-bold text-white">
                          ✓
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-neutral-950 transition-colors duration-300 group-hover:text-orange-700 sm:text-base">
                          {testimonial?.name}
                        </h3>

                        <p className="mt-0.5 truncate text-xs text-neutral-500 sm:text-sm">
                          {testimonial?.location}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-neutral-900">
                          {rating.toFixed(1)}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                          Rating
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Trust summary */}
          <div className="mt-9 grid overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white/80 shadow-sm backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-neutral-200 lg:mt-12">
            {[
              ["Responsive", "Customer support"],
              ["Reliable", "Business connectivity"],
              ["Personalized", "Plan recommendations"],
            ].map(([title, label], index) => (
              <div
                key={title}
                className={`flex items-center justify-center gap-3 px-5 py-4 ${index !== 0 ? "border-t border-neutral-200 sm:border-t-0" : ""
                  }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                  ✓
                </span>

                <div>
                  <p className="text-sm font-semibold text-neutral-900">{title}</p>
                  <p className="text-xs text-neutral-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium FAQ Section */}
      <section
        className="relative isolate overflow-hidden bg-white py-14 sm:py-16 lg:py-24"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-12 h-80 w-80 rounded-full bg-orange-100/60 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-50/80 blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:52px_52px] opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12">
          {/* Heading */}
          <div className="mx-auto mb-10 max-w-[760px] text-center sm:mb-12 lg:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[11px] font-bold text-white">
                ?
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 sm:text-xs">
                Help Center
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-[2.8rem]">
              Frequently asked
              <span className="ml-2 text-orange-700 sm:ml-3">questions</span>
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-neutral-600 sm:text-base lg:text-lg lg:leading-8">
              Get clear answers about business internet, speed, installation and
              choosing the right service for your needs.
            </p>
          </div>

          {/* FAQ list */}
          <div className="mx-auto max-w-[920px] space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={faq?.id ?? index}
                className="group relative overflow-hidden rounded-[22px] border border-neutral-200/80 bg-white shadow-[0_12px_35px_rgba(30,24,20,0.06)] transition-all duration-500 open:border-orange-200 open:shadow-[0_20px_50px_rgba(194,65,12,0.11)] hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(30,24,20,0.09)]"
                data-aos="fade-up"
                data-aos-delay={(index % 5) * 80}
              >
                {/* Open-state accent */}
                <div className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-orange-500 to-orange-700 transition-transform duration-500 group-open:scale-y-100" />

                <summary className="relative flex min-h-[76px] cursor-pointer list-none items-center gap-4 px-5 py-4 marker:hidden sm:min-h-[88px] sm:px-7 sm:py-5 [&::-webkit-details-marker]:hidden">
                  {/* Question number */}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-500 transition-all duration-300 group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-700 group-open:border-orange-600 group-open:bg-orange-600 group-open:text-white sm:h-11 sm:w-11">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1 pr-1 text-left text-sm font-semibold leading-6 text-neutral-900 transition-colors duration-300 group-hover:text-orange-700 group-open:text-orange-700 sm:text-base md:text-[17px]">
                    {faq?.question}
                  </span>

                  {/* Expand button */}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-all duration-300 group-hover:border-orange-200 group-hover:text-orange-700 group-open:rotate-45 group-open:border-orange-600 group-open:bg-orange-600 group-open:text-white sm:h-10 sm:w-10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                  </span>
                </summary>

                {/* Answer */}
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-open:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="ml-[76px] border-t border-neutral-100 px-5 pb-6 pt-4 sm:ml-[94px] sm:px-7 sm:pb-7 sm:pt-5">
                      <p className="max-w-[720px] text-sm leading-7 text-neutral-600 sm:text-[15px] sm:leading-7">
                        {faq?.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Support CTA */}
          <div className="mx-auto mt-10 flex max-w-[920px] flex-col items-start justify-between gap-5 rounded-[24px] border border-orange-200/80 bg-gradient-to-r from-[#fff7f1] via-white to-[#fffaf6] p-5 shadow-[0_18px_45px_rgba(194,65,12,0.08)] sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-[0_10px_25px_rgba(194,65,12,0.25)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h8M8 14h5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3a9 9 0 00-7.5 14l-1 4 4-1A9 9 0 1012 3z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-semibold text-neutral-950 sm:text-lg">
                  Still have a question?
                </h3>

                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  Our business specialists can help you find the right solution.
                </p>
              </div>
            </div>

            <Link
              to="/contact-us"
              className="group/button inline-flex min-h-12 w-full shrink-0 items-center justify-between rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(23,23,23,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_16px_34px_rgba(194,65,12,0.25)] sm:w-auto sm:gap-8"
            >
              Contact Our Team

              <span className="text-lg transition-transform duration-300 group-hover/button:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
