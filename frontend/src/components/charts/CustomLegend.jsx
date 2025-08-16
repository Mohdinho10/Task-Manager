function CustomLegend({ payload }) {
  if (!payload || !Array.isArray(payload)) return null;

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2 space-x-6">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center space-x-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm text-gray-800">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default CustomLegend;
