import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BandWidth from "../assets/bandwidth.png";
import SpeedoMeter from "../assets/speedometer.png";
import { testimonials } from "../data/testimonial";
import { FaStar } from "react-icons/fa";

function BandwidthCalculatorModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [devices, setDevices] = useState(3);
  const [videoCalls, setVideoCalls] = useState("sometimes");
  const [gaming, setGaming] = useState("no");
  const [priority, setPriority] = useState("speed");

  const estimateSpeed = () => {
    let speed = devices * 5;
    if (videoCalls === "often") speed += 20;
    else if (videoCalls === "sometimes") speed += 10;
    if (gaming === "yes") speed += 25;
    return speed;
  };

  const speed = estimateSpeed();
  const suggestion =
    priority === "speed"
      ? `We recommend at least ${speed} Mbps for best experience.`
      : `To save on cost, look for plans around ${speed - 10} Mbps.`;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              How many devices are used at home?
            </h2>
            <input
              type="number"
              min="1"
              value={devices}
              onChange={(e) =>
                setDevices(Math.max(1, parseInt(e.target.value)))
              }
              className="w-full p-2 border rounded mb-4"
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              How often do you video conference?
            </h2>
            <select
              className="w-full p-2 border rounded mb-4"
              value={videoCalls}
              onChange={(e) => setVideoCalls(e.target.value)}
            >
              <option value="rarely">Rarely</option>
              <option value="sometimes">Sometimes</option>
              <option value="often">Often</option>
            </select>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Does your household game online?
            </h2>
            <select
              className="w-full p-2 border rounded mb-4"
              value={gaming}
              onChange={(e) => setGaming(e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              What matters most to you?
            </h2>
            <select
              className="w-full p-2 border rounded mb-4"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="speed">Speed</option>
              <option value="price">Price</option>
            </select>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Recommended Speed: {speed} Mbps
            </h2>
            <p className="text-gray-700 text-sm mb-4">{suggestion}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-left">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Bandwidth Calculator
        </h1>

        {/* Step Indicator */}
        <div className="text-sm text-gray-600 mb-2">Step {step} of 5</div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded mb-6">
          <div
            className="bg-red-600 h-2 rounded transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep((prev) => prev + 1)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SpeedTestEmbed({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-xl w-full max-w-4xl relative">
        <button
          className="absolute top-2 right-4 text-red-600 text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <iframe
          src="https://fast.com"
          width="100%"
          height="500"
          className="rounded border"
          title="Fast.com Speed Test"
        ></iframe>
      </div>
    </div>
  );
}

export default function App() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const [zip, setZip] = useState("");
  const navigate = useNavigate();

  const providers = [
    { name: "AT&T Internet", logo: "https://logo.clearbit.com/att.com" },
    { name: "Spectrum", logo: "https://logo.clearbit.com/spectrum.com" },
    { name: "T-Mobile", logo: "https://logo.clearbit.com/t-mobile.com" },
    { name: "Optimum", logo: "https://logo.clearbit.com/optimum.com" },
    { name: "Brightspeed", logo: "https://logo.clearbit.com/brightspeed.com" },
    { name: "Xfinity", logo: "https://logo.clearbit.com/xfinity.com" },
    { name: "Verizon", logo: "https://logo.clearbit.com/verizon.com" },
    { name: "CenturyLink", logo: "https://logo.clearbit.com/centurylink.com" },
    { name: "Cox", logo: "https://logo.clearbit.com/cox.com" },
    { name: "Viasat", logo: "https://logo.clearbit.com/viasat.com" },
  ];
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
        "Yes, most providers allow upgrades or downgrades with little to no penalty. However, contract plans may have restrictions.",
    },
  ];

  return (
    <div className="font-sans text-gray-900">
      {showCalculator && (
        <BandwidthCalculatorModal onClose={() => setShowCalculator(false)} />
      )}
      {showSpeedTest && (
        <SpeedTestEmbed onClose={() => setShowSpeedTest(false)} />
      )}

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
              placeholder="Enter your ZIP"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-72 md:w-96 px-5 py-3 rounded-l-lg text-black border-none shadow-md focus:outline-none"
            />
            <button
              onClick={() => {
                setZip(zip); // optional if already set elsewhere
                navigate(`/providers/${zip}`, { state: { zip } });
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-7 py-3 rounded-r-lg font-semibold shadow-md transition duration-300"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center px-6 md:px-32">
        <div className="border border-gray-300  rounded-lg p-10 md:p-16 mb-8">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">
            Top Internet Providers
          </h2>
          <div className="space-y-10">
            <div className="flex justify-center flex-wrap gap-6">
              {providers.slice(0, 5).map((p, i) => (
                <div
                  key={i}
                  className="w-[150px] flex flex-col items-center bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <img src={p.logo} alt={p.name} className="h-16 mb-2" />
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6">
              {providers.slice(5, 8).map((p, i) => (
                <div
                  key={i}
                  className="w-[150px] flex flex-col items-center bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <img src={p.logo} alt={p.name} className="h-12 mb-2" />
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
            {providers[8] && (
              <div className="flex justify-center">
                <div className="w-[150px] flex flex-col items-center bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  <img
                    src={providers[8].logo}
                    alt={providers[8].name}
                    className="h-12 mb-2"
                  />
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {providers[8].name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-white via-gray-100 to-white py-24 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-12 text-gray-800 leading-tight">
            Smart Tools to Choose the Right Internet Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
              <div className="flex items-center justify-center w-20 h-20 p-2  bg-gray-200 text-red-600 rounded-full mx-auto mb-6 text-3xl">
                <img src={BandWidth} alt="" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Bandwidth Calculator
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Not sure how much speed you need? Estimate your ideal bandwidth
                based on your devices.
              </p>
              <button
                onClick={() => setShowCalculator(true)}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Calculate Now
              </button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
              <div className="flex items-center justify-center w-20 h-20 p-2 bg-gray-200 text-gray-800 rounded-full mx-auto mb-6 text-3xl">
                <img src={SpeedoMeter} alt="" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Speed Test
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Check your current internet speed and get accurate real-time
                performance results.
              </p>
              <button
                onClick={() => setShowSpeedTest(true)}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Run Test
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            What Our Customers Say
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-6 text-left flex flex-col items-start"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">"{t.comment}"</p>

                <div className="flex items-center">
                  {[...Array(t.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500 text-sm" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto my-16 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Frequently Asked Questions
        </h2>
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group border-b border-gray-200 py-4 transition-all duration-300 ease-in-out"
          >
            <summary className="cursor-pointer flex justify-between items-center font-medium text-lg text-gray-800 group-open:text-red-600 transition-colors">
              {faq.question}
              <span className="ml-2 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </section>
    </div>
  );
}
