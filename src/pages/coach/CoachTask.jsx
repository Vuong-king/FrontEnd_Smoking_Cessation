import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  List,
  Popconfirm,
  Typography,
} from "antd";
import api from "../../api";

const { Title } = Typography;

const CoachTask = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form] = Form.useForm();

  const fetchStages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/stages"); // Admin get all
      setStages(res.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách stage");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (stageId) => {
    try {
      const res = await api.get(`/tasks/stage/${stageId}`);
      setTasks(res.data);
    } catch (error) {
      message.error("Lỗi khi lấy tasks");
    }
  };

  const handleOpenModal = (stage) => {
    setSelectedStage(stage);
    form.resetFields();
    fetchTasks(stage._id);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await api.post("/tasks", {
        ...values,
        stage_id: selectedStage._id,
      });
      message.success("Thêm nhiệm vụ thành công");
      form.resetFields();
      fetchTasks(selectedStage._id);
    } catch (error) {
      message.error("Lỗi khi thêm nhiệm vụ");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      message.success("Đã xoá nhiệm vụ");
      fetchTasks(selectedStage._id);
    } catch (error) {
      message.error("Lỗi xoá nhiệm vụ");
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const columns = [
    {
      title: "Tiêu đề giai đoạn",
      dataIndex: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button type='link' onClick={() => handleOpenModal(record)}>
          Thêm nhiệm vụ
        </Button>
      ),
    },
  ];

  return (
    <section className='p-10 bg-white min-h-screen text-black'>
      <Title level={2} style={{ textAlign: "center" }}>
        Quản lý nhiệm vụ trong các Giai đoạn
      </Title>

      <div className='bg-white rounded-xl shadow p-6 mt-4 max-w-6xl mx-auto'>
        <Table
          rowKey='_id'
          dataSource={stages}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal Thêm nhiệm vụ */}
      <Modal
        open={openModal}
        title={`Thêm nhiệm vụ cho: ${selectedStage?.title}`}
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit}
        okText='Tạo'
        cancelText='Huỷ'>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='title'
            label='Tên nhiệm vụ'
            rules={[{ required: true, message: "Nhập tiêu đề nhiệm vụ" }]}>
            <Input />
          </Form.Item>
          <Form.Item name='description' label='Mô tả nhiệm vụ'>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>

        <div className='mt-6'>
          <h4 className='font-medium mb-2'>Danh sách nhiệm vụ</h4>
          <List
            bordered
            dataSource={tasks}
            locale={{ emptyText: "Chưa có nhiệm vụ nào" }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Popconfirm
                    title='Xoá nhiệm vụ này?'
                    onConfirm={() => handleDeleteTask(item._id)}
                    okText='Xoá'
                    cancelText='Huỷ'>
                    <Button danger size='small'>
                      Xoá
                    </Button>
                  </Popconfirm>,
                ]}>
                <div>
                  <div className='font-medium'>{item.title}</div>
                  <div className='text-sm text-gray-600'>
                    {item.description}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </section>
  );
};

export default CoachTask;
