import { Avatar, Typography, Tag } from "antd";
const { Title, Text } = Typography;

const CoachInfo = ({ coach }) => (
  <div className="flex items-center space-x-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
    {coach ? (
      <>
        <Avatar size={80} src={coach.avatar_url} className="border-4 border-white shadow-lg" />
        <div>
          <Title level={4} className="mb-2">
            {coach.name || "Ẩn danh"}
          </Title>
          <Tag color="blue">{coach.specialization || "Chuyên gia cai thuốc"}</Tag>
        </div>
      </>
    ) : (
      <Text>Chưa có huấn luyện viên</Text>
    )}
  </div>
);

export default CoachInfo;
