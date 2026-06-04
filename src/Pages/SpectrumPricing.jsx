export default function SpectrumPricing() {
  const plans = [
    {
      name: "Basic Tier",
      price: 80,
      speed: "500 Mbps",
      features: [
        "Fast Internet",
        "Telephone",
        "wifi"
      ],
      buttonText: "Select Plan",
    },
    {
      name: "Mid Tier",
      price: 110,
      speed: "750 Mbps",
      features: [
        "Fast Internet",
        "Telephone",
        "wifi"
      ],
      buttonText: "Select Plan",
      popular: true,
    },
    {
      name: "High Tier",
      price: 120,
      speed: "1 Gbps",
      features: [
        "Fast Internet",
        "Telephone",
        "wifi"
      ],
      buttonText: "Select Plan",
    },
  ];

  return (
    <div>
    <section className="max-w-7xl mx-auto px-6 py-16 pt-32">
      <h2 className="text-5xl font-bold text-center mb-4">
        Plans & Pricing
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Choose the internet plan that fits your needs — all with no contracts
        and no hidden fees.
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`border rounded-lg shadow-sm overflow-hidden flex flex-col ${
              plan.popular ? "border-red-600 ring-2 ring-indigo-200" : ""
            }`}
          >
            {/* Header */}
            <div
              className={`p-6 text-center ${
                plan.popular ? "bg-red-500 text-white" : "bg-gray-100"
              }`}
            >
              {plan.popular && (
                <span className="inline-block bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  Most Popular
                </span>
              )}
              <h3 className="text-3xl font-semibold">{plan.name}</h3>
              <p className="text-5xl font-bold mt-2">
                ${plan.price}
                <span className="text-base font-normal">/mo</span>
              </p>
              <p className="mt-1">{plan.speed}</p>
            </div>

            {/* Features */}
            <ul className="flex-1 p-6 space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-green-500">✔</span> {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="p-6 border-t bg-gray-50">
              <button
                className={`w-full py-2 px-4 rounded font-semibold transition ${
                  plan.popular
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
     <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-xl font-bold mb-4">Bundled Offer Details</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-4">
        <p>
          Limited time offer; subject to change; new residential customers only
          (no Spectrum services within past 30 days) and in good standing with
          Spectrum. Taxes and fees extra in select states. Standard rates apply
          after promo period or if qualifying services not maintained. Offer
          subject to qualifying services being ordered on the same day.
          <strong> SPECTRUM INTERNET:</strong> Additional charge for
          installation. Speeds based on wired connection. Actual speeds
          (including wireless) vary and are not guaranteed. Capable modem
          required for all Gig speeds. For a list of capable modems, visit{" "}
          <a
            href="https://www.spectrum.net/modem"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline"
          >
            spectrum.net/modem
          </a>
          . Services subject to all applicable service terms and conditions,
          subject to change. Not available in all areas. Restrictions apply.
        </p>

        <p>
          Limited time offer; subject to change; offer applies to new Mobile
          customers without any outstanding obligation to Spectrum. Limited to
          one promotional line per account. Mobile devices excluded from offer.
          Offer reflected with up to 12 months credit on bill statement.
          Standard rates apply after promo period or if qualifying services not
          maintained. Offer cannot be applied to existing lines on customer
          account. Existing mobile customers must add one or more new lines to
          get promotional line discount. Tablets not eligible for promotion.
          Reduced speeds after 30 GB of usage per line. Services subject to all
          applicable service terms and conditions, subject to change. Not
          available in all areas. Auto Pay required. Restrictions apply.
        </p>
      </div>
    </section>
    </div>
  );
}
