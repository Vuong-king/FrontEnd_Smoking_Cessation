import React from 'react';
import { Award, Target } from 'lucide-react';

const OverviewTab = ({ completedDays }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Your Progress Overview</h2>
      
      {/* Progress Chart */}
      <div className="bg-white/5 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">14-Day Progress Streak</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                completedDays.includes(i + 1)
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-400" />
            Recent Achievement
          </h3>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-400 font-medium">Two Weeks Strong! 🎉</div>
            <div className="text-gray-300 text-sm mt-1">
              You've successfully stayed smoke-free for 14 days!
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-400" />
            Next Goal
          </h3>
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-400 font-medium">One Month Milestone</div>
            <div className="text-gray-300 text-sm mt-1">
              16 days to go until your first month!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;