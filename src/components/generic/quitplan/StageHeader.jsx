import { Typography, Button,  message, Tag, Modal, Form, InputNumber, Input } from "antd";
import { ReloadOutlined, EditOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import ProgressService from '../../../services/progressService';
import SmokingStatusService from '../../../services/SmokingStatusService';

const { Title, Paragraph } = Typography;

// Custom Toast Component
const CustomToast = ({ message, description, type, onClose }) => {
  return (
    <div 
      className={`fixed top-6 right-6 z-[9999] max-w-sm bg-white rounded-lg shadow-2xl border-l-4 ${
        type === 'success' ? 'border-green-500' : 'border-red-500'
      } transform transition-all duration-300 ease-out`}
      style={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
            type === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {type === 'success' ? (
              <CheckCircleFilled className="text-green-600 text-sm" />
            ) : (
              <span className="text-red-600 text-sm">✕</span>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
            {description && (
              <p className="mt-1 text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [toast, setToast] = useState(null);

  // Hiển thị custom toast
  const showToast = (message, description, type = 'success') => {
    setToast({ message, description, type });
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

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
        showToast('❌ Lỗi', 'Không tìm thấy thông tin người dùng!', 'error');
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
      
      // Hiển thị custom toast notification
      showToast(
        '✅ Tiến trình đã được nhập trong ngày hôm nay',
        `Bạn đã ghi nhận ${values.cigarettes} điếu thuốc hôm nay. Hãy tiếp tục duy trì động lực và kiên trì với mục tiêu cai thuốc!`,
        'success'
      );
      
      setModalOpen(false);
      form.resetFields();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Lỗi khi ghi nhận tiến trình:', error);
      
      // Hiển thị thông báo lỗi
      showToast(
        '❌ Lỗi khi cập nhật tiến trình',
        'Tiến trình hôm nay đã được nhập Vui lòng thử lại sau.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Custom Toast */}
      {toast && (
        <CustomToast
          message={toast.message}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
    </>
  );
};

export default StageHeader;
