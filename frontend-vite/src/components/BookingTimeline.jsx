export default function BookingTimeline({ currentStep }) {
  const steps = [
    "Search",
    "Seats",
    "Passenger Info",
    "Payment",
    "Confirmed"
  ];

  return (
    <div className="flex items-center justify-between mb-6 text-sm">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex-1 text-center ${
            index <= currentStep
              ? "text-red-600 font-semibold"
              : "text-gray-400"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}