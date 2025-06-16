import React, { useState } from 'react';
import { Calendar, DollarSign, Heart, Award, Cigarette, Trophy } from 'lucide-react'; 
import ColourfulText from '../../ui/ColourfulText';

const QuitSmokingTracker = () => {
  const [quitDate] = useState(new Date('2024-01-15'));
  const [cigarettesPerDay] = useState(20); 
  const [pricePerPack] = useState(50000);
  const [cigarettesPerPack] = useState(20); 

  const calculateStats = () => {
    const now = new Date();
    const timeDiff = now.getTime() - quitDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    // Tính tiền tiết kiệm
    const cigarettesAvoided = daysDiff * cigarettesPerDay;
    const packsAvoided = cigarettesAvoided / cigarettesPerPack;
    const moneySaved = packsAvoided * pricePerPack;
    
    // Tính % cải thiện sức khỏe (giả định tuyến tính, tối đa 100% sau 1 năm)
    const healthImprovement = Math.min((daysDiff / 365) * 100, 100);
    
    // Tính số huy hiệu (mỗi 7 ngày = 1 huy hiệu)
    const badges = Math.floor(daysDiff / 7);
    
    return {
      days: daysDiff,
      moneySaved: Math.round(moneySaved),
      healthImprovement: Math.round(healthImprovement * 10) / 10,
      badges: badges,
      cigarettesAvoided: cigarettesAvoided
    };
  };

  const stats = calculateStats();

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Thay đổi cards config
  const cards = [
    {
      title: 'Days Smoke-Free',
      value: stats.days,
      unit: 'days',
      icon: Calendar,
      bgColor: 'bg-emerald-100',
      bgLight: 'bg-white',
      textColor: 'text-emerald-600',
      emoji: '✅'
    },
    {
      title: 'Money Saved',
      value: formatMoney(stats.moneySaved),
      unit: '',
      icon: DollarSign,
      bgColor: 'bg-blue-100',
      bgLight: 'bg-white',
      textColor: 'text-blue-600',
      emoji: '💰'
    },
    {
      title: 'Health Improvement',
      value: stats.healthImprovement,
      unit: '%',
      icon: Heart,
      bgColor: 'bg-pink-100',
      bgLight: 'bg-white',
      textColor: 'text-pink-600',
      emoji: '❤️'
    },
    {
      title: 'Badges Earned',
      value: stats.badges,
      unit: 'badges',
      icon: Award,
      bgColor: 'bg-yellow-100',
      bgLight: 'bg-white',
      textColor: 'text-yellow-600',
      emoji: '🏅'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
             Quit Smoking <ColourfulText text="Journey"/>
          </h1>
          <p className="text-lg text-gray-600">
            Track your progress and achievements
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
            <Cigarette className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-gray-700">
              Started on: {quitDate.toLocaleDateString('en-US')}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.bgColor} p-3 rounded-xl shadow-sm`}>
                    <IconComponent className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                  <span className="text-2xl">{card.emoji}</span>
                </div>
                
                <h3 className="text-gray-700 text-sm font-medium mb-2">
                  {card.title}
                </h3>
                
                <div className="flex items-baseline">
                  <span className={`${card.textColor} text-3xl font-bold`}>
                    {typeof card.value === 'string' ? card.value : card.value.toLocaleString('vi-VN')}
                  </span>
                  {card.unit && (
                    <span className="text-gray-500 text-sm ml-2">
                      {card.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
          <div className="flex items-center mb-6">
            <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Cigarettes Avoided
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.cigarettesAvoided.toLocaleString('en-US')}
              </p>
              <p className="text-gray-600 text-sm mt-1">cigarettes</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Current Level
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {Math.floor(stats.days / 30) + 1}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {stats.days < 30 ? 'Beginner' : 
                 stats.days < 90 ? 'Persistent' : 
                 stats.days < 180 ? 'Warrior' : 
                 stats.days < 365 ? 'Master' : 'Legend'}
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <p className="text-xl text-gray-700 italic mb-2">
              "Every day without smoking is a victory!"
            </p>
            <p className="text-gray-600">
              Keep going and be proud of what you've achieved 💪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuitSmokingTracker;