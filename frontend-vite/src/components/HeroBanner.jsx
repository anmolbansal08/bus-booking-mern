export default function HeroBanner({ children }) {
  return (
    <section className="relative bg-gradient-to-b from-red-50 to-white">
      
      {/* Background pattern (very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
        {/* Text */}
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            India’s smart way to book bus tickets
          </h1>

          <p className="mt-3 text-gray-600 text-lg">
            Easy bookings · Trusted operators · Instant confirmation
          </p>
        </div>

        {/* Search card slot */}
        <div className="mt-14">
          {children}
        </div>
      </div>

      {/* Soft bottom divider */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200" />
    </section>
  );
}