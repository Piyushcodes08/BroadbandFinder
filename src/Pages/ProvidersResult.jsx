import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaStar } from "react-icons/fa";
import { providerData } from "../data/providerdata";
import { useLocation } from "react-router-dom";
import ProviderPlanCard from "../Components/ProviderPlanCard";
import PlanBookingForm from "../Components/PlanBookingForm";
import PlaceHolder from '../assets/placeholder.png'; 

export default function ProvidersResult() {
  const [results, setResults] = useState([]);
  const [showBusiness, setShowBusiness] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const location = useLocation();
  const [zip, setZip] = useState(location.state?.zip || "");
  const [viewingPlansId, setViewingPlansId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleBook = (provider, plan) => {
    setSelectedProvider(provider);
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  console.log(zip);
  useEffect(() => {
    const filtered = providerData.filter((provider) =>
      provider.zipCodes.includes(zip)
    );
    setResults(filtered);
  }, [zip, showBusiness]);

  console.log(providerData);
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-red-700 to-gray-900 py-28 text-white text-center px-4 shadow-xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-base uppercase tracking-wider text-red-100 mb-2 animate-pulse">
            The Place for Everything Internet
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Find Every Internet Provider In Your Area
          </h1>
          <p className="mt-6 text-xl text-red-100">
            Check availability by address or ZIP to compare your best internet
            options.
          </p>
          <div className="mt-8 flex justify-center flex-wrap gap-2">
            <input
              type="text"
              placeholder="Enter your ZIP code or address"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-72 md:w-96 px-5 py-3 rounded-l-lg text-black border-none shadow-md focus:outline-none"
            />
            <button
              onClick={() => {
                if (!zip || zip.length !== 5) {
                  alert("Please enter a valid 5-digit ZIP code.");
                  return;
                }
                setResults(
                  providerData.filter((provider) =>
                    provider.zipCodes.includes(zip)
                  )
                );
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-7 py-3 rounded-r-lg font-semibold shadow-md transition duration-300"
            >
              Search
            </button>
          </div>
        </div>
      </section>
      <div className="max-w-5xl mx-auto mb-8 pt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex gap-2 items-center">
          Internet Providers in {zip} <img src={PlaceHolder} className="w-8"/>
        </h1>
      </div>

      <div className="grid gap-6 max-w-5xl mx-auto pb-16">
        {results.length === 0 ? (
          <p className="text-center text-gray-600">
            No providers available in this ZIP code.
          </p>
        ) : (
          results.map((p) => (
            <div
              key={p.id}
              className={`relative border rounded-xl p-5 shadow-md transition hover:shadow-lg ${
                selectedId === p.id ? "ring-2 ring-red-500 border-red-500" : ""
              }`}
            >
              {/* Optional Blue Ribbon */}
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-md font-semibold">
                  #1 Recommended Plan
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                {/* Provider Info */}
                <div className="w-full md:w-1/4 border-r flex flex-col items-center justify-center ">
                  <img src={p.img} alt={p.img} className="w-32" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {p.name}
                  </h2>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    {[...Array(Math.floor(p.rating))].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 mr-1" />
                    ))}
                    <span className="ml-2 font-medium">
                      {p.rating.toFixed(1)}
                    </span>
                    <span className="ml-1">
                      ({p.reviews.toLocaleString()} ratings)
                    </span>
                  </div>
                </div>

                {/* Plan Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm flex-1">
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">
                      Plans Starting At
                    </p>
                    <p className="text-3xl font-bold text-red-600 mb-2">
                      ${p.price}
                    </p>
                    <p className="text-xs text-gray-500">{p.priceTerms}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">
                      Speeds Up To
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mb-2">
                      {p.speed}
                    </p>
                    <p className="text-xs text-gray-500">*May vary</p>
                  </div>
                  <div>
                    <p className=" text-gray-500 mb-2">
                      Connection :{" "}
                      <span className="font-semibold text-gray-700">
                        {p.connection}
                      </span>
                    </p>

                    <p className=" text-gray-500">
                      Availability :{" "}
                      <span className="font-semibold text-gray-700">
                        {p.availability}%
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col  items-center justify-center gap-2 w-full md:w-auto mt-4 md:mt-0 border-l h-48 pl-4 ">
                  <button
                    onClick={() =>
                      setViewingPlansId(p.id === viewingPlansId ? null : p.id)
                    }
                    className="w-40 py-2 rounded-full text-sm bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    {p.id === viewingPlansId ? "Hide Plans" : "View Plans"}
                  </button>
                  <a
                    href={`tel:${p.phone.replace(/[^0-9]/g, "")}`}
                    className="w-40 py-2  rounded-full text-sm border border-red-600 text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                  >
                    <FaPhoneAlt className="mr-2" />
                    {p.phone}
                  </a>
                </div>
              </div>

              {/* Toggleable Plans */}
              {p.id === viewingPlansId && p.plans?.length > 0 && (
                <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-gray-50 border border-gray-200 rounded-xl p-6">
                  {p.plans.map((plan, idx) => (
                    <ProviderPlanCard
                      key={idx}
                      plan={plan}
                      onBook={() => handleBook(p, plan)}
                    />
                  ))}
                </div>
              )}
              <PlanBookingForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                provider={selectedProvider}
                plan={selectedPlan}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
