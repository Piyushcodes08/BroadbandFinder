import axios from "axios";
import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { useLocation } from "react-router-dom";
import PlanBookingForm from "../Components/PlanBookingForm";
import spectrumLogo from "../assets/spectrum.png";
import attLogo from "../assets/att.png";
import comcastLogo from "../assets/comcast.png";
import PlaceHolder from "../assets/placeholder.png";
import RingCentralLogo from "../assets/RingCentral.png";
import SpectrumVoipLogo from "../assets/spectrum.png";

export default function ProvidersResult() {
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [zip, setZip] = useState("");
  const [viewingPlansId, setViewingPlansId] = useState(null);
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


  const typeNameToKey = {
    "Spectrum Business": "SpectrumBusiness",
    "AT&T Business": "AT&TBusiness",
    "Comcast Business": "ComcastBusiness",
    RingCentral: "RingCentral",
    "Spectrum VoIP": "SpectrumVoIP",
  };

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
        `https://zenith.cloudastro.space/api/search/providers?zipcode=${zipcode}`
      );
      const apiProviders = res.data.providers || [];

      // Combine API providers and VoIP providers
      // Optionally avoid duplicates by name
      const combinedProviders = [
        ...apiProviders,
        ...voipProviders.filter(
          (vp) => !apiProviders.some((ap) => ap.name === vp.name)
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
  console.log("Results:", results);
  console.log("Providers:", providers);
  console.log(detailsProvider)
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-[#C44E12] to-gray-900 py-20 px-4 text-white text-center shadow-xl" data-aos="fade-down">
        <div className="max-w-3xl mx-auto pt-16 md:pt-4">
          <h2 className="text-sm uppercase tracking-wider text-[#FBBD96] mb-2 animate-pulse font-semibold">
            The Place for Everything Internet
          </h2>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Find Every Internet Provider In Your Area
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-[#FBBD96] max-w-xl mx-auto">
            Check availability by address or ZIP to compare your best internet
            options.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Enter your ZIP code or address"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full rounded-lg px-5 py-3 text-gray-900 font-medium shadow-md border-none focus:outline-none focus:ring-4 focus:ring-[#F47630] transition"
            />
            <button
              onClick={() => fetchProviders(zip)}
              className="w-full sm:w-auto bg-[#F47630] hover:bg-[#E8611A] text-white px-7 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto my-10 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2" data-aos="fade-up">
          Internet Providers in {zip || "your area"}{" "}
          <img src={PlaceHolder} alt="Location icon" className="w-6 h-6" />
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading providers...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-600">
            No providers available in this ZIP code.
          </p>
        ) : (
          <div className="flex flex-col gap-6" data-aos="fade-up" data-aos-offset="0">
            {results.map((p) => {
              const matchedProvider = providers.find(
                (prov) =>
                  prov.name.toLowerCase() ===
                  (p.typeName || p.name || "").toLowerCase()
              );

              return (
                <div
                  key={p._id || p.id}
                  className={`bg-white rounded-xl shadow-md p-5 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-6 transition hover:shadow-lg ${
                    selectedId === p.id ? "ring-2 ring-[#F47630]" : ""
                  }`}
                  data-aos="fade-up"
                  data-aos-offset="0"
                >
                  {/* Logo + Name */}
                  <div className="flex flex-col items-center sm:items-start border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 sm:pr-6">
                    <img
                      src={providerImages[p.typeName] || p.img || PlaceHolder}
                      alt={p.typeName || p.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-3"
                    />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                      {p.name || p.typeName}
                    </h2>
                  </div>

                  {/* Pricing + Speed */}
                  <div className="flex flex-col sm:flex-col justify-between items-center sm:items-start gap-6 sm:gap-10 border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 sm:pr-6 text-center sm:text-left">
                    <div className="grid grid-cols-2 w-full items-center  sm:items-start">
                      <div>
                        <p className="font-semibold text-gray-700 text-sm sm:text-base">
                          Plans Starting At
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#E8611A] mt-1">
                          {p.startingPrice ||
                            matchedProvider?.startingPrice ||
                            "$29.99"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {p.conditions ||
                            matchedProvider?.conditions ||
                            "Conditions apply"}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700 text-sm sm:text-base">
                          Speeds Up To
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
                          {p.speed || matchedProvider?.speed || "100 Mbps"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          *May vary
                        </p>
                      </div>
                    </div>
                    <div
                      className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 text-sm sm:text-base mt-3 sm:mt-0"
                      onClick={() => {
                        setDetailsProvider(p.name || p.typeName);
                        setIsDetailsOpen(true);
                      }}
                    >
                      See more details...
                    </div>
                  </div>

                  {/* Book Appointment button */}
                  <div className="flex justify-center sm:justify-end">
                    <button
                      onClick={() => handleBook(p, null, matchedProvider)}
                      className="bg-[#E8611A] px-6 py-3 rounded-md text-white hover:bg-[#C44E12] transition w-full sm:w-auto"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Provider Details */}

      {isDetailsOpen &&
        detailsProvider &&
        (() => {
          const selectedDetails = providerDetailsData.find(
            (pd) => pd.name === detailsProvider
          );
          if (!selectedDetails) return null;

          return (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white rounded-xl p-6 max-w-6xl w-full shadow-2xl overflow-y-auto max-h-[90vh] animate-fadeIn">
                {/* Close button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsDetailsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
                    aria-label="Close details popup"
                  >
                    ×
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  {selectedDetails.name}
                </h2>

                {/* Plans Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                  {selectedDetails.plans.map((plan, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
                    >
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">
                          {plan.title}
                        </h3>
                        <p className="text-4xl font-bold text-[#E8611A] mb-4">
                          {plan.price}
                        </p>

                        {plan.details && (
                          <ul className="mb-4 list-disc list-inside text-gray-700 text-sm space-y-1">
                            {plan.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        )}

                        <ul className="space-y-1 text-gray-700 text-sm mt-3">
                          {selectedDetails.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <TiTick /> {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={`tel:${selectedDetails.phone}`}
                        className="mt-6 block bg-[#E8611A] hover:bg-[#C44E12] text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                      >
                        📞{selectedDetails.phone} Toll Free
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
    </div>
  );
}
