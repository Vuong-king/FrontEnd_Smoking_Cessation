import { Heart } from 'lucide-react';

export const MotivationBox = () => (
  <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 shadow-lg text-white">
    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
      <Heart className="text-red-300" size={24} />
      Động lực của bạn
    </h3>
    <p className="text-white opacity-90">
      Mỗi ngày không hút thuốc là một chiến thắng! Bạn đang làm điều tuyệt vời nhất cho sức khỏe của mình và những người thân yêu.
    </p>
  </div>
);
