import Amenity from "./Amenity";
import RatingBadge from "./RatingBadge";

export default function BusCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3">
      
      {/* Top Row */}
      <div className="flex justify-between items-start">
<div>
  <h3 className="text-base font-semibold text-gray-900">
    Volvo AC Sleeper
  </h3>

  <div className="flex items-center gap-2 mt-0.5">
    <p className="text-xs text-gray-500">
      HriKri Travels
    </p>
    <RatingBadge rating="4.3" reviews="128" />
  </div>
</div>

        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">₹999</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">06:00</p>
          <p className="text-xs text-gray-500">Delhi</p>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>8h 30m</p>
          <div className="h-px w-16 bg-gray-300 my-0.5 mx-auto" />
          <p>Direct</p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium">14:30</p>
          <p className="text-xs text-gray-500">Jaipur</p>
        </div>
      </div>

      {/* Amenities */}
{/* Amenities */}
<div className="mt-2 flex gap-4">
  <Amenity icon="❄️" label="AC" />
  <Amenity icon="🛏️" label="Sleeper" />
  <Amenity icon="🔌" label="Charging" />
</div>

      {/* Footer */}
      <div className="mt-3 flex justify-between items-center">
        <p className="text-xs text-gray-600">
          <span className="font-medium text-gray-900">6</span> seats left
        </p>

        <button className="bg-red-600 hover:bg-red-700 transition
          text-white px-4 py-1.5 rounded-md text-sm font-semibold">
          View Seats
        </button>
      </div>
    </div>
  );
}