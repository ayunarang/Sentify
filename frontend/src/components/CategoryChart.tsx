import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface CategoryChartProps {
  summary: Record<string, string[]>;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ summary }) => {
  const chartData = Object.entries(summary).map(([name, comments]) => ({
    name,
    value: comments.length,
  }));

  return (
    <div className="w-full max-w-2xl h-64 mt-8 bg-transparent">
      <ResponsiveContainer width="100%" height="100%" className={"pr-8 bg-transparent"}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#4B5563" />
          <YAxis stroke="#4B5563" />
          <Tooltip />
          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} className=" cursor-pointer"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
