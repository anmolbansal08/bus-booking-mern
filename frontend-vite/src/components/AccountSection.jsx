// AccountSection.jsx
export default function AccountSection({ title, children }) {
  return (
    <div className="mt-6">
      <h4 className="px-4 text-sm font-semibold text-gray-500 uppercase mb-2">
        {title}
      </h4>
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}