// AccountItem.jsx
export default function AccountItem({ label }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t hover:bg-gray-50 cursor-pointer">
      <span className="text-gray-800">{label}</span>
      <span className="text-gray-400">›</span>
    </div>
  );
}