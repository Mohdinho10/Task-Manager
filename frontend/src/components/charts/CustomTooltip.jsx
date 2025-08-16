function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-2 shadow-md">
        <p className="mb-1 text-xs font-semibold text-blue-800">
          {payload[0].name}{" "}
        </p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="text-sm font-medium text-gray-900">
            {" "}
            {payload[0].value}
          </span>{" "}
        </p>
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
