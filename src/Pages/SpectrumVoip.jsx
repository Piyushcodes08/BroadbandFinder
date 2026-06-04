// src/pages/SpectrumVoIP.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaMoneyBillWave,
  FaListUl,
  FaHeadset,
  FaTools,
  FaCloud,
  FaShieldAlt,
  FaLaptop,
  FaPuzzlePiece,
  FaCheck,
  FaPhoneAlt,
  FaSearch,
} from "react-icons/fa";
import Telephone from "../assets/Telephone.png";
import Mobile from "../assets/Mobile.jpg";
import Telephone2 from "../assets/Telephone2.jpg";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SpectrumVoIP() {
  // contract vs month-to-month
  const [term, setTerm] = useState("contract"); // 'contract' | 'mtm'
  const [bundle, setBundle] = useState(true);

  const price = term === "contract" ? 19.95 : 24.95;

  // ZIP lookup (mock)
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
      setResults(null);
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResults({ available: true, zipcode: zip });
    }, 500);
  };

  const handleBook = () => {
    navigate("/customerbookingfrom", {
      state: { name: "spectrum voip" },
    });
  };

  const features = [
    {
      icon: <FaMoneyBillWave className="h-8 w-8 text-sky-700" />,
      title: "No upfront costs, no surprises",
      desc: "Straightforward billing and transparent pricing. Keep budgets predictable.",
    },
    {
      icon: <FaListUl className="h-8 w-8 text-sky-700" />,
      title: "Hundreds of features included",
      desc: "Auto attendant, call queues, analytics, voicemail to email, music on hold, and more.",
    },
    {
      icon: <FaHeadset className="h-8 w-8 text-sky-700" />,
      title: "Unlimited training & support",
      desc: "White-glove onboarding and ongoing help from a dedicated support team.",
    },
    {
      icon: <FaTools className="h-8 w-8 text-sky-700" />,
      title: "Pro installation & project mgmt",
      desc: "We plan the rollout, port your numbers, and keep you online during cutover.",
    },
  ];

  const capabilityTiles = [
    { icon: <FaCloud className="h-6 w-6 text-slate-600" />, title: "Seamlessly perform communication tasks" },
    { icon: <FaShieldAlt className="h-6 w-6 text-slate-600" />, title: "Operate with ease" },
    { icon: <FaLaptop className="h-6 w-6 text-slate-600" />, title: "Incorporate anywhere & everywhere" },
    { icon: <FaPuzzlePiece className="h-6 w-6 text-slate-600" />, title: "Effortlessly integrate with your business" },
  ];

  const deviceCards = [
    { img: Mobile, label: "Mobile device", sub: "" },
    { img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop", label: "Computer", sub: "" },
    { img: Telephone2, label: "Desk phone", sub: "" },
  ];

  const faqs = [
    {
      q: "How much does SpectrumVoIP cost?",
      a: "Plans start as low as $19.95 per user with contract or month-to-month at $24.95. Final price varies by features, volume, and term.",
    },
    { q: "Can I keep my existing business numbers?", a: "Yes. We’ll port your numbers with zero downtime and coordinate the entire cutover." },
    { q: "Do you support remote and hybrid teams?", a: "Absolutely. Users can take calls from desk phones, mobile apps, or desktop softphones anywhere." },
  ];

  return (
    <main className="bg-white text-slate-900">
      <Helmet>
        <title>SpectrumVoIP — Business Hosted VoIP (from $19.95/user)</title>
        <meta
          name="description"
          content="Take your business phone system to new heights with SpectrumVoIP. Transparent pricing, unlimited support, and hundreds of features included."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6">
            <p className="text-xs sm:text-sm tracking-[0.16em] text-slate-600 font-semibold">SPECTRUMVOIP</p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight">
              Take your business phone system to new heights
            </h1>
            <p className="mt-4 text-slate-700 max-w-xl text-base sm:text-xl">
              Communicate with distinction — why settle for less when SpectrumVoIP offers the best?
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <a
                href="tel:18557442407"
                aria-label="Call 1-855 744 2407"
                className="rounded-full border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50 inline-flex items-center gap-2"
              >
                <FaPhoneAlt /> 1-855 744 2407
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border shadow-sm">
              <img
                src={Telephone}
                alt="Business desk phone"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ZIP LOOKUP */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl flex flex-col items-center px-4">
          <div className="pt-8 sm:pt-10">
            <p className="mt-1 sm:mt-3 text-gray-700 font-semibold text-2xl sm:text-3xl">
              Check availability by ZIP code
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 mb-4 w-full sm:w-3/4 md:w-1/2 max-w-xl rounded-lg border border-gray-200 bg-white shadow-sm focus-within:ring-1 focus-within:ring-slate-600"
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
                pattern="^\d{5}$"
                autoComplete="postal-code"
                maxLength={5}
                value={zipcode}
                onChange={onZipChange}
                placeholder="Enter ZIP code"
                className="w-full py-3 pr-3 pl-3 text-lg bg-white outline-none text-gray-900 placeholder:text-gray-400"
                aria-invalid={!!error}
                aria-describedby={error ? "zip-error" : undefined}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-5 bg-sky-700 text-white font-semibold hover:bg-sky-800 disabled:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                aria-label="Search by ZIP code"
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <FaSearch className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>

          {error && (
            <p id="zip-error" className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div role="status" aria-live="polite" className="mb-12">
            {results && (
              <div className="flex items-center text-green-600 justify-center flex-col py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-xl sm:text-2xl">
                  SpectrumVoIP is available in {results.zipcode}
                </span>
                <span className="mt-6">
                  <button
                    onClick={handleBook}
                    className="px-6 py-3 border border-slate-600 text-slate-600 hover:text-white font-semibold rounded-full hover:bg-slate-700 transition duration-300"
                  >
                    Book Now
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-14 sm:py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center">Simple, transparent pricing</h2>

          {/* Toggles */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
           

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-sky-700 h-4 w-4"
                checked={bundle}
                onChange={() => setBundle((x) => !x)}
              />
              Bundle &amp; save
            </label>
          </div>

          {/* Cards */}
          <div className="mt-8 grid md:grid-cols-[1.1fr_1fr] gap-8">
            <article className="rounded-2xl border bg-white shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block w-24 shrink-0">
                  <img
                    src={Telephone}
                    alt="VoIP phone"
                    loading="lazy"
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-slate-600">Phones</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold -mt-1 text-gray-800">Business Hosted VoIP</h3>

                  <div className="mt-4">
                    <p className="text-xs text-slate-600">As low as</p>
                    <div className="text-4xl font-extrabold text-gray-800">
                      ${price.toFixed(2)} <span className="text-base font-semibold">/ user*</span>
                    </div>
                    <p className="text-[12px] text-slate-500">*Price varies by features, volume and term.</p>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border p-3 bg-slate-50">
                      <p className="text-slate-600 text-xs">Term</p>
                      <p className="font-semibold">{term === "contract" ? "Contract" : "Month-to-month"}</p>
                    </div>
                    <div className="rounded-lg border p-3 bg-slate-50">
                      <p className="text-slate-600 text-xs">One-time charge</p>
                      <p className="font-semibold">{term === "contract" ? "None" : "Equipment + install may apply"}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl overflow-hidden">
                    <div className={`px-4 py-3 font-semibold ${bundle ? "bg-sky-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                      Bundle &amp; Save
                    </div>
                    <div className="border border-t-0 p-4 text-sm bg-white">
                      {bundle ? (
                        <>
                          <p className="text-slate-700">When bundled with phones, receive:</p>
                          <ul className="mt-2 grid sm:grid-cols-2 gap-y-1">
                            {["Faxing", "Business texting", "Call center", "Failover", "Emergency lines"].map((it) => (
                              <li key={it} className="flex items-center gap-2">
                                <FaCheck className="text-emerald-600" /> {it}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="text-slate-600">
                          Turn on <span className="font-semibold">Bundle &amp; save</span> to unlock popular extras like faxing, texting, and call center.
                        </p>
                      )}
                    </div>
                  </div> <div className="flex justify-center items-center mt-4">
                    <button
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 text-md rounded-full"
                      onClick={handleBook}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border bg-slate-50 p-6">
              <h4 className="text-lg font-bold">What’s included</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  "Unlimited domestic calling",
                  "Auto attendant & IVR",
                  "Music on hold & call recording",
                  "Queues, ring groups, & analytics",
                  "Voicemail to email / text",
                  "Desktop & mobile apps",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <FaCheck className="text-emerald-600" /> {f}
                  </li>
                ))}
              </ul>

              <h4 className="mt-6 text-lg font-bold">Popular add-ons</h4>
              <ul className="mt-2 space-y-2 text-sm">
                {["International calling packs", "Toll-free numbers", "Call center licenses", "SD-WAN and LTE failover"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <FaCheck className="text-emerald-600" /> {f}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* EVERYTHING PLAN */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center">Our Everything Plan</h2>
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white shadow-sm border p-6 text-center">
                <div className="mx-auto mb-3 inline-flex items-center justify-center h-14 w-14 bg-sky-50 rounded-xl">
                  {f.icon}
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilityTiles.map((t) => (
              <div key={t.title} className="rounded-2xl border p-5 bg-slate-50 hover:bg-slate-100 transition">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border">
                  {t.icon}
                </div>
                <p className="mt-3 font-medium">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVICES */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center">Connect from your preferred device</h2>
          <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {deviceCards.map((d) => (
              <article key={d.label} className="rounded-2xl overflow-hidden bg-white border shadow-sm">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img src={d.img} alt={d.label} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold">{d.label}</h3>
                  {d.sub && <p className="mt-2 text-sky-700 font-semibold">{d.sub}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center">Frequently asked questions</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border bg-white p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-slate-700">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-extrabold">Ready to move?</h3>
          <p className="mt-2 text-slate-700">Get live pricing, an instant quote, or a quick demo with our team.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="tel:18557442407"
              aria-label="Call 1-855 744 2407"
              className="rounded-full bg-sky-700 text-white px-6 py-3 font-semibold hover:bg-sky-800"
            >
              Call 1-855 744 2407
            </a>
            <a href="#pricing" className="rounded-full border px-6 py-3 font-semibold hover:bg-slate-50">
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
