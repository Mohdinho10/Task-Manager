function InfoCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h3 className="text-xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}

export default InfoCard;
