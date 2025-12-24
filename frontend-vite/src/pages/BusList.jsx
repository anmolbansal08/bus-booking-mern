import BusCard from "../components/BusCard";

export default function BusList({ results }) {
  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      
      {results.total > 0 && (
        <p className="text-sm text-gray-600 mb-3">
          {results.total} buses found
        </p>
      )}

      {results.buses.map(bus => (
        <BusCard key={bus._id} bus={bus} />
      ))}

      {results.total === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No buses available for selected date
        </p>
      )}
    </div>
  );
}