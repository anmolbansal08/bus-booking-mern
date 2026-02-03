export default function BusInfoTabsContent({
  activeTab,
  info,
  amenities = []
}) {
  const tabContent = {
    WHY: (
      <ul className="list-disc pl-4">
        {info.highlights?.map(h => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    ),

    ROUTE: (
      <p>{info.routeStops?.join(" → ")}</p>
    ),

    BOARD: info.boardingPoints?.map((b, i) => (
      <p key={i}>
        <strong>{b.time}</strong> — {b.name}
      </p>
    )),

    DROP: info.droppingPoints?.map((d, i) => (
      <p key={i}>
        <strong>{d.time}</strong> — {d.name}
      </p>
    )),

    AMENITIES: (
      <p>{amenities.join(", ")}</p>
    ),

    POLICY: (
      <>
        <p>{info.policies?.cancellation}</p>
        <p>{info.policies?.luggage}</p>
        <p>{info.policies?.pets}</p>
      </>
    )
  };

  return (
    <div className="text-sm text-gray-700 space-y-2">
      {tabContent[activeTab] || null}
    </div>
  );
}