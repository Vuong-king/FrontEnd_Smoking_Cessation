import { Typography, Button,  message, Tag, Modal, Form, InputNumber, Input } from "antd";
import { ReloadOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ProgressService from '../../../services/progressService';
import SmokingStatusService from '../../../services/SmokingStatusService';

const { Title, Paragraph } = Typography;

const StageHeader = ({
  currentStage,
  stageTasks,
  progress,
  completedCount,
  loading,
  onRefresh,
  onMoveToNextStage,
  showProgressButton = true, // mặc định là hiện
}) => {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Kiểm tra xem đã hết ngày của giai đoạn hiện tại chưa
  const isStageEndDateReached = () => {
    if (!currentStage?.end_date) return false;
    const today = new Date();
    const endDate = new Date(currentStage.end_date);
    return today >= endDate;
  };

  // Kiểm tra xem có thể chuyển giai đoạn không
  const canMoveToNextStage = () => {
    return progress === 100 && isStageEndDateReached();
  };

  // Lấy thông báo lý do không thể chuyển giai đoạn
  const getCannotMoveReason = () => {
    if (progress < 100) {
      return `Bạn còn ${stageTasks.length - completedCount} nhiệm vụ chưa hoàn thành.`;
    }
    if (!isStageEndDateReached()) {
      const endDate = new Date(currentStage.end_date);
      return `Bạn chỉ có thể chuyển giai đoạn sau ngày ${endDate.toLocaleDateString('vi-VN')}.`;
    }
    return "Không thể chuyển giai đoạn.";
  };

  // Xử lý submit tiến trình
  const handleProgressSubmit = async (values) => {
    if (!currentStage?._id) return;
    setSubmitting(true);
    try {
      // Lấy user_id từ localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = currentUser?.id;
      
      if (!userId) {
        message.error('Không tìm thấy thông tin người dùng!');
        return;
      }

      // Lấy smoking status từ API trước
      let smokingStatus = null;
      try {
        const response = await SmokingStatusService.getStatus(userId);
        smokingStatus = response?.smokingStatus || response;
        console.log('Smoking status response:', response);
      } catch (error) {
        console.log('Không lấy được smoking status:', error);
      }

      // Tạo progress data với thông tin đầy đủ
      const progressData = {
        stage_id: currentStage._id,
        user_id: userId,
        date: new Date().toISOString().slice(0, 10),
        cigarettes_smoked: values.cigarettes,
        health_status: values.symptoms || '',
        // Thêm thông tin smoking status nếu có
        ...(smokingStatus && {
          cigarettes_per_day: smokingStatus.cigarettes_per_day,
          cost_per_pack: smokingStatus.cost_per_pack,
          // Bỏ cigarettes_per_pack vì không có trong backend schema
        })
      };

      console.log('Gửi dữ liệu progress:', progressData);
      
      await ProgressService.createProgress(progressData);
      message.success('Đã ghi nhận tiến trình!');
      setModalOpen(false);
      form.resetFields();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Lỗi khi ghi nhận tiến trình:', error);
      message.error('Đã xảy ra lỗi khi ghi nhận tiến trình. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-4">
        <Title
          level={3}
          className="text-gray-800"
          ellipsis={{ rows: 2, tooltip: currentStage.title }}
        >
          {currentStage.title}
        </Title>
        <div className="flex gap-2">
          {showProgressButton && (
            <Button icon={<EditOutlined />} onClick={() => setModalOpen(true)}>
              Nhập tiến trình
            </Button>
          )}
          <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon="🚀"
            onClick={
              canMoveToNextStage()
                ? onMoveToNextStage
                : () => {
                    message.warning(getCannotMoveReason(), 4);
                  }
            }
            disabled={!canMoveToNextStage()}
            loading={loading}
          >
            Chuyển giai đoạn tiếp theo
          </Button>
        </div>
      </div>
      {/* Modal nhập tiến trình */}
      <Modal
        title="Nhập tiến trình cho giai đoạn này"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={submitting}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProgressSubmit}
        >
          <Form.Item
            name="cigarettes"
            label="Số điếu thuốc đã hút hôm nay"
            rules={[{ required: true, message: 'Vui lòng nhập số điếu thuốc!' }]}
          >
            <InputNumber min={0} max={100} className="w-full" placeholder="Ví dụ: 5" />
          </Form.Item>
          <Form.Item name="symptoms" label="Triệu chứng/Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập cảm nhận, triệu chứng..." maxLength={300} showCount />
          </Form.Item>
        </Form>
      </Modal>
      {/* Thông tin giới hạn và số lần thử */}
      <div className="bg-blue-50 p-4 rounded-lg border mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-800">Giới hạn thuốc lá:</span>
            {currentStage.cigarette_limit ? (
              <Tag color="red" className="font-medium">{currentStage.cigarette_limit} điếu</Tag>
            ) : (
              <Tag color="orange">Không giới hạn</Tag>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-800">Lần thử thứ:</span>
            <Tag color="blue" className="font-medium">Lần {currentStage.attempt_number || 1}</Tag>
          </div>
          {currentStage.end_date && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">Ngày kết thúc:</span>
              <Tag color={isStageEndDateReached() ? "green" : "orange"} className="font-medium">
                {new Date(currentStage.end_date).toLocaleDateString('vi-VN')}
              </Tag>
            </div>
          )}
        </div>
      </div>
      
      {currentStage.description && (
        <div className="bg-gray-50 p-4 rounded-lg border mb-4">
          <Paragraph
            ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
          >
            {currentStage.description}
          </Paragraph>
        </div>
      )}
    </div>
  );
};

export default StageHeader;
