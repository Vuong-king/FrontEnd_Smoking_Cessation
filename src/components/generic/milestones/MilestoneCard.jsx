import { MilestoneHeader } from './MilestoneHeader';
import { MilestoneTasks } from './MilestoneTasks';

export const MilestoneCard = ({ milestone, expanded, onToggleMilestone, onToggleTask }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MilestoneHeader
        milestone={milestone}
        expanded={expanded}
        onToggle={() => onToggleMilestone(milestone.id)}
      />
      {expanded && (
        <MilestoneTasks milestone={milestone} onToggleTask={onToggleTask} />
      )}
    </div>
  );
};
