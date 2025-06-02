import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ChartCard({ title, data, dataKeyX, dataKeyY, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-cyan-500/50 transition-all shadow">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey={dataKeyX} stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey={dataKeyY} stroke={color || "#8884d8"} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
