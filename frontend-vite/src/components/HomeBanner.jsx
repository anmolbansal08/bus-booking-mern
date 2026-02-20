import banner from "../assets/banner.png";

export default function HomeBanner() {
  return (
<div className="w-full">
  <img
    src={banner}
    alt="Bus booking offers"
    className="w-full h-[220px] object-cover"
  />
</div>
  );
}