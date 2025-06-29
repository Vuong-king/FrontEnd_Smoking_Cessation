import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ChartCard = ({ title, data, dataKeyX, dataKeyY, color }) => {
  return (
    <div className="p-4 border border-white rounded-xl shadow-inner backdrop-blur-md bg-white/10">
      {/* Nếu cần title thì hiện */}
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      )}

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff44" />
            <XAxis dataKey={dataKeyX} stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderColor: "#fff",
                color: "#000",
              }}
              itemStyle={{ color: "#000" }}
            />
            <Line
              type="monotone"
              dataKey={dataKeyY}
              stroke={color || "#ffffff"}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
