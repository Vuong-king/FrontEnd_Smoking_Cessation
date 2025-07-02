import { useState } from "react";
import { useCoachData } from "../../../hook/useCoachData";
import {
  Card,
  Avatar,
  Skeleton,
  Row,
  Col,
  Typography,
  Alert,
  Rate,
  Tag,
  Divider,
  Button,
  message,
} from "antd";
import {
  StarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  MessageOutlined,
  UserOutlined,
  CheckOutlined,
  FileTextOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import QuitPlanModal from "./QuitPlanModal";
import { useQuitPlanData } from "../../../hook/useQuitPlanData";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FileText, Target } from "lucide-react";

const { Title, Paragraph, Text } = Typography;

const LoadingSkeleton = () => (
  <div className="py-10 px-6 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <Skeleton.Input
        active
        size="large"
        className="w-80 h-10 block mx-auto mb-10"
      />
      <Row gutter={[24, 24]}>
        {[...Array(6)].map((_, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Card loading={true} className="rounded-xl border-gray-200" />
          </Col>
        ))}
      </Row>
    </div>
  </div>
);

const CoachCard = ({ coach, onSelectCoach }) => {
  const name = coach.coach_id?.name || "Ẩn danh";
  const avatar = coach.coach_id?.avatar_url || "";

  return (
    <Card
      hoverable
      className="rounded-xl border-gray-100 shadow-md bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      bodyStyle={{ padding: "24px" }}
    >
      <div className="flex items-center mb-5 pb-4 border-b border-gray-100">
        <Avatar
          size={72}
          src={avatar}
          icon={<UserOutlined />}
          className="mr-4 border-2 border-gray-100 shadow"
        />
        <div className="flex-1">
          <Title level={4} className="m-0 mb-1 text-gray-800 text-lg font-semibold">
            {name}
          </Title>
          <Tag color="blue" className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600">
            {coach.specialization}
          </Tag>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <ClockCircleOutlined className="text-green-500 mr-2" />
          <Text className="text-gray-600 text-sm">Kinh nghiệm: <Text strong>{coach.experience_years} năm</Text></Text>
        </div>
        <div className="flex items-center mb-2">
          <TeamOutlined className="text-blue-500 mr-2" />
          <Text className="text-gray-600 text-sm">Buổi hỗ trợ: <Text strong>{coach.total_sessions}</Text></Text>
        </div>
        <div className="flex items-center">
          <StarOutlined className="text-yellow-500 mr-2" />
          <Rate disabled defaultValue={coach.rating_avg} allowHalf />
          <Text className="ml-2 text-sm text-gray-700">({coach.rating_avg})</Text>
        </div>
      </div>

      <Divider />

      <div className="mb-4">
        <Text strong>Giới thiệu:</Text>
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }} className="text-gray-600 text-sm">
          {coach.bio}
        </Paragraph>
      </div>

      <Button
        type="primary"
        size="large"
        icon={<CheckOutlined />}
        block
        onClick={() => onSelectCoach(coach)}
        className="rounded-lg mt-4"
      >
        Chọn cho tôi
      </Button>
    </Card>
  );
};

const CoachCardList = () => {
  const { coaches, loading, error } = useCoachData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const { sendQuitPlanRequest } = useQuitPlanData();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const coachId = selectedCoach?.coach_id?._id || selectedCoach?.coach_id || selectedCoach?._id;
      if (!coachId) return message.error("Không xác định được coach!");
      await sendQuitPlanRequest({ coach_id: coachId, ...formData });
      message.success("Gửi yêu cầu cho coach thành công!");
      setIsModalVisible(false);
    } catch (err) {
      message.error("Thất bại: " + (err?.message || ""));
    }
  };

  const handleSelectCoach = (coach) => {
    setSelectedCoach(coach);
    setIsModalVisible(true);
  };

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="py-10 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
          <Alert
            type="error"
            message="Không thể tải danh sách huấn luyện viên"
            description="Vui lòng thử lại sau hoặc liên hệ với quản trị viên."
            showIcon
            className="rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
     <div className="py-10 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-sm">

        <div className="mb-8 text-center">
          <Title level={2} className="text-gray-800">Đội Ngũ Huấn Luyện Viên</Title>
          <Text type="secondary">Các chuyên gia sẽ đồng hành cùng bạn</Text>
        </div>


        <div className="flex gap-6 items-start">

          <div className="flex flex-col gap-3 w-[260px]">

            <button
              onClick={() => navigate("/user/my-requests")}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-blue-50 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <FileText size={20} />
                </div>
                <span className="text-gray-800 font-medium text-sm">Xem lịch sử yêu cầu</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/my-plans")}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-green-50 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <Target size={20} />
                </div>
                <span className="text-gray-800 font-medium text-sm">Kế hoạch của tôi</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="flex-1">
            <Row gutter={[24, 24]}>
              {coaches.map((coach, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <CoachCard coach={coach} onSelectCoach={handleSelectCoach} />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        <QuitPlanModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleSubmit}
          coach={selectedCoach}
        />
      </div>
    </div>
  );
};

export default CoachCardList;
