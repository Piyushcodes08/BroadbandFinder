import axios from "axios";
import { useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

export default function PlanBookingForm({
  isOpen,
  onClose,
  provider,
  zip,
  matchedProvider,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    notes: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  console.log(matchedProvider?.startingPrice);
 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true); // ✅ Start loading state
  try {
    const payload = {
      ...formData,
      provider: provider.name || provider.typeName,
      price:
        matchedProvider?.startingPrice || provider.startingPrice || "29.99",
      speed: matchedProvider?.speed || provider.speed || "100 Mbps",
      zip,
    };

    await axios.post("https://zenith.cloudastro.space/api/book/bookings", payload);

    setShowSuccess(true);
    setFormData({ name: "", phone: "", address: "", date: "", notes: "" });

    // Auto close modal after 2.5s
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2500);
  } catch (err) {
    console.error("Error submitting booking:", err);
    alert("Error submitting form. Try again.");
  } finally {
    setSubmitting(false); // ✅ Stop loading state
  }
};


  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <FaTimes size={18} />
        </button>

        {showSuccess ? (
          <div className="flex flex-col items-center text-center text-green-700">
            <FaCheckCircle size={48} className="mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Successful!</h2>
            <p className="text-gray-600">
              We’ll contact you shortly with more details.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Book Internet Plan
            </h2>

            <p className="text-gray-600 mb-2">
              <strong>Provider:</strong> {provider.name || provider.typeName}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Zip:</strong> {zip}
            </p>

            <p className="text-gray-600 mb-2">
              <strong>Starting Price:</strong>{" "}
              {matchedProvider?.startingPrice ||
                provider.startingPrice ||
                "29.99"}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Speed:</strong>{" "}
              {matchedProvider?.speed || provider.speed || "100 Mbps"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="address"
                placeholder="Installation Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <textarea
                name="notes"
                placeholder="Additional Notes (optional)"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                rows="3"
              ></textarea>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex items-center justify-center bg-red-600 text-white py-2 rounded-full transition ${
                  submitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-700"
                }`}
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
