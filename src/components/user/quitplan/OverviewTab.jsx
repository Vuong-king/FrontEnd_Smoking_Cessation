import React from 'react';
import { Award, Target } from 'lucide-react';

const OverviewTab = ({ completedDays }) => {
  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Progress Overview</h2>
      
      {/* Progress Chart */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">14-Day Progress Streak</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                completedDays.includes(i + 1)
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Recent Achievement
          </h3>
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-600 font-medium">Two Weeks Strong! 🎉</div>
            <div className="text-gray-600 text-sm mt-1">
              You've successfully stayed smoke-free for 14 days!
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Next Goal
          </h3>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-600 font-medium">One Month Milestone</div>
            <div className="text-gray-600 text-sm mt-1">
              16 days to go until your first month!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;