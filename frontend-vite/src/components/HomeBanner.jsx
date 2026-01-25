import banner from "../assets/banner.jpg";

export default function HomeBanner() {
  return (
<div className="w-full max-w-6xl mx-auto mb-4 px-4">
  <div className="relative rounded-xl overflow-hidden bg-gray-100">
    <img
      src={banner}
      alt="Festival Sale"
      className="w-full h-[150px] object-cover"
    />
  </div>
</div>
  );
}