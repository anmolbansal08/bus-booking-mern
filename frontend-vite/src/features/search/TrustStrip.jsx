export default function TrustStrip() {
  return (
    <div className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-center gap-6 text-sm text-gray-700">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
          <span className="text-green-600">✔</span>
          <span>Safe Payments</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
          <span className="text-green-600">✔</span>
          <span>Verified Operators</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
          <span className="text-green-600">✔</span>
          <span>24x7 Customer Support</span>
        </div>
      </div>
    </div>
  );
}