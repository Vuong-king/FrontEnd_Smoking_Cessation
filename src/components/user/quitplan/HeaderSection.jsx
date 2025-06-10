import React from 'react';

const HeaderSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
             Your Quit Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your personalized roadmap to a smoke-free life
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;