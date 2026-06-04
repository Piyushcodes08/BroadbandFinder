function SpeedTestEmbed({ onClose }) {
  // Use an embeddable speed test (Fast.com disallows iframes)
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Speed test"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full relative overflow-hidden">
        <button
          className="absolute top-4 right-5 text-red-600 text-3xl font-bold hover:text-red-800"
          onClick={onClose}
          aria-label="Close speed test"
        >
          ×
        </button>
        <iframe
          title="OpenSpeedTest"
          src="https://openspeedtest.com/speedtest"
          width="100%"
          height="560"
          className="rounded-b-2xl border-t border-gray-200"
          allowFullScreen
        />
      </div>
    </div>
  );
}
export default SpeedTestEmbed;