import React from 'react';

const StatCard = ({ icon: Icon, value, label, color, bgColor }) => (
  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`${bgColor} p-3 rounded-xl`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="text-right">
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-gray-600 text-sm">{label}</div>
      </div>
    </div>
  </div>
);

export default StatCard;