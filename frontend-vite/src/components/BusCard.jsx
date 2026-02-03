import Amenity from "./Amenity";
import RatingBadge from "./RatingBadge";

import { useNavigate, useSearchParams } from "react-router-dom";

export default function BusCard({bus}) {
    console.log("bus",bus);
const {
  name,
  departureTime,
  arrivalTime,
  seatLayout = [],
  bookedSeats = [],
  amenities = [],
} = bus;
const source = bus.routeId?.source;
const destination = bus.routeId?.destination;
const seatsLeft = seatLayout.length - bookedSeats.length;
const showWarning = seatsLeft <= 5;
const startingPrice = seatLayout.length
  ? Math.min(...seatLayout.map(s => s.price))
  : 0;
// price logic (temporary UI logic)
const originalPrice = startingPrice + 2000;
const discount = originalPrice - startingPrice;
    // convert HH:mm → minutes
    const toMinutes = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const isNextDay =
        toMinutes(arrivalTime) < toMinutes(departureTime);
let durationMinutes =
  toMinutes(arrivalTime) - toMinutes(departureTime);

// overnight bus
if (durationMinutes < 0) {
  durationMinutes += 24 * 60;
}

const hours = Math.floor(durationMinutes / 60);
const minutes = durationMinutes % 60;

const duration = `${hours}h ${minutes}m`;
const navigate = useNavigate();
const [params] = useSearchParams();
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3">

            {/* Top Row */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        {name}
                    </h3>

                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500">
                            HriKri Travels
                        </p>
                        <RatingBadge rating="4.3" reviews="128" />
                    </div>
                </div>

                <div className="text-right">
<p className="font-semibold">
  ₹{startingPrice} onwards
</p>

                    <div className="flex items-center gap-2 justify-end">
                        <p className="text-xs text-gray-400 line-through">
                            ₹{originalPrice}
                        </p>

                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            Save ₹{discount}
                        </span>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="mt-3 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium">{departureTime}</p>
                    <p className="text-xs text-gray-500">{source}</p>
                </div>

                <div className="text-center text-xs text-gray-500">
                    <p>{duration}</p>
                    <div className="h-px w-16 bg-gray-300 my-0.5 mx-auto" />
                    <p>Direct</p>
                </div>

                <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                        <p className="text-sm font-medium">{arrivalTime}</p>

                        {isNextDay && (
                            <span className="text-[10px] text-gray-500 border border-gray-300 px-1 rounded">
                                +1
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-gray-500">{destination}</p>
                </div>
            </div>

            {/* Amenities */}
<div className="mt-2 flex gap-4">
  {amenities.includes("AC") && <Amenity icon="❄️" label="AC" />}
  {amenities.includes("SLEEPER") && <Amenity icon="🛏️" label="Sleeper" />}
  {amenities.includes("CHARGING") && <Amenity icon="🔌" label="Charging" />}
</div>

            {/* Footer */}
            <div className="mt-3 flex justify-between items-center">
                <div className="flex flex-col">
                    <p className="text-xs text-gray-600">
                        <span className="font-medium text-gray-900">
                            {seatsLeft}
                        </span>{" "}
                        seats left
                    </p>

                    {showWarning && (
                        <p className="text-xs text-orange-600 font-medium mt-0.5">
                            Few seats left
                        </p>
                    )}
                </div>

<button
  onClick={() =>
    navigate(`/seats/${bus._id}?date=${params.get("date")}`)
  }
  className="bg-red-600 hover:bg-red-700 transition
  text-white px-4 py-1.5 rounded-md text-sm font-semibold"
>
  View Seats
</button>
            </div>
        </div>
    );
}