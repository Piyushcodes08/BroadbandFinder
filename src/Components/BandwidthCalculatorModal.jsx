import { useState, useMemo } from "react";

function BandwidthCalculatorModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [devices, setDevices] = useState(3);
  const [videoCalls, setVideoCalls] = useState("sometimes");
  const [gaming, setGaming] = useState("no");
  const [priority, setPriority] = useState("speed");

  const speed = useMemo(() => {
    let s = devices * 5;
    if (videoCalls === "often") s += 20;
    else if (videoCalls === "sometimes") s += 10;
    if (gaming === "yes") s += 25;
    return Math.max(5, s);
  }, [devices, videoCalls, gaming]);

  const suggestion =
    priority === "speed"
      ? `We recommend at least ${speed} Mbps for the best experience.`
      : `To save on cost, plans around ${Math.max(
          speed - 10,
          1
        )} Mbps may be fine.`;

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 sm:p-10" data-aos="zoom-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-[#E8611A]">
            Bandwidth Calculator
          </h1>
          <button
            onClick={onClose}
            aria-label="Close calculator"
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Step {step} of 5
          </span>
          <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#E8611A] h-2 rounded-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            step < 5 ? next() : onClose();
          }}
          className="space-y-4"
        >
          {step === 1 && (
            <>
              <label htmlFor="devices-input" className="block font-semibold">
                How many devices are used at home?
              </label>
              <input
                id="devices-input"
                type="number"
                min="1"
                value={devices}
                onChange={(e) =>
                  setDevices(Math.max(1, parseInt(e.target.value || "1", 10)))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F47630]"
              />
            </>
          )}

          {step === 2 && (
            <>
              <label
                htmlFor="video-calls-select"
                className="block font-semibold"
              >
                How often do you video conference?
              </label>
              <select
                id="video-calls-select"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F47630]"
                value={videoCalls}
                onChange={(e) => setVideoCalls(e.target.value)}
              >
                <option value="rarely">Rarely</option>
                <option value="sometimes">Sometimes</option>
                <option value="often">Often</option>
              </select>
            </>
          )}

          {step === 3 && (
            <>
              <label htmlFor="gaming-select" className="block font-semibold">
                Does your household game online?
              </label>
              <select
                id="gaming-select"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F47630]"
                value={gaming}
                onChange={(e) => setGaming(e.target.value)}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </>
          )}

          {step === 4 && (
            <>
              <label htmlFor="priority-select" className="block font-semibold">
                What matters most to you?
              </label>
              <select
                id="priority-select"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F47630]"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="speed">Speed</option>
                <option value="price">Price</option>
              </select>
            </>
          )}

          {step === 5 && (
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-[#E8611A] mb-2">
                Recommended Speed
              </h2>
              <p className="text-5xl font-bold text-gray-900 mb-3">
                {speed} Mbps
              </p>
              <p className="text-gray-700 text-lg">{suggestion}</p>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className="px-5 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Back
            </button>
            {step < 5 ? (
              <button
                type="submit"
                className="px-6 py-3 bg-[#E8611A] text-white rounded-md hover:bg-[#C44E12]"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              >
                Close
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default BandwidthCalculatorModal;