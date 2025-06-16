import React from 'react';
import { CheckCircle, Heart, Zap, Star, TrendingUp } from 'lucide-react';

const MilestonesTab = () => {
  const milestones = [
    {
      day: 1,
      title: "First 24 Hours",
      description: "Carbon monoxide levels drop to normal",
      icon: Heart,
      color: "text-green-500",
      bgColor: "bg-green-100",
      achieved: true
    },
    {
      day: 3,
      title: "72 Hours",
      description: "Breathing becomes easier, energy increases",
      icon: Zap,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      achieved: true
    },
    {
      day: 7,
      title: "One Week",
      description: "Taste and smell improve significantly",
      icon: Star,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      achieved: true
    },
    {
      day: 30,
      title: "One Month",
      description: "Lung function improves, circulation better",
      icon: TrendingUp,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      achieved: false
    },
    {
      day: 90,
      title: "Three Months",
      description: "Risk of heart attack decreases significantly",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-100",
      achieved: false
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Milestones</h2>
      <div className="space-y-6">
        {milestones.map((milestone) => {
          const Icon = milestone.icon;
          return (
            <div
              key={milestone.day}
              className={`flex items-center p-6 rounded-xl border transition-all duration-200 bg-gray-50 ${
                milestone.achieved
                  ? 'border-green-500'
                  : 'border-gray-200'
              }`}
            >
              <div className={`${milestone.bgColor} p-3 rounded-xl mr-4`}>
                <Icon className={`w-6 h-6 ${milestone.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
                  {milestone.achieved && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Day {milestone.day}</div>
                <div className={`text-sm font-medium ${
                  milestone.achieved ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {milestone.achieved ? 'Achieved!' : 'Upcoming'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestonesTab;