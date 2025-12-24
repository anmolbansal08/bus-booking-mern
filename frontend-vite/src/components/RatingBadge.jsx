export default function RatingBadge({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-600">
      <span className="text-yellow-500">★</span>
      <span className="font-medium text-gray-900">{rating}</span>
      <span className="text-gray-400">({reviews})</span>
    </div>
  );
}