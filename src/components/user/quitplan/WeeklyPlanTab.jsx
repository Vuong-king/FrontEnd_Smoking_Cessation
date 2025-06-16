import React from 'react';
import { Circle } from 'lucide-react';

const WeeklyPlanTab = () => {
  const weeklyPlan = [
    {
      week: 1,
      title: "Preparation Week",
      description: "Set quit date, remove triggers, gather support",
      tasks: [
        "Choose your quit date",
        "Tell friends and family",
        "Remove cigarettes from home",
        "Download quit smoking app"
      ]
    },
    {
      week: 2,
      title: "Quit Week",
      description: "Begin your smoke-free journey",
      tasks: [
        "Use nicotine replacement if needed",
        "Practice stress management",
        "Stay hydrated",
        "Avoid triggers"
      ]
    },
    {
      week: 3,
      title: "Adjustment Week",
      description: "Develop new habits and routines",
      tasks: [
        "Establish new routines",
        "Find healthy distractions",
        "Exercise regularly",
        "Connect with support group"
      ]
    },
    {
      week: 4,
      title: "Reinforcement Week",
      description: "Strengthen your commitment",
      tasks: [
        "Celebrate small wins",
        "Plan for challenging situations",
        "Continue healthy habits",
        "Share your progress"
      ]
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">4-Week Action Plan</h2>
      <div className="grid gap-6">
        {weeklyPlan.map((week) => (
          <div key={week.week} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{week.title}</h3>
                <p className="text-gray-600 text-sm">{week.description}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Week {week.week}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {week.tasks.map((task, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                  <Circle className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600 text-sm">{task}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlanTab;