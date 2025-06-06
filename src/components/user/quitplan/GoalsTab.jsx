import React from 'react';
import { CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';

const GoalsTab = ({ 
  customGoals, 
  newGoal, 
  setNewGoal, 
  addCustomGoal, 
  toggleGoal, 
  deleteGoal 
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Daily Goals</h2>
      
      {/* Add New Goal */}
      <div className="bg-white/5 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Goal</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a new daily goal..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
          />
          <button
            onClick={addCustomGoal}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {customGoals.map((goal) => (
          <div
            key={goal.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
              goal.completed
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center">
              <button
                onClick={() => toggleGoal(goal.id)}
                className="mr-3"
              >
                {goal.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <span className={`${
                goal.completed ? 'text-green-300 line-through' : 'text-white'
              }`}>
                {goal.text}
              </span>
            </div>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsTab;