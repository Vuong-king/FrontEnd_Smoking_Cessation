import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Typography,
} from "antd";
import api from "../../api";
import dayjs from "dayjs";

const { Title } = Typography;

const StagesCoach = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();

  const [viewStagesModal, setViewStagesModal] = useState(false);
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  const fetchQuitPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get("/quitPlan");
      setPlans(res.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách kế hoạch");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setOpenModal(true);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title,
        description: values.description,
        plan_id: selectedPlan._id,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        stage_number: 1, // Có thể tự động tăng nếu cần
      };

      await api.post("/stages", payload);
      message.success("Tạo giai đoạn thành công");
      setOpenModal(false);
    } catch (error) {
      message.error("Lỗi khi tạo giai đoạn");
    }
  };

  const handleViewStages = async (plan) => {
    try {
      const res = await api.get(`/stages/plan/${plan._id}`);
      setSelectedStages(res.data);
      setSelectedPlanName(plan.name);
      setViewStagesModal(true);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách giai đoạn");
    }
  };

  useEffect(() => {
    fetchQuitPlans();
  }, []);

  const columns = [
    {
      title: "Tên kế hoạch",
      dataIndex: "name",
    },
    {
      title: "Người dùng",
      dataIndex: ["user_id", "name"],
      render: (_, record) => record.user_id?.name || "Không rõ",
    },
    {
      title: "Thời gian",
      render: (record) =>
        `${dayjs(record.start_date).format("DD/MM/YYYY")} - ${dayjs(
          record.target_quit_date
        ).format("DD/MM/YYYY")}`,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <div className='flex gap-2'>
          <Button type='link' onClick={() => handleOpenModal(record)}>
            Thêm Giai đoạn
          </Button>
          <Button type='link' onClick={() => handleViewStages(record)}>
            Xem Giai đoạn
          </Button>
        </div>
      ),
    },
  ];

  const stageColumns = [
    {
      title: "Giai đoạn",
      dataIndex: "stage_number",
      width: 60,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Bắt đầu",
      dataIndex: "start_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Kết thúc",
      dataIndex: "end_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <section className='p-10 bg-white min-h-screen text-black'>
      <Title level={2} style={{ textAlign: "center" }}>
        Danh sách Kế hoạch
      </Title>

      <div className='bg-white rounded-xl shadow p-6 mt-4 max-w-6xl mx-auto'>
        <Table
          rowKey='_id'
          dataSource={plans}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal Thêm Giai đoạn */}
      <Modal
        open={openModal}
        title={`Thêm Giai đoạn cho: ${selectedPlan?.name}`}
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit}
        okText='Tạo'
        cancelText='Huỷ'>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='title'
            label='Tiêu đề'
            rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label='Mô tả'
            rules={[{ required: true, message: "Nhập mô tả" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name='start_date'
            label='Ngày bắt đầu'
            rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
            <DatePicker className='w-full' format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item
            name='end_date'
            label='Ngày kết thúc'
            rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
            <DatePicker className='w-full' format='DD/MM/YYYY' />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xem Giai đoạn */}
      <Modal
        open={viewStagesModal}
        title={`Giai đoạn của kế hoạch: ${selectedPlanName}`}
        onCancel={() => setViewStagesModal(false)}
        footer={null}
        width={800}>
        <Table
          rowKey='_id'
          dataSource={selectedStages}
          columns={stageColumns}
          pagination={false}
        />
      </Modal>
    </section>
  );
};

export default StagesCoach;
