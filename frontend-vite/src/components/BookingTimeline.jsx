import { useNavigate } from "react-router-dom";

export default function BookingTimeline({ currentStep }) {
  const navigate = useNavigate();

  const steps = [
    { label: "Search", path: "/" },
    { label: "Seats", path: -1 },
    { label: "Passenger Info", path: "/passenger-info" },
    { label: "Payment", path: "/payment" },
    { label: "Confirmed", path: "/booking-success" }
  ];

  const handleClick = (index) => {
    if (index > currentStep) return; // block future steps

    const step = steps[index];

    if (step.path === -1) {
      navigate(-1);
    } else {
      navigate(step.path);
    }
  };

  return (
    <div className="border-b bg-white">
      <div className="max-w-6xl mx-auto flex text-sm">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isDisabled = index > currentStep;

          return (
            <div
              key={step.label}
              onClick={() => handleClick(index)}
              className={`
                px-6 py-4 cursor-pointer transition relative
                ${isActive ? "text-red-600 font-semibold" : ""}
                ${isCompleted ? "text-gray-700 hover:text-red-600" : ""}
                ${isDisabled ? "text-gray-400 cursor-not-allowed" : ""}
              `}
            >
              {index + 1}. {step.label}

              {/* Active underline */}
              {isActive && (
                <div className="absolute left-0 bottom-0 w-full h-[2px] bg-red-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}