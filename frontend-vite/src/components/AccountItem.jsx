export default function AccountItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full text-left px-5 py-3
        hover:bg-gray-50 transition
        flex items-center justify-between
      "
    >
      <span>{label}</span>
      <span className="text-gray-400">›</span>
    </button>
  );
}