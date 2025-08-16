function StatsCard({ count, label, status }) {
  const getStatusTagColor = () => {
    switch (status) {
      case "inProgress":
        return "text-cyan-600 bg-cyan-50";
      case "completed":
        return "text-green-600 bg-green-50";
      default:
        return "text-violet-600 bg-violet-50";
    }
  };

  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center rounded-lg px-3 py-2 ${getStatusTagColor()}`}
    >
      <span className="text-lg font-semibold">{count}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

export default StatsCard;
