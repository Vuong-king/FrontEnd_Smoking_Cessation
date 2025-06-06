import React from 'react';
import { Calendar, DollarSign, Cigarette, Heart } from 'lucide-react';
import StatCard from './StatCard';

const StatsOverview = ({ quitStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard
        icon={Calendar}
        value={quitStats.daysSmokesFree}
        label="Days Smoke-Free"
        color="text-green-400"
        bgColor="bg-green-500/10"
      />
      <StatCard
        icon={DollarSign}
        value={`$${quitStats.moneySaved}`}
        label="Money Saved"
        color="text-blue-400"
        bgColor="bg-blue-500/10"
      />
      <StatCard
        icon={Cigarette}
        value={quitStats.cigarettesNotSmoked}
        label="Cigarettes Not Smoked"
        color="text-purple-400"
        bgColor="bg-purple-500/10"
      />
      <StatCard
        icon={Heart}
        value={`${quitStats.healthPoints}%`}
        label="Health Score"
        color="text-red-400"
        bgColor="bg-red-500/10"
      />
    </div>
  );
};

export default StatsOverview;