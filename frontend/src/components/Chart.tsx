import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ChartProps {
  summary: Record<string, string[]>;
}

export const Chart: React.FC<ChartProps> = ({ summary }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF6666"];

  const data = Object.entries(summary).map(([label, comments]) => ({
    name: label,
    value: comments.length,
  }));

  return (
    <div className="flex justify-center">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          fill="#8884d8"
          label
          className="cursor-pointer"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};
