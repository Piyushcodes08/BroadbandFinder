import { useEffect, useRef, useState } from "react";
import { FaPhoneAlt, FaRegUserCircle, FaStar, FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Att from "../assets/att.png";
import BandWidth from "../assets/bandwidth.png";
import Comcast from "../assets/comcast.png";
import Home1 from "../assets/home1.jpg";
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
        "https://zenith.cloudastro.space/api/search/providers",
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
    <div className="font-sans text-gray-900 bg-white min-h-screen overflow-x-hidden">
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
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isScrolled ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <a
          href={`tel:${PHONE.replaceAll?.("-", "")}`}
          className="flex items-center gap-3 px-5 py-3 bg-red-700 text-white font-semibold rounded-full shadow-xl hover:bg-red-800 transition-all duration-300 hover:shadow-2xl animate-pulse"
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

      {/* Hero Section */}
      <section className="relative">
        <div className="relative">
          <img
            src={Home1}
            alt="Business internet solutions"
            className="object-cover h-[260px] sm:h-[660px] w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/100  z-10"></div>
          <div className="absolute inset-0 z-20 px-4 sm:px-10 lg:px-20 flex flex-col justify-center items-start">
            <h2 className="font-semibold text-gray-850">SPECTRUM BUSINESS®</h2>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight max-w-2xl">
              Free forever. <br />
              Fiber-Powered <br />
              Internet.
            </h1>
            <p className="text-gray-850 text-lg sm:text-xl mt-4 max-w-xl">
              With Spectrum Business, you can get 100 Mbps Fiber-Powered
              Business Internet Advantage free forever when you add four
              Business Mobile lines.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2 text-lg">
              <li>Get Advanced WiFi for greater speed and security</li>
            </ul>
            <p className="text-xs pt-5">
              Spectrum Business Internet is powered by fiber and delivered to
              the premises via HFC.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a href={`tel:${PHONE.replaceAll("-", "")}`}>
                <button className="bg-gray-600 hover:bg-gray-700 px-6 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg text-white font-semibold flex items-center transition">
                  <FaPhoneAlt className="mr-3" />
                  <span className="text-lg">{PHONE}</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-gray-50 py-6 md:py-8 animate-slideUp">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border-l-4 border-red-600 p-4 sm:p-6 rounded-r-lg transition-all duration-300 hover:shadow-md">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center transition-colors duration-300">
              #1 in Customer Satisfaction for Internet Service
            </h2>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 sm:py-1 md:pt-7 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto animate-slideUp">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 transition-colors duration-300">
                Find Internet Provider in Your Area
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg transition-colors duration-300">
                Enter your ZIP code to see all available internet providers and
                plans in your location.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
              <div className="relative mb-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <div className="relative">
                      <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base transition-colors duration-300" />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d{5}"
                        placeholder="Enter a 5-digit ZIP code to find available providers"
                        value={zipInput}
                        onChange={onZipChange}
                        onKeyDown={onZipKeyDown}
                        aria-autocomplete="list"
                        aria-expanded={suggestions.length > 0}
                        aria-controls="zip-suggest"
                        className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 outline-none transition-all duration-300 text-sm sm:text-base hover:border-gray-400"
                      />
                    </div>

                    {suggestions.length > 0 && (
                      <ul
                        id="zip-suggest"
                        className="absolute z-50 mt-1 sm:mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 sm:max-h-64 overflow-y-auto animate-fadeIn"
                        role="listbox"
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
                            className={`px-3 sm:px-4 py-2 sm:py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                              activeSugIdx === i
                                ? "bg-red-50 text-red-700 scale-[1.02]"
                                : "hover:bg-gray-50 hover:translate-x-1"
                            }`}
                          >
                            <div className="font-medium text-sm sm:text-base">
                              {s.zip}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              {s.city}, {s.state}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap shadow-sm hover:shadow-md active:scale-95"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="hidden sm:inline">Searching...</span>
                        <span className="sm:hidden">Searching</span>
                      </>
                    ) : (
                      <>
                        <FaSearch className="text-xs sm:text-sm transition-transform duration-300 group-hover:scale-110" />
                        <span className="hidden sm:inline">
                          Search Providers
                        </span>
                        <span className="sm:hidden">Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section - SMALL CARDS FOR SEARCH RESULTS */}
      <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-8 sm:py-12 animate-fadeIn">
              <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
              <p className="text-base sm:text-lg text-gray-600 transition-colors duration-300">
                Finding providers in your area...
              </p>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 animate-fadeIn">
              <div className="text-4xl sm:text-5xl mb-4 animate-bounce">📡</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 transition-colors duration-300">
                No Providers Found
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base transition-colors duration-300">
                We couldn't find any providers in this ZIP code.
              </p>
              <button
                onClick={() => {
                  setZipInput("");
                  setSelectedZip("");
                  setResults([]);
                  setHasSearched(false);
                }}
                className="px-4 sm:px-6 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg transition-all duration-300 text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95"
              >
                Try Another ZIP Code
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
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

                const hideSpeedUpTo = ["spectrum voip", "ringcentral"].includes(
                  normalize(name)
                );

                return (
                  <div
                    key={key}
                    className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6">
                        {/* Logo - Smaller for search results */}
                        <div className="flex-shrink-0">
                          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg transition-all duration-300 group-hover:bg-gray-100 group-hover:scale-105">
                            <img
                              src={logo}
                              alt={`${name} logo`}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 sm:mb-3">
                            <div className="mb-1 md:mb-0">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5 transition-colors duration-300 group-hover:text-red-700">
                                {name}
                              </h3>
                              <p className="text-gray-600 text-xs sm:text-sm transition-colors duration-300">
                                Business Internet Provider
                              </p>
                            </div>
                            <button
                              onClick={() => openDetails(name)}
                              className="text-blue-600 hover:text-red-800 font-medium text-xs sm:text-sm flex items-center gap-1 transition-all duration-300 group"
                            >
                              <span className="group-hover:translate-x-1 transition-transform duration-300">
                                View Details →
                              </span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg transition-all duration-300 hover:shadow-sm hover:bg-gray-100">
                              <p className="text-xs font-medium text-gray-700 mb-0.5 transition-colors duration-300">
                                Plans Starting At
                              </p>
                              <p className="text-xl sm:text-2xl font-bold text-red-600 transition-all duration-300">
                                {startingPrice}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 transition-colors duration-300">
                                {conditions}
                              </p>
                            </div>

                            {!hideSpeedUpTo && (
                              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg transition-all duration-300 hover:shadow-sm hover:bg-gray-100">
                                <p className="text-xs font-medium text-gray-700 mb-0.5 transition-colors duration-300">
                                  Speeds Up To
                                </p>
                                <p className="text-lg sm:text-xl font-bold text-gray-900 transition-all duration-300">
                                  {speed}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 transition-colors duration-300">
                                  Speeds may vary by location
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                              onClick={() => handleBook(p)}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex-1 text-center text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-95"
                            >
                              Book Appointment
                            </button>
                            <button
                              onClick={() => openDetails(name)}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-300 flex-1 text-center text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-95"
                            >
                              View Plans
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Details Modal - NO SCROLLING */}
      {isDetailsOpen &&
        detailsProvider &&
        (() => {
          const details =
            PROVIDER_DETAILS?.find((x) => x?.name === detailsProvider) || null;

          const plans = details?.plans || [];
          const totalSlides = Math.max(
            1,
            Math.ceil(plans?.length / itemsPerSlide)
          );
          const safeIndex =
            ((currentSlide % totalSlides) + totalSlides) % totalSlides;
          const startIndex = safeIndex * itemsPerSlide;
          const visiblePlans =
            plans?.slice(startIndex, startIndex + itemsPerSlide) || [];

          const phoneDisplay = details?.phone || PHONE;

          const handlePrev = () =>
            setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
          const handleNext = () =>
            setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));

          return (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn"
              role="dialog"
              aria-modal="true"
              onClick={() => setIsDetailsOpen(false)}
            >
              <div
                className="bg-white rounded-lg sm:rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <div className="pr-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 transition-colors duration-300">
                      {details?.name || detailsProvider} - Available Plans
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base transition-colors duration-300">
                      Compare plans and features
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 flex-shrink-0 active:scale-95"
                    aria-label="Close details"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Content - NO SCROLLING */}
                <div className="flex-1 p-4 sm:p-6">
                  {!details ? (
                    <div className="text-center py-8 sm:py-12 animate-fadeIn">
                      <p className="text-gray-600 transition-colors duration-300">
                        No additional details available for this provider.
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Carousel Controls */}
                      {plans?.length > itemsPerSlide && (
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <button
                            onClick={handlePrev}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 active:scale-95"
                            aria-label="Previous plans"
                          >
                            <TiArrowLeft className="text-xl sm:text-2xl text-gray-700 transition-colors duration-300" />
                          </button>
                          <div className="text-xs sm:text-sm text-gray-600 px-2 text-center transition-colors duration-300">
                            Showing {startIndex + 1}-
                            {Math.min(
                              startIndex + itemsPerSlide,
                              plans?.length || 0
                            )}{" "}
                            of {plans?.length || 0} plans
                          </div>
                          <button
                            onClick={handleNext}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 active:scale-95"
                            aria-label="Next plans"
                          >
                            <TiArrowRight className="text-xl sm:text-2xl text-gray-700 transition-colors duration-300" />
                          </button>
                        </div>
                      )}

                      {/* Plans Grid - Responsive based on itemsPerSlide */}
                      <div
                        className={`
                        grid grid-cols-1 
                        ${itemsPerSlide >= 2 ? "md:grid-cols-2" : ""}
                        ${itemsPerSlide >= 3 ? "lg:grid-cols-3" : ""}
                        gap-3 sm:gap-4
                      `}
                      >
                        {visiblePlans.map((plan, idx) => (
                          <div
                            key={`${startIndex + idx}-${plan?.title}`}
                            className="border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 p-3 sm:p-4 flex flex-col animate-slideUp"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                          >
                            <div className="mb-2 sm:mb-3">
                              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-red-700">
                                {plan?.title}
                              </h3>
                              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 transition-all duration-300">
                                {plan?.price}
                                <span className="text-sm font-normal text-gray-500 transition-colors duration-300">
                                  /mo
                                </span>
                              </div>
                            </div>

                            {plan?.details?.length > 0 && (
                              <div className="mb-3 sm:mb-4">
                                <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm transition-colors duration-300">
                                  Features
                                </h4>
                                <ul className="space-y-1">
                                  {plan?.details?.slice(0, 3).map((d, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-1.5 transition-all duration-300 hover:translate-x-1"
                                      style={{ transitionDelay: `${i * 50}ms` }}
                                    >
                                      <TiTick className="text-green-600 flex-shrink-0 mt-0.5 text-xs transition-transform duration-300 hover:scale-110" />
                                      <span className="text-gray-700 text-xs transition-colors duration-300">
                                        {d}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {plan?.inbundle && (
                              <div className="mb-3 sm:mb-4 p-2 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
                                <p className="font-medium text-gray-800 text-xs transition-colors duration-300">
                                  Bundle Includes:
                                </p>
                                <p className="text-gray-700 text-xs transition-colors duration-300">
                                  {plan.inbundle}
                                </p>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                handleBook({
                                  name: details?.name || detailsProvider,
                                });
                                setIsDetailsOpen(false);
                              }}
                              className="mt-auto w-full py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-95"
                            >
                              Book This Plan
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Dots */}
                      {plans?.length > itemsPerSlide && (
                        <div className="flex justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
                          {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={`w-4 sm:w-6 h-1 sm:h-1.5 rounded-full transition-all duration-300 hover:scale-110 ${
                                idx === safeIndex
                                  ? "bg-red-600"
                                  : "bg-gray-300 hover:bg-gray-400"
                              }`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                    <div>
                      <p className="text-gray-700 text-xs sm:text-sm transition-colors duration-300">
                        Need help choosing a plan?
                      </p>
                      <a
                        href={`tel:${phoneDisplay?.replaceAll?.("-", "")}`}
                        className="text-sm sm:text-base font-semibold text-gray-900 hover:text-red-600 transition-all duration-300 flex items-center gap-1.5 group"
                      >
                        <FaPhoneAlt className="transition-transform duration-300 group-hover:scale-110" />
                        {phoneDisplay}
                      </a>
                    </div>
                    <button
                      onClick={() => setIsDetailsOpen(false)}
                      className="px-3 sm:px-4 py-1.5 border border-gray-400 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-all duration-300 text-xs sm:text-sm w-full sm:w-auto shadow-sm hover:shadow-md active:scale-95"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Providers Section - ORIGINAL SIZE CARDS (NOT SMALL) */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-slideUp">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
              Our Internet Service Providers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base transition-colors duration-300">
              Choose from our trusted network of leading business internet
              providers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Spectrum */}
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp">
              <div className="flex flex-col items-center text-center h-full">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-gray-100 group-hover:scale-105">
                  <img
                    src={Spectrum}
                    alt="Spectrum Business"
                    className="h-16 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-red-700">
                  Spectrum Business
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 flex-grow text-sm sm:text-base transition-colors duration-300">
                  Blazing-fast internet with unlimited data. Great for
                  streaming, gaming, and remote work.
                </p>
                <Link
                  to="/internet/SpectrumBusiness"
                  className="px-4 sm:px-6 py-2  hover:bg-red-700 border border-red-700 text-red-600 font-medium rounded-lg transition-all duration-300 w-full text-center text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95"
                >
                  Explore 
                </Link>
              </div>
            </div>

            {/* AT&T */}
            <div
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-gray-100 group-hover:scale-105">
                  <img
                    src={Att}
                    alt="AT&T Business"
                    className="h-16 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-red-700">
                  AT&T Business
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 flex-grow text-sm sm:text-base transition-colors duration-300">
                  A variety of business internet packages with excellent
                  coverage and support.
                </p>
                <Link
                  to="/internet/AttBusiness"
                  className="px-4 sm:px-6 py-2  hover:bg-red-700 border border-red-700 text-red-600 font-medium rounded-lg transition-all duration-300 w-full text-center text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Comcast */}
            <div
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-gray-100 group-hover:scale-105">
                  <img
                    src={Comcast}
                    alt="Comcast Business"
                    className="h-16 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-red-700">
                  Comcast Business
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 flex-grow text-sm sm:text-base transition-colors duration-300">
                  Fast and consistent connectivity with cable and fiber options.
                </p>
                <Link
                  to="/internet/ComcastBusiness"
                  className="px-4 sm:px-6 py-2  hover:bg-red-700 border border-red-700 text-red-600 font-medium rounded-lg transition-all duration-300 w-full text-center text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* ACC Business */}
            <div
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-gray-100 group-hover:scale-105">
                  <img
                    src={Acc}
                    alt="ACC Business"
                    className="h-16 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-red-700">
                  ACC Business
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 flex-grow text-sm sm:text-base transition-colors duration-300">
                  Reliable internet solutions tailored for enterprises and small
                  businesses.
                </p>
                <Link
                  to="/internet/AccBusiness"
                  className="px-4 sm:px-6 py-2  hover:bg-red-700 border border-red-700 text-red-600 font-medium rounded-lg transition-all duration-300 w-full text-center text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95"
                >
                  Explore 
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1 animate-slideUp">
              <div className="overflow-hidden rounded-lg sm:rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl">
                <img
                  src={Home5}
                  alt="Check internet providers in your area"
                  className="w-full rounded-lg sm:rounded-xl shadow-lg object-cover h-48 sm:h-64 md:h-80 lg:h-96 transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            <div
              className="order-1 lg:order-2 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 transition-colors duration-300">
                Find Internet Providers in Your Area
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-gray-700 text-sm sm:text-base md:text-lg transition-colors duration-300">
                  We provide reliable internet service from trusted providers —{" "}
                  <span className="font-semibold text-gray-900">Spectrum</span>,{" "}
                  <span className="font-semibold text-gray-900">AT&T</span>, and{" "}
                  <span className="font-semibold text-gray-900">Comcast</span>.
                  Coverage varies by location.
                </p>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg transition-colors duration-300">
                  Internet speeds depend on your plan, connection type (DSL,
                  cable, or fiber), distance to the network, and your Wi-Fi
                  router's performance.
                </p>
              </div>

              <div className="mt-6 sm:mt-8">
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300">
                  Trusted by leading providers:
                </p>
                <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                  <img
                    src={Spectrum}
                    alt="Spectrum"
                    className="h-8 sm:h-10 md:h-12 object-contain transition-all duration-300 hover:scale-110"
                  />
                  <img
                    src={Att}
                    alt="AT&T"
                    className="h-8 sm:h-10 md:h-12 object-contain transition-all duration-300 hover:scale-110"
                  />
                  <img
                    src={Comcast}
                    alt="Comcast"
                    className="h-8 sm:h-10 md:h-12 object-contain transition-all duration-300 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-6 sm:py-8 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md animate-slideUp">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
              Find the best plan for your business
            </h2>
            <a
              href={`tel:${PHONE.replaceAll?.("-", "")}`}
              className="inline-flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-red-600 hover:text-red-700 transition-all duration-300 group"
            >
              <FaPhoneAlt className="text-sm sm:text-base transition-transform duration-300 group-hover:scale-110" />
              {PHONE}
            </a>
            <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base transition-colors duration-300">
              Call now for personalized assistance
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-slideUp">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
              Why Choose Our Services?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg transition-colors duration-300">
              We are committed to keeping you connected 100% of the time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp">
              <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg transition-all duration-500 hover:shadow-md">
                <img
                  src={Home2}
                  alt="Superior experience"
                  className="w-full h-40 sm:h-48 object-cover rounded-lg transition-transform duration-700 hover:scale-105"
                />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-red-700">
                Superior Experience
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "Fast, reliable business Internet",
                  "Flexible plans and pricing",
                  "Multi-year price guarantees available",
                ].map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 transition-all duration-300 hover:translate-x-1"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <TiTick className="text-green-600 flex-shrink-0 mt-0.5 sm:mt-1 transition-transform duration-300 hover:scale-110" />
                    <span className="text-gray-700 text-sm sm:text-base transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg transition-all duration-500 hover:shadow-md">
                <img
                  src={Home3}
                  alt="Exceptional service"
                  className="w-full h-40 sm:h-48 object-cover rounded-lg transition-transform duration-700 hover:scale-105"
                />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-red-700">
                Exceptional Service
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "24/7 customer support",
                  "Local technicians with same-day availability",
                  "30-day money-back guarantee",
                ].map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 transition-all duration-300 hover:translate-x-1"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <TiTick className="text-green-600 flex-shrink-0 mt-0.5 sm:mt-1 transition-transform duration-300 hover:scale-110" />
                    <span className="text-gray-700 text-sm sm:text-base transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg transition-all duration-500 hover:shadow-md">
                <img
                  src={Home4}
                  alt="Leading technology"
                  className="w-full h-40 sm:h-48 object-cover rounded-lg transition-transform duration-700 hover:scale-105"
                />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-red-700">
                Leading Technology
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "Fast, secure network",
                  "Advanced Wi-Fi for speed and security",
                  "Nationwide 5G with business mobile plans",
                ].map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 transition-all duration-300 hover:translate-x-1"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <TiTick className="text-green-600 flex-shrink-0 mt-0.5 sm:mt-1 transition-transform duration-300 hover:scale-110" />
                    <span className="text-gray-700 text-sm sm:text-base transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-slideUp">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
              Speak with a Specialist
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg transition-colors duration-300">
              Our small business specialists are ready to help you find the
              right solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300 group-hover:bg-red-200 group-hover:scale-110">
                  <FaPhoneAlt className="text-lg sm:text-xl md:text-2xl text-red-600 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-red-700">
                  Call to Order Business Service
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base transition-colors duration-300">
                  Monday – Friday, 8am – 5pm ET.
                </p>
                <a
                  href={`tel:${PHONE.replaceAll?.("-", "")}`}
                  className="w-full"
                >
                  <button className="w-full py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95">
                    <FaPhoneAlt className="transition-transform duration-300 group-hover:scale-110" />
                    {PHONE}
                  </button>
                </a>
              </div>
            </div>

            <div
              className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300 group-hover:bg-red-200 group-hover:scale-110">
                  <FaRegUserCircle className="text-lg sm:text-xl md:text-2xl text-red-600 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-red-700">
                  We'll Call You
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base transition-colors duration-300">
                  Request a call during business hours.
                </p>
                <Link to="/contact-us" className="w-full">
                  <button className="w-full py-2 sm:py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95">
                    Fill Out Contact Form
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speed Guidance */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-slideUp">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
              How much speed do you need?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base transition-colors duration-300">
              Choose the right speed for your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md animate-slideUp">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 transition-colors duration-300">
                    25+ Mbps
                  </h3>
                  <span className="text-xs sm:text-sm bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 rounded-full transition-all duration-300">
                    Basic
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-yellow-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "Web surfing & email",
                  "HD streaming",
                  "Supports 1–2 devices",
                  "Ideal for 1–2 people",
                ].map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <TiTick className="text-green-600 text-sm sm:text-base transition-transform duration-300 hover:scale-110" />
                    <span className="text-xs sm:text-sm transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 transition-colors duration-300">
                    100+ Mbps
                  </h3>
                  <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full transition-all duration-300">
                    Recommended
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-green-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "Ultra HD (4K) streaming",
                  "Low-lag online gaming",
                  "Supports 3–5 devices",
                  "Ideal for 2–6 people",
                ].map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <TiTick className="text-green-600 text-sm sm:text-base transition-transform duration-300 hover:scale-110" />
                    <span className="text-xs sm:text-sm transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 transition-colors duration-300">
                    1 Gig
                  </h3>
                  <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full transition-all duration-300">
                    Premium
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "Multi 4K streaming",
                  "No-lag gaming",
                  "5+ devices",
                  "Ideal for 6+ people",
                ].map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <TiTick className="text-green-600 text-sm sm:text-base transition-transform duration-300 hover:scale-110" />
                    <span className="text-xs sm:text-sm transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-slideUp">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
              Smart Tools to Choose the Right Plan
            </h2>
            <p className="text-gray-600 text-sm sm:text-base transition-colors duration-300">
              Make an informed decision with our helpful tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300 group-hover:bg-gray-200 group-hover:scale-110">
                  <img
                    src={BandWidth}
                    alt="Bandwidth icon"
                    className="w-8 h-8 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-red-700">
                  Bandwidth Calculator
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base transition-colors duration-300">
                  Not sure how much speed you need? Estimate your ideal
                  bandwidth based on your devices.
                </p>
                <button
                  onClick={() => setShowCalculator(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-all duration-300 w-full text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95"
                >
                  Calculate Now
                </button>
              </div>
            </div>

            <div
              className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300 group-hover:bg-gray-200 group-hover:scale-110">
                  <img
                    src={SpeedoMeter}
                    alt="Speedometer icon"
                    className="w-8 h-8 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-red-700">
                  Speed Test
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base transition-colors duration-300">
                  Check your current Internet speed with an easy in-page test.
                </p>
                <button
                  onClick={() => setShowSpeedTest(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-all duration-300 w-full text-sm sm:text-base shadow-sm hover:shadow-md active:scale-95"
                >
                  Run Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-slideUp">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-sm sm:text-base transition-colors duration-300">
              Real feedback from businesses we've helped
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <img
                    src={t?.image}
                    alt={`${t?.name} profile`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 transition-all duration-300 group-hover:scale-110"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base transition-colors duration-300 group-hover:text-red-700">
                      {t?.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 transition-colors duration-300">
                      {t?.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 sm:mb-4 italic text-sm sm:text-base transition-colors duration-300">
                  "{t?.comment}"
                </p>
                <div className="flex items-center">
                  {[...Array(t?.rating || 0)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="text-yellow-500 text-sm sm:text-base transition-transform duration-300 hover:scale-110"
                    />
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-gray-600 transition-colors duration-300">
                    {t?.rating}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-slideUp">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors duration-300">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-sm sm:text-base transition-colors duration-300">
                Find answers to common questions
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md animate-slideUp"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <details className="group">
                    <summary className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between cursor-pointer list-none hover:bg-gray-50 transition-all duration-300">
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 pr-4 transition-colors duration-300 group-hover:text-red-700">
                        {faq?.question}
                      </span>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-all duration-300 group-hover:text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="px-4 sm:px-6 pb-3 sm:pb-4 pt-1 sm:pt-2 border-t border-gray-100 animate-fadeIn">
                      <p className="text-gray-700 text-sm sm:text-base transition-colors duration-300">
                        {faq?.answer}
                      </p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
