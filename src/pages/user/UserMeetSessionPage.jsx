import { useState } from "react";
import { Row, Col, Spin, Button } from "antd";
import { useCoachData } from "../../hook/useCoachData";
import CoachCard from "../../components/user/meetSession/CoachCard";
import BookSessionModal from "../../components/user/meetSession/BookSessionModal";
import UserSessionModalAll from "../../components/user/meetSession/UserSessionModalAll";


const UserMeetSessionPage = () => {
  const { coaches, loading } = useCoachData();
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
          Yêu cầu tư vấn
        </h1>
        <Button onClick={() => setShowSessionModal(true)} type="primary">
          Xem lịch tư vấn
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {coaches && coaches.map((coach) => (
            <Col key={coach.id} xs={24} sm={12} md={8}>
              <CoachCard
                coach={coach}
                onSelectCoach={() => setSelectedCoach(coach)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal đặt lịch */}
      <BookSessionModal
        open={!!selectedCoach}
        coach={selectedCoach}
        onClose={() => setSelectedCoach(null)}
      />

      {/* Modal xem tất cả lịch tư vấn của học viên */}
      <UserSessionModalAll
        open={showSessionModal}
        onClose={() => setShowSessionModal(false)}
      />
    </div>
  );
};

export default UserMeetSessionPage;
