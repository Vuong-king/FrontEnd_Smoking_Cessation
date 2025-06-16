import React from 'react';
import ColourfulText from '../../ui/ColourfulText';

const HeaderSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <ColourfulText text="Your Quit Plan" />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personalized roadmap to a smoke-free life
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;