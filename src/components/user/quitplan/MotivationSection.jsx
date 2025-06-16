import React from 'react';
import { Users, Brain } from 'lucide-react';

const MotivationSection = () => {
  return (
    <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        You're Doing Amazing! 🌟
      </h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Every day smoke-free is a victory. You're not just quitting smoking - you're choosing a healthier, happier life.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center">
          <Users className="w-4 h-4 mr-2" />
          Join Support Group
        </button>
        <button className="bg-white text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center border border-gray-200">
          <Brain className="w-4 h-4 mr-2" />
          Get Expert Tips
        </button>
      </div>
    </div>
  );
};

export default MotivationSection;