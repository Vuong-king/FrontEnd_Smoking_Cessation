import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  List,
  message,
  Popconfirm,
  Typography,
} from "antd";
import api from "../../api";
import dayjs from "dayjs";

const { Title } = Typography;

const StagesCoach = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formStage] = Form.useForm();
  const [formTask] = Form.useForm();

  const [openStageModal, setOpenStageModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [openStagesViewModal, setOpenStagesViewModal] = useState(false);
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  const [selectedStage, setSelectedStage] = useState(null);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchSmokingStatus = async (userId) => {
    if (!userId) {
      return "Không có dữ liệu (ID không hợp lệ)";
    }

    let idToFetch;
    if (typeof userId === "object" && userId !== null && userId._id) {
      idToFetch = userId._id.toString();
    } else if (
      typeof userId === "object" &&
      userId !== null &&
      userId.toString
    ) {
      idToFetch = userId.toString();
    } else if (typeof userId === "string") {
      idToFetch = userId;
    } else {
      return "Không có dữ liệu (ID không đúng định dạng)";
    }

    try {
      const res = await api.get(`/smoking-status/student/${idToFetch}`);

      if (res.data && res.data.cigarettes_per_day !== undefined) {
        return res.data.cigarettes_per_day;
      }

      return "Không có dữ liệu";
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403) {
          return "Không có quyền xem";
        }
        if (err.response.status === 404) {
          return "Không có dữ liệu (chưa thiết lập)";
        }
      }
      return "Không có dữ liệu (lỗi)";
    }
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get("/quitPlan/coach/my-plans");

      const enrichedPlans = await Promise.all(
        res.data.map(async (plan) => {
          const smokingStatus = await fetchSmokingStatus(plan.user_id);
          return { ...plan, smokingStatus };
        })
      );

      setPlans(enrichedPlans);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách kế hoạch");
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async (plan) => {
    try {
      const res = await api.get(`/stages/plan/${plan._id}`);
      setSelectedStages(res.data);
      setSelectedPlanName(plan.name);
      setOpenStagesViewModal(true);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách giai đoạn");
    }
  };

  const fetchTasks = async (stageId) => {
    if (!stageId) {
      message.error("Không thể lấy nhiệm vụ: ID giai đoạn không hợp lệ.");
      setTasks([]);
      return;
    }

    try {
      const res = await api.get(`/tasks/stage/${stageId}`);
      setTasks(res.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách nhiệm vụ");
      setTasks([]);
    }
  };

  const handleCreateStage = async () => {
    try {
      const values = await formStage.validateFields();
      const payload = {
        ...values,
        plan_id: selectedPlan._id,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        cigarette_limit: Number(values.cigarette_limit),
      };
      await api.post("/stages", payload);
      message.success("Tạo giai đoạn thành công");
      setOpenStageModal(false);
      formStage.resetFields();
      fetchPlans();
    } catch (error) {
      message.error(
        `Lỗi khi tạo giai đoạn: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleCreateTask = async () => {
    try {
      const values = await formTask.validateFields();
      if (!selectedStage || !selectedStage._id) {
        message.error("Vui lòng chọn một giai đoạn để thêm nhiệm vụ.");
        return;
      }

      await api.post("/tasks", {
        ...values,
        stage_id: selectedStage._id,
      });
      message.success("Thêm nhiệm vụ thành công");
      formTask.resetFields();
      fetchTasks(selectedStage._id);
    } catch (error) {
      message.error(
        `Lỗi khi thêm nhiệm vụ: ${
          error.response?.data?.message || error.message
        }`
      );
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

  const columns = [
    {
      title: "Tên kế hoạch",
      dataIndex: "name",
    },
    {
      title: "Người dùng",
      render: (_, record) => record.user_id?.name || "Không rõ",
    },
    {
      title: "Số điếu/ngày",
      dataIndex: "smokingStatus",
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
          <Button
            type='link'
            onClick={() => {
              setSelectedPlan(record);
              setOpenStageModal(true);
              formStage.resetFields();
            }}>
            Thêm Giai đoạn
          </Button>
          <Button type='link' onClick={() => fetchStages(record)}>
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
      title: "Giới hạn thuốc",
      dataIndex: "cigarette_limit",
    },
    {
      title: "Kết thúc",
      dataIndex: "end_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button
          type='link'
          onClick={() => {
            setSelectedStage(record);
            setOpenTaskModal(true);
            fetchTasks(record._id);
            formTask.resetFields();
          }}>
          Thêm nhiệm vụ
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <section className='p-10 bg-white min-h-screen text-black'>
      <Title level={2} style={{ textAlign: "center" }}>
        Quản lý Kế hoạch - Giai đoạn - Nhiệm vụ
      </Title>

      <div className='max-w-6xl mx-auto shadow p-6 bg-white rounded-xl'>
        <Table
          rowKey='_id'
          dataSource={plans}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal Tạo Giai đoạn */}
      <Modal
        open={openStageModal}
        title={`Thêm Giai đoạn cho: ${selectedPlan?.name}`}
        onCancel={() => setOpenStageModal(false)}
        onOk={handleCreateStage}
        okText='Tạo'
        cancelText='Huỷ'>
        <Form form={formStage} layout='vertical'>
          <Form.Item name='title' label='Tiêu đề' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label='Mô tả'
            rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name='cigarette_limit'
            label='Giới hạn số điếu mỗi ngày'
            rules={[
              { required: true, message: "Nhập giới hạn số điếu mỗi ngày" },
            ]}>
            <Input type='number' min={0} />
          </Form.Item>
          <Form.Item
            name='start_date'
            label='Ngày bắt đầu'
            rules={[{ required: true }]}>
            <DatePicker className='w-full' format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item
            name='end_date'
            label='Ngày kết thúc'
            rules={[{ required: true }]}>
            <DatePicker className='w-full' format='DD/MM/YYYY' />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xem Giai đoạn */}
      <Modal
        open={openStagesViewModal}
        title={`Giai đoạn của kế hoạch: ${selectedPlanName}`}
        onCancel={() => setOpenStagesViewModal(false)}
        footer={null}
        width={900}>
        <Table
          rowKey='_id'
          dataSource={selectedStages}
          columns={stageColumns}
          pagination={false}
        />
      </Modal>

      {/* Modal Thêm nhiệm vụ */}
      <Modal
        open={openTaskModal}
        title={`Thêm nhiệm vụ cho: ${selectedStage?.title}`}
        onCancel={() => setOpenTaskModal(false)}
        onOk={handleCreateTask}
        okText='Tạo'
        cancelText='Huỷ'>
        <Form form={formTask} layout='vertical'>
          <Form.Item
            name='title'
            label='Tên nhiệm vụ'
            rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='description' label='Mô tả'>
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

export default StagesCoach;
