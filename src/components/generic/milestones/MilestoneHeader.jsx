import { ChevronDown, ChevronRight, CheckCircle, Circle, Clock } from 'lucide-react';

export const MilestoneHeader = ({ milestone, expanded, onToggle }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-500" size={24} />;
      case 'active': return <Clock className="text-yellow-500" size={24} />;
      default: return <Circle className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggle}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`${milestone.color} p-3 rounded-full text-white text-xl`}>
            {milestone.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{milestone.title}</h3>
            <p className="text-gray-600">{milestone.timeframe}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusIcon(milestone.status)}
          {expanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
        </div>
      </div>
      <p className="text-gray-700 mt-3 ml-16">{milestone.description}</p>
    </div>
  );
};
