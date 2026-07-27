import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlanBookingForm from "../Components/PlanBookingForm";
import { PROVIDER_DETAILS } from "../data/PROVIDER_DETAILS";
import spectrumLogo from "../assets/spectrum.png";
import attLogo from "../assets/att.png";
import comcastLogo from "../assets/comcast.png";
import PlaceHolder from "../assets/placeholder.png";
import RingCentralLogo from "../assets/RingCentral.png";
import SpectrumVoipLogo from "../assets/spectrum.png";
import Home1 from "../assets/24x7 bg.png";
import {
  FaArrowRight,
  FaCheck,
  FaChevronRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaShieldAlt,
  FaTimes,
  FaWifi,
} from "react-icons/fa";

export default function ProvidersResult() {
  const [results, setResults] = useState([]);
  const [zip, setZip] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsProvider, setDetailsProvider] = useState(null);
  const [selectedMatchedProvider, setSelectedMatchedProvider] = useState(null);

  const providerImages = {
    "Spectrum Business": spectrumLogo,
    "AT&T Business": attLogo,
    "Comcast Business": comcastLogo,
  };
  const providers = [
    {
      name: "AT&T Business",
      startingPrice: "$70/mo",
      speed: "300 Mbps",
      conditions: "taxes + installation charges",
    },
    {
      name: "Spectrum Business",
      startingPrice: "$50/mo",
      speed: "500 Mbps",
      conditions: "taxes charges",
    },
    {
      name: "Comcast Business",
      startingPrice: "$30/mo",
      speed: "200 Mbps",
      conditions: "taxes + installation charges",
    },
  ];
  const voipProviders = [
    {
      name: "RingCentral",
      startingPrice: "$20.00/landline",
      speed: "N/A",
      conditions: "No contract, includes unlimited calling",
      typeName: "RingCentral",
      img: RingCentralLogo, // Replace with actual logo URL or local import
    },
    {
      name: "Spectrum VoIP",
      startingPrice: "$20.00/line",
      speed: "N/A",
      conditions: "Requires Spectrum Internet",
      typeName: "Spectrum VoIP",
      img: SpectrumVoipLogo, // Replace with actual logo URL or local import
    },
  ];

  const location = useLocation();

  const handleBook = (provider, plan, matchedProvider) => {
    setSelectedProvider(provider);
    setSelectedPlan(plan);
    setSelectedMatchedProvider(matchedProvider);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (location.state?.zip) {
      setZip(location.state.zip);
      fetchProviders(location.state.zip);
    }
  }, [location.state]);

  const fetchProviders = async (zipcode) => {
    if (isNaN(zipcode) || zipcode.length !== 5) {
      alert("Please enter a valid 5 digit numeric ZIP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/search/providers?zipcode=${zipcode}`,
      );
      const apiProviders = res.data.providers || [];

      // Combine API providers and VoIP providers
      // Optionally avoid duplicates by name
      const combinedProviders = [
        ...apiProviders,
        ...voipProviders.filter(
          (vp) => !apiProviders.some((ap) => ap.name === vp.name),
        ),
      ];

      setResults(combinedProviders);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setResults(voipProviders); // fallback to just voip providers if API fails
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf8f5] text-neutral-900">
      <section className="relative isolate min-h-[92svh] overflow-hidden bg-[#f5f2eb]">
        {/* Background image */}
        <img
          src={Home1}
          alt="Business internet search solutions"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-center"
        />

        {/* Responsive image overlays */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#F8F6F1] via-[#F8F6F1]/95 to-[#F8F6F1]/55
            sm:via-[#F8F6F1]/90 sm:to-transparent
            lg:from-[#F8F6F1] lg:via-[#F8F6F1]/85 lg:to-transparent
          "
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#faf8f5] to-transparent"
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-[1440px] items-center px-5 sm:px-10 lg:px-16 xl:px-20">
          <div
            className="w-full max-w-[720px] py-28"
            data-aos="fade-right"
            data-aos-duration="900"
          >
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#E8611A]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#A83E0C] sm:text-xs">
                Broadband Finder®
              </p>
            </div>

            {/* Main heading */}
            <h1 className="max-w-[680px] text-[clamp(2.8rem,6vw,5.25rem)] font-bold leading-[0.95] tracking-[-0.055em] text-[#171717]">
              Find the right provider
              <span className="mt-2 block tracking-[-0.04em] text-[#C44E12]">
                for your business.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[620px] text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8 lg:text-xl">
              Compare business internet and voice options available at your
              location—all in one simple search.
            </p>

            {/* Search Input & CTA */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchProviders(zip);
              }}
              className="mt-9 max-w-2xl rounded-[1.5rem] border border-white/80 bg-white/85 p-2.5 shadow-[0_24px_70px_rgba(45,32,24,0.14)] backdrop-blur-xl sm:flex"
            >
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2">
                <FaMapMarkerAlt
                  className="shrink-0 text-[#C44E12]"
                  aria-hidden="true"
                />
                <span className="sr-only">ZIP code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  autoComplete="postal-code"
                  placeholder="Enter 5-digit ZIP code"
                  value={zip}
                  onChange={(e) =>
                    setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                  className="min-h-12 w-full bg-transparent text-base font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#C44E12] px-7 text-sm font-bold text-white shadow-[0_12px_28px_rgba(196,78,18,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <FaSearch className="h-3.5 w-3.5" aria-hidden="true" />
                {loading ? "Searching..." : "Check Availability"}
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-neutral-600">
              {["Free search", "Business-focused plans", "No obligation"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <FaCheck className="text-emerald-600" aria-hidden="true" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 lg:flex">
          <span>Explore</span>
          <span className="h-px w-12 bg-neutral-500" />
        </div>
      </section>

      <section
        className="relative py-16 sm:py-20 lg:py-24"
        aria-labelledby="results-heading"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(232,97,26,0.08),transparent_32%)]"
        />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div
            className="flex flex-col gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between"
            data-aos="fade-up"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#E8611A]" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83E0C]">
                  Available services
                </span>
              </div>
              <h2
                id="results-heading"
                className="mt-4 text-3xl font-bold tracking-[-0.04em] text-neutral-900 sm:text-4xl"
              >
                Providers near{" "}
                <span className="text-[#C44E12]">{zip || "your business"}</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                Review available providers, starting prices and maximum
                advertised speeds.
              </p>
            </div>
            {results.length > 0 && !loading && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-xs font-bold text-neutral-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {results.length}{" "}
                {results.length === 1 ? "provider" : "providers"} found
              </span>
            )}
          </div>

          {loading ? (
            <div
              className="grid gap-5 pt-9"
              aria-live="polite"
              aria-busy="true"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-[1.75rem] border border-neutral-200 bg-white shadow-sm"
                >
                  <div className="h-full bg-gradient-to-r from-transparent via-neutral-100/80 to-transparent" />
                </div>
              ))}
              <p className="sr-only">Finding providers in your area...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="mt-9 rounded-[1.75rem] border border-dashed border-orange-200 bg-white px-6 py-14 text-center shadow-[0_16px_45px_rgba(45,32,24,0.05)]">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E6] text-[#C44E12]">
                <FaWifi className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-neutral-900">
                Start your provider search
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
                Enter a valid 5-digit ZIP code above to explore business
                internet and voice options.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 pt-9">
              {results.map((p, index) => {
                const matchedProvider = providers.find(
                  (prov) =>
                    prov.name.toLowerCase() ===
                    (p.typeName || p.name || "").toLowerCase(),
                );

                return (
                  <div
                    key={p._id || p.id || `${p.typeName || p.name}-${index}`}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_18px_55px_rgba(45,32,24,0.07)] transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_26px_70px_rgba(196,78,18,0.12)]"
                    data-aos="fade-up"
                    data-aos-delay={Math.min(index * 80, 240)}
                    data-aos-once="true"
                  >
                    <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#E8611A] to-[#A83E0C]" />
                    <div className="grid items-stretch lg:grid-cols-[260px_1fr_220px]">
                      <div className="flex flex-col items-center justify-center border-b border-neutral-100 bg-[#FCFBF9] p-7 text-center lg:border-b-0 lg:border-r">
                        <img
                          src={
                            providerImages[p.typeName] || p.img || PlaceHolder
                          }
                          alt={p.typeName || p.name}
                          className="h-24 w-40 object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <h3 className="mt-5 text-lg font-bold text-neutral-900">
                          {p.name || p.typeName}
                        </h3>
                        <span className="mt-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                          <FaShieldAlt /> Business solution
                        </span>
                      </div>

                      <div className="p-6 sm:p-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                              Plans Starting At
                            </p>
                            <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#C44E12]">
                              {p.startingPrice ||
                                matchedProvider?.startingPrice ||
                                "$29.99"}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-neutral-500">
                              {p.conditions ||
                                matchedProvider?.conditions ||
                                "Conditions apply"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                              Speeds Up To
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-neutral-900">
                              {p.speed || matchedProvider?.speed || "100 Mbps"}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              Availability and speeds may vary
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#A83E0C] transition hover:text-[#E8611A]"
                          onClick={() => {
                            setDetailsProvider(p.name || p.typeName);
                            setIsDetailsOpen(true);
                          }}
                        >
                          View plans and details
                          <FaChevronRight className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex flex-col justify-center border-t border-neutral-100 bg-[#FCFBF9] p-6 lg:border-l lg:border-t-0">
                        <button
                          onClick={() => handleBook(p, null, matchedProvider)}
                          className="group/button inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#C44E12] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(196,78,18,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A83E0C]"
                        >
                          Book Appointment
                          <FaArrowRight className="transition-transform group-hover/button:translate-x-1" />
                        </button>
                        <p className="mt-3 text-center text-[11px] leading-5 text-neutral-500">
                          Free consultation. No obligation.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Provider Details */}

      {isDetailsOpen &&
        detailsProvider &&
        (() => {
          const selectedDetails = PROVIDER_DETAILS.find(
            (pd) => pd.name === detailsProvider,
          );
          if (!selectedDetails) return null;

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="provider-details-title"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget)
                  setIsDetailsOpen(false);
              }}
            >
              <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-white/20 bg-[#FAF8F5] shadow-[0_35px_100px_rgba(0,0,0,0.35)]">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-5 py-4 backdrop-blur-xl sm:px-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A83E0C]">
                      Plans & pricing
                    </p>
                    <h2
                      id="provider-details-title"
                      className="mt-1 text-xl font-bold text-neutral-900 sm:text-2xl"
                    >
                      {selectedDetails.name}
                    </h2>
                  </div>
                  {/* Close button */}
                  <button
                    onClick={() => setIsDetailsOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-orange-200 hover:bg-[#FFF0E6] hover:text-[#C44E12]"
                    aria-label="Close details popup"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Plans Grid */}
                <div className="grid gap-5 p-5 sm:p-8 md:grid-cols-2 lg:grid-cols-3">
                  {selectedDetails.plans.map((plan, index) => (
                    <div
                      key={plan.title || index}
                      className="group/plan flex flex-col justify-between rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-[0_14px_38px_rgba(45,32,24,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(196,78,18,0.10)]"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                          Business plan
                        </span>
                        <h3 className="mt-2 text-xl font-bold text-neutral-900">
                          {plan.title}
                        </h3>
                        <p className="mt-4 text-4xl font-bold tracking-[-0.05em] text-[#C44E12]">
                          {plan.price}
                        </p>

                        {plan.details && (
                          <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-5">
                            {plan.details.map((detail, i) => (
                              <li
                                key={`${detail}-${i}`}
                                className="flex gap-2.5 text-sm leading-6 text-neutral-600"
                              >
                                <FaCheck className="mt-1 shrink-0 text-emerald-600" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}

                        <ul className="mt-4 space-y-2">
                          {selectedDetails.features.map((feature, i) => (
                            <li
                              key={`${feature}-${i}`}
                              className="flex gap-2.5 text-sm leading-6 text-neutral-600"
                            >
                              <FaCheck className="mt-1 shrink-0 text-emerald-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={`tel:${selectedDetails.phone}`}
                        className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#C44E12] px-4 text-center text-sm font-bold text-white transition hover:bg-[#A83E0C]"
                      >
                        <FaPhoneAlt className="h-3.5 w-3.5" />
                        {selectedDetails.phone} Toll Free
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

      <PlanBookingForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={selectedProvider}
        zip={zip}
        plan={selectedPlan}
        matchedProvider={selectedMatchedProvider}
      />
    </main>
  );
}