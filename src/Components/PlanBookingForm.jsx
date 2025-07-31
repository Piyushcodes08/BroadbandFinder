import React from "react";
import { FaTimes } from "react-icons/fa";

export default function PlanBookingForm({ isOpen, onClose, provider, plan }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Book This Plan</h2>
        <p className="text-gray-600 mb-2">
          <strong>Provider:</strong> {provider.name}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Plan:</strong> {plan.name}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Speed:</strong> {plan.speed} | <strong>Price:</strong> {plan.price}
        </p>
          <p className="text-gray-600 mb-4">
          <strong>Connection:</strong> {provider.connection} 
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Booking submitted!");
            onClose();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Installation Address"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="date"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
         
          
          <textarea
            placeholder="Additional Notes (optional)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            rows="3"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
