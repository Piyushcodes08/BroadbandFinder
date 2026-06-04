import { useState } from "react";

export default function OrderBooking({ bundles }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    plan: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const steps = ["Personal Info", "Address", "Plan Selection", "Payment", "Review & Submit"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Form submitted!");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6" data-aos="fade-up">
      {/* Progress */}
      <div className="flex items-center mb-10" data-aos="fade-down">
        {steps.map((label, index) => (
          <div key={label} className="flex-1 flex items-center">
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center font-semibold ${
                step > index + 1
                  ? "bg-green-500 text-white"
                  : step === index + 1
                  ? "bg-[#F47630] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-gray-300 mx-2">
                <div
                  className={`h-full ${
                    step > index + 1 ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg space-y-8" data-aos="fade-up" data-aos-delay="100">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Address Details</h2>
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Select Your Plan</h2>
            <div className="space-y-4" data-aos="fade-up">
              {bundles.map((bundle, idx) => (
                <label
                  key={idx}
                  className={`block border p-4 rounded-lg cursor-pointer transition ${
                    formData.plan === bundle.title
                      ? "border-[#F47630] bg-[#FEF3EC]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={bundle.title}
                    checked={formData.plan === bundle.title}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{bundle.title}</h3>
                      <p className="text-gray-600">{bundle.description}</p>
                    </div>
                    <span className="text-xl font-bold">${bundle.price}/mo</span>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                className="w-1/2 p-3 border rounded"
                required
              />
              <input
                type="text"
                name="cvc"
                placeholder="CVC"
                value={formData.cvc}
                onChange={handleChange}
                className="w-1/2 p-3 border rounded"
                required
              />
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Review &amp; Submit</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
              <p><strong>Plan:</strong> {formData.plan}</p>
              <p><strong>Card:</strong> **** **** **** {formData.cardNumber.slice(-4)}</p>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="py-2 px-5 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Back
            </button>
          )}
          {step < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto py-2 px-5 rounded-lg bg-[#F47630] text-white hover:bg-[#E8611A]"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto py-2 px-5 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
