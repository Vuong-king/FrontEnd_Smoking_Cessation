import React, { useEffect, useState } from "react";
import { Table, Avatar, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import api from "../../api";
import dayjs from "dayjs";

const { Title } = Typography;

const CoachQuitPlan = () => {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuitPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quitPlan/my-users");
      setQuitPlans(response.data || []);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách kế hoạch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuitPlans();
  }, []);

  const columns = [
    {
      title: "Học viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Avatar
          src={avatar}
          icon={!avatar && <UserOutlined />}
          style={{ backgroundColor: "#87d068" }}
        />
      ),
    },
    {
      title: "Tên kế hoạch",
      dataIndex: "plan_name",
      key: "plan_name",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày bỏ thuốc",
      dataIndex: "target_quit_date",
      key: "target_quit_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <section className='p-10 bg-white min-h-screen text-black'>
      <Title level={2} style={{ textAlign: "center" }}>
        Kế hoạch bạn đang hỗ trợ
      </Title>
      <div className='mt-6 bg-white rounded-xl shadow-lg p-6'>
        <Table
          columns={columns}
          dataSource={quitPlans}
          rowKey='_id'
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </section>
  );
};

export default CoachQuitPlan;
