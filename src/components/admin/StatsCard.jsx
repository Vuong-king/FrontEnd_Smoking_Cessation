import React from "react";

export function StatsCard({ title, value, icon, color = "from-purple-500 to-cyan-500" }) {
  return (
    <div className={`bg-gradient-to-r ${color} text-white rounded-xl p-6 shadow hover:shadow-lg transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {icon && <div className="w-8 h-8">{icon}</div>}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default StatsCard;
