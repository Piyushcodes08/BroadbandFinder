import React from "react";

export default function ProviderPlanCard({ plan, onBook }) {
  
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between h-full" data-aos="fade-up" data-aos-offset="0">
      <div>
        <h4 className="text-lg font-bold text-gray-800">{plan.name}</h4>
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-medium text-gray-700">Speed:</span> {plan.speed}
          {" | "}
          <span className="font-medium text-gray-700">Price:</span> {plan.price}
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-1">
          {plan.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          <strong>Contract:</strong> {plan.contract}
        </p>
      </div>
      <button
        onClick={onBook}
        className="mt-4 w-full bg-[#E8611A] text-white py-2 rounded-full text-sm font-medium hover:bg-[#C44E12] transition"
      >
        Book Now
      </button>
    </div>
  );
}
