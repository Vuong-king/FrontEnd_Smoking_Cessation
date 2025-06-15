import React from 'react';
import { Target, Award, Calendar, CheckCircle } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'milestones', label: 'Milestones', icon: Award },
    { id: 'weekly', label: 'Weekly Plan', icon: Calendar },
    { id: 'goals', label: 'Daily Goals', icon: CheckCircle }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2 mb-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;