export default function OffersBanner() {
  return (
    <div className="bg-red-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-red-200 rounded-2xl px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-red-600 text-xl">🎉</span>
            <div>
              <p className="font-semibold text-gray-800">
                Flat ₹100 OFF on your first bus booking
              </p>
              <p className="text-sm text-gray-600">
                Use code <span className="font-semibold">FIRSTBUS</span>
              </p>
            </div>
          </div>

          <button className="text-sm font-semibold text-red-600 hover:underline">
            View details
          </button>
        </div>
      </div>
    </div>
  );
}