import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function CustomBarChart({ data }) {
  console.log(data);
  // Function to alternate colors
  const getBarColor = (entry) => {
    switch (entry?.status) {
      case "low":
        return "#00bc7d";
      case "medium":
        return "#fe9900";
      case "high":
        return "#ff1f57";
      default:
        return "#00bc7d";
    }
  };

  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded border border-gray-300 bg-white p-2 shadow-md">
          <p className="mb-1 text-xs font-semibold text-slate-800">
            {payload[0].payload.priority}
          </p>
          <p className="text-sm text-gray-600">
            Count:{" "}
            <span className="text-sm font-medium text-gray-900">
              {payload[0].payload.count}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 bg-white">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip content={CustomToolTip} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="count"
            nameKey="priority"
            fill="#ff8042"
            radius={[10, 10, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;
