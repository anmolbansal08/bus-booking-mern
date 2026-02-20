export default function Logo({ size = 130 }) {
  return (
    <div style={{ width: size }}>
      <svg
        viewBox="0 0 220 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        {/* Bus Body */}
        <rect
          x="12"
          y="18"
          width="196"
          height="40"
          rx="20"
          stroke="#DC2626"
          strokeWidth="2.2"
          fill="white"
        />

        {/* Wheels */}
        <circle cx="65" cy="66" r="6" fill="#DC2626" />
        <circle cx="155" cy="66" r="6" fill="#DC2626" />

        {/* Brand Name */}
        <text
          x="110"
          y="45"
          textAnchor="middle"
          fontSize="26"
          fontWeight="700"
          fill="#DC2626"
          fontFamily="Inter, Poppins, sans-serif"
          letterSpacing="0.5"
        >
          HriKri
        </text>
      </svg>
    </div>
  );
}