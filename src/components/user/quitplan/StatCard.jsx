import React from 'react';

const StatCard = ({ icon: Icon, value, label, color, bgColor }) => (
  <div className={`${bgColor} backdrop-blur-sm border border-white/20 rounded-2xl p-6`}>
    <div className="flex items-center justify-between mb-4">
      <Icon className={`w-8 h-8 ${color}`} />
      <div className="text-right">
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-gray-300 text-sm">{label}</div>
      </div>
    </div>
  </div>
);

export default StatCard;