import { useNavigate } from "react-router-dom";

export default function BookingTimeline({ currentStep }) {
  const navigate = useNavigate();

  const steps = [
    { label: "Search", path: "/" },
    { label: "Seats", path: -1 },
    { label: "Passenger Info", path: "/passenger-info" },
  ];

  const handleClick = (index) => {
    if (index > currentStep) return;

    const step = steps[index];

    if (step.path === -1) {
      navigate(-1);
    } else {
      navigate(step.path);
    }
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-6 px-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isDisabled = index > currentStep;

          return (
            <div key={step.label} className="flex items-center flex-1">
              
              {/* STEP */}
              <div
                onClick={() => handleClick(index)}
                className={`flex flex-col items-center flex-1 ${
                  isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                    transition
                    ${
                      isActive
                        ? "bg-red-600 text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }
                  `}
                >
                  {index + 1}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-xs ${
                    isActive
                      ? "text-red-600 font-semibold"
                      : isCompleted
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-[2px] mx-2
                    ${
                      index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}