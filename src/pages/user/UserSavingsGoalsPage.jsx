import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
  Typography,
} from "antd";
import {
  DollarSign,
  Target,
  CalendarCheck,
  Trash2,
  Plus,
  PenLine,
} from "lucide-react";
import api from "../../api";

const { Paragraph } = Typography;
const iconColor = "#d9d9d9";

export default function UserSavingsGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progressMap, setProgressMap] = useState({});

  const [visible, setVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [form] = Form.useForm();

  const fetchProgressForGoals = async (goals) => {
    const map = {};
    for (const goal of goals) {
      try {
        const res = await api.get(`/financial-goals/progress/${goal._id}`);
        map[goal._id] = res.data;
      } catch (err) {
        console.error(`Lỗi khi lấy progress goal ${goal._id}:`, err);
      }
    }
    setProgressMap(map);
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/financial-goals/me");
      setGoals(res.data);
      fetchProgressForGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/financial-goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
    }
  };

  const openModal = (goal = null) => {
    setEditingGoal(goal);
    setVisible(true);
    if (goal) {
      form.setFieldsValue(goal);
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingGoal) {
        await api.put(`/financial-goals/${editingGoal._id}`, values);
      } else {
        await api.post("/financial-goals", values);
      }
      closeModal();
      fetchGoals();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    }
  };

  const columns = [
    {
      title: (
        <Space>
          <Target size={14} />
          Tên mục tiêu
        </Space>
      ),
      dataIndex: "title",
    },
    {
      title: (
        <Space>
          <DollarSign size={14} />
          Số tiền mục tiêu
        </Space>
      ),
      dataIndex: "target_amount",
      align: "right",
      render: (amount) => `${amount.toLocaleString("vi-VN")} VND`,
    },
    {
      title: (
        <Space>
          <DollarSign size={14} />
          Đã tiết kiệm
        </Space>
      ),
      align: "right",
      render: (_, record) => {
        const progress = progressMap[record._id];
        if (!progress) return "...";
        return `${progress.money_saved.toLocaleString("vi-VN")} VND (${
          progress.percentage
        }%)`;
      },
    },

    {
      title: (
        <Space>
          <CalendarCheck size={14} />
          Trạng thái
        </Space>
      ),
      dataIndex: "status",
      align: "center",
      render: (status) =>
        status === "completed"
          ? "Hoàn thành"
          : status === "paused"
          ? "Tạm dừng"
          : "Đang hoạt động",
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            size='small'
            icon={<PenLine size={14} />}
            onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xoá mục tiêu này?'
            onConfirm={() => handleDelete(record._id)}
            okText='Có'
            cancelText='Không'>
            <Button danger size='small' icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <>
      <Card
        title={
          <Space>
            <DollarSign size={20} style={{ color: "#1890ff" }} />
            Danh sách mục tiêu tài chính
          </Space>
        }
        extra={
          <Button
            type='primary'
            icon={<Plus size={14} />}
            onClick={() => openModal()}>
            Thêm mục tiêu
          </Button>
        }
        hoverable>
        <Table
          columns={columns}
          dataSource={goals}
          rowKey='_id'
          bordered
          loading={loading}
          scroll={{ x: 800 }}
          size='middle'
          locale={{
            emptyText: (
              <div style={{ padding: 40, textAlign: "center" }}>
                <Target
                  size={48}
                  style={{ color: iconColor, marginBottom: 16 }}
                />
                <div style={{ color: "#666" }}>
                  Chưa có mục tiêu nào. Hãy thêm mục tiêu đầu tiên!
                </div>
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        open={visible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        title={
          <Space>
            <Target size={20} style={{ color: "#1890ff" }} />
            {editingGoal ? "Cập nhật mục tiêu" : "Thêm mục tiêu mới"}
          </Space>
        }
        okText={editingGoal ? "Cập nhật" : "Thêm mới"}
        cancelText='Huỷ'
        width={500}>
        <Paragraph style={{ color: "#666", marginBottom: 24 }}>
          Vui lòng điền thông tin mục tiêu tài chính của bạn
        </Paragraph>

        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          requiredMark={false}>
          <Form.Item
            label='Tên mục tiêu'
            name='title'
            rules={[{ required: true, message: "Vui lòng nhập tên mục tiêu" }]}>
            <Input placeholder='VD: Mua xe, Du lịch...' size='large' />
          </Form.Item>

          <Form.Item
            label='Số tiền mục tiêu (VND)'
            name='target_amount'
            rules={[
              { required: true, message: "Vui lòng nhập số tiền mục tiêu" },
            ]}>
            <InputNumber
              placeholder='VD: 5000000'
              size='large'
              min={1000}
              step={1000}
              max={1000000000}
              style={{ width: "100%" }}
              prefix={<DollarSign size={14} style={{ color: iconColor }} />}
            />
          </Form.Item>

          <Form.Item name='status' hidden initialValue='active'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
