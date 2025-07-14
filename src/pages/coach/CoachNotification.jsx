import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import api from "../../api";
import dayjs from "dayjs";

const { Option } = Select;

const CoachNotification = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications/my-students-progress");
      setData(res.data || []);
    } catch (err) {
      message.error("Lỗi khi lấy dữ liệu học viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendNotification = async (record) => {
    setSelectedProgress(record);
    form.setFieldsValue({
      type: record.progress ? "motivation" : "reminder", // Tự động chọn loại
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        message: values.message,
        type: values.type,
      };

      if (selectedProgress.progress?._id) {
        payload.progress_id = selectedProgress.progress._id;
      } else {
        payload.user_id = selectedProgress.user._id;
      }

      await api.post("/notifications", payload);
      message.success("Gửi thông báo thành công");
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.log(err);
      message.error("Lỗi khi gửi thông báo");
    }
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Avatar",
      dataIndex: ["user", "avatar_url"],
      key: "avatar",
      render: (avatar) => (
        <Avatar src={avatar} icon={!avatar && <UserOutlined />} />
      ),
    },
    {
      title: "Tên kế hoạch",
      dataIndex: ["quit_plan", "name"],
      key: "plan_name",
    },
    {
      title: "Stage",
      dataIndex: ["stage", "title"],
      key: "stage",
    },
    {
      title: "Ngày tiến trình",
      dataIndex: ["progress", "date"],
      key: "progress_date",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "Chưa có"),
    },
    {
      title: "Số điếu",
      dataIndex: ["progress", "cigarettes_smoked"],
      key: "cigs",
      render: (val) => (val !== undefined ? val : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type='primary' onClick={() => handleSendNotification(record)}>
          {record.progress ? "Gửi động viên" : "Nhắc nhở"}
        </Button>
      ),
    },
    {
      title: "Thông báo đã gửi",
      key: "notifications",
      render: (_, record) => {
        const notifications = record.notifications || [];

        if (notifications.length === 0) return "Chưa có";

        return notifications.map((noti) => (
          <div key={noti._id} className='mb-2'>
            <span className='font-semibold'>
              {noti.type === "reminder" ? "🕑 Nhắc" : "💪 Động viên"}:
            </span>{" "}
            <span>{noti.message}</span> <br />
            <span className='text-xs text-gray-400'>
              {dayjs(noti.schedule).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        ));
      },
    },
  ];

  return (
    <section className='p-10 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white'>
      <h2 className='text-2xl text-center mb-6'>Gửi Thông Báo Cho Học Viên</h2>
      <div className='bg-white rounded-xl shadow-lg p-6'>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => `${record.user._id}-${record.stage._id}`}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>

      <Modal
        title='Gửi Thông Báo'
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText='Gửi'
        cancelText='Huỷ'>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='message'
            label='Nội dung'
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
            <Input.TextArea rows={4} placeholder='Nhập nội dung...' />
          </Form.Item>

          <Form.Item
            name='type'
            label='Loại thông báo'
            rules={[{ required: true, message: "Chọn loại thông báo" }]}>
            <Select placeholder='Chọn loại'>
              <Option value='reminder'>Nhắc nhở</Option>
              <Option value='motivation'>Động viên</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default CoachNotification;
