import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  Typography,
} from "antd";
import api from "../../api";
import dayjs from "dayjs";

const { Title } = Typography;

const RequestQuitPlan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/quitplan/requests");
      setData(res.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/quitplan/${id}/approve`);
      message.success("Đã duyệt kế hoạch");
      fetchRequests();
    } catch {
      message.error("Lỗi khi duyệt kế hoạch");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/quitplan/${id}/reject`);
      message.success("Đã từ chối kế hoạch");
      fetchRequests();
    } catch {
      message.error("Lỗi khi từ chối kế hoạch");
    }
  };

  const showCreateModal = (record) => {
    setSelectedRequest(record);
    form.setFieldsValue({
      name: record.name,
      reason: record.reason,
      start_date: dayjs(record.start_date),
      target_quit_date: dayjs(record.target_quit_date),
    });
    setOpenModal(true);
  };

  const handleCreatePlan = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        user_id: selectedRequest.user_id._id,
        name: values.name,
        reason: values.reason,
        start_date: values.start_date,
        target_quit_date: values.target_quit_date,
        request_id: selectedRequest._id,
      };
      await api.post("/quitplan", payload);
      message.success("Tạo kế hoạch thành công!");
      setOpenModal(false);
      const updated = data.map((item) =>
        item._id === selectedRequest._id ? { ...item, status: "created" } : item
      );
      setData(updated);
    } catch (error) {
      if (error.response?.status === 409) {
        message.warning("Người dùng đã có kế hoạch trong thời gian này.");
      } else {
        message.error("Lỗi khi tạo kế hoạch");
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = [
    {
      title: "Người dùng",
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Avatar src={record.user_id.avatar_url} />
          <div>
            <div>{record.user_id.name}</div>
            <div className='text-gray-400 text-xs'>{record.user_id.email}</div>
          </div>
        </div>
      ),
    },
    { title: "Tên kế hoạch", dataIndex: "name" },
    { title: "Lý do", dataIndex: "reason" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày bỏ thuốc",
      dataIndex: "target_quit_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const color =
          status === "approved"
            ? "green"
            : status === "rejected"
            ? "red"
            : status === "created"
            ? "blue"
            : "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (_, record) => {
        if (record.status === "pending") {
          return (
            <div className='flex gap-2'>
              <Button
                type='primary'
                size='small'
                onClick={() => handleApprove(record._id)}>
                Duyệt
              </Button>
              <Popconfirm
                title='Bạn có chắc muốn từ chối yêu cầu này?'
                onConfirm={() => handleReject(record._id)}
                okText='Từ chối'
                cancelText='Hủy'>
                <Button danger size='small'>
                  Từ chối
                </Button>
              </Popconfirm>
            </div>
          );
        }

        if (record.status === "approved") {
          return (
            <Button
              type='primary'
              size='small'
              onClick={() => showCreateModal(record)}>
              Tạo kế hoạch
            </Button>
          );
        }

        return <span>-</span>;
      },
    },
  ];

  return (
    <section className='p-10 bg-white min-h-screen text-black'>
      <Title level={2} style={{ textAlign: "center" }}>
        Danh sách yêu cầu kế hoạch
      </Title>
      <div className='bg-white rounded-xl shadow p-6 mt-4'>
        <Table
          rowKey='_id'
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 6 }}
        />
      </div>

      <Modal
        title='Tạo kế hoạch từ yêu cầu'
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleCreatePlan}
        okText='Tạo kế hoạch'
        cancelText='Hủy'>
        <Form layout='vertical' form={form}>
          <Form.Item
            label='Tên kế hoạch'
            name='name'
            rules={[{ required: true, message: "Vui lòng nhập tên kế hoạch" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Lý do'
            name='reason'
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label='Ngày bắt đầu'
            name='start_date'
            rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
            <DatePicker format='DD/MM/YYYY' className='w-full' />
          </Form.Item>

          <Form.Item
            label='Ngày bỏ thuốc'
            name='target_quit_date'
            rules={[{ required: true, message: "Chọn ngày bỏ thuốc" }]}>
            <DatePicker format='DD/MM/YYYY' className='w-full' />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default RequestQuitPlan;
