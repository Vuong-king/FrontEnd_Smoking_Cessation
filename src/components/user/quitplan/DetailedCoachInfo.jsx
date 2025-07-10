import { Avatar, Typography, Rate, Tag } from "antd";
const { Title, Text, Paragraph } = Typography;

const DetailedCoachInfo = ({ coach, plan }) => {
  if (!coach) {
    return (
      <div className="text-center p-8">
        <Text className="text-gray-500">Chưa có huấn luyện viên được phân công</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Avatar
          size={120}
          src={coach.avatar_url}
          className="border-4 border-blue-100 shadow-lg mb-4"
        />
        <Title level={4} className="mb-2 text-gray-800">{coach.name || "Ẩn danh"}</Title>
        <Tag color="blue" className="mb-4">
          {coach.specialization || "Chuyên gia cai thuốc"}
        </Tag>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <Text strong className="text-blue-800 block mb-2">📧 Thông tin liên hệ</Text>
        <Text className="text-blue-600 text-sm">{coach.email || "Chưa cập nhật email"}</Text>
        {coach.phone && <Text className="text-blue-600 text-sm block mt-1">📞 {coach.phone}</Text>}
      </div>

      {coach.rating && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <Text strong className="text-yellow-800 block mb-2">⭐ Đánh giá</Text>
          <div className="flex items-center gap-2">
            <Rate disabled defaultValue={coach.rating} className="text-sm" />
            <Text className="text-yellow-600 text-sm">({coach.rating}/5)</Text>
          </div>
        </div>
      )}

      {coach.experience && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <Text strong className="text-green-800 block mb-2">💼 Kinh nghiệm</Text>
          <Text className="text-green-600 text-sm">{coach.experience} năm kinh nghiệm</Text>
        </div>
      )}

      {coach.bio && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text strong className="text-gray-800 block mb-2">📝 Giới thiệu</Text>
          <Paragraph
            className="text-gray-600 text-sm mb-0"
            ellipsis={{ rows: 4, expandable: true, symbol: "Xem thêm" }}
          >
            {coach.bio}
          </Paragraph>
        </div>
      )}

      {plan && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <Text strong className="text-purple-800 block mb-3">📋 Thông tin kế hoạch</Text>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Text className="text-purple-600 text-sm">Tên kế hoạch:</Text>
              <Text className="text-purple-800 text-sm font-medium">{plan.name}</Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-purple-600 text-sm">Ngày bắt đầu:</Text>
              <Text className="text-purple-800 text-sm font-medium">
                {new Date(plan.start_date).toLocaleDateString("vi-VN")}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-purple-600 text-sm">Mục tiêu:</Text>
              <Text className="text-purple-800 text-sm font-medium">
                {new Date(plan.target_quit_date).toLocaleDateString("vi-VN")}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-purple-600 text-sm">Trạng thái:</Text>
              <Tag color={plan.status === "active" ? "green" : "blue"} size="small">
                {plan.status === "active" ? "Đang hoạt động" : "Đang thực hiện"}
              </Tag>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedCoachInfo;
