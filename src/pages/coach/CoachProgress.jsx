import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  message,
  Select,
  DatePicker,
  Space,
  Typography,
} from "antd";
import api from "../../api";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const CoachProgress = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    user: null,
    dateRange: null,
  });

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get("/progress");
      const progressData = res.data;

      const uniqueUsers = Array.from(
        new Map(
          progressData.map((item) => [item.user_id._id, item.user_id])
        ).values()
      );

      setUsers(uniqueUsers);
      setAllData(progressData);
      setData(progressData);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu tiến trình");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    let filtered = [...allData];

    if (filters.user) {
      filtered = filtered.filter((item) => item.user_id?._id === filters.user);
    }

    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter((item) => {
        const date = dayjs(item.date);
        return (
          date.isAfter(start.subtract(1, "day")) &&
          date.isBefore(end.add(1, "day"))
        );
      });
    }

    setData(filtered);
  }, [filters, allData]);

  const columns = [
    {
      title: "Học viên",
      dataIndex: "user_id",
      key: "user_id",
      render: (user) => (
        <div className='flex items-center gap-2'>
          <Avatar src={user?.avatar_url} />
          <div>
            <div>{user?.name || "Không rõ"}</div>
            <div className='text-gray-400 text-xs'>{user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày ghi nhận",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thuốc đã hút",
      dataIndex: "cigarettes_smoked",
      key: "cigarettes_smoked",
      render: (value) => `${value ?? 0} điếu`,
    },
    {
      title: "Tình trạng sức khỏe",
      dataIndex: "health_status",
      key: "health_status",
      render: (text) => <Tag color='blue'>{text || "Không có"}</Tag>,
    },
    {
      title: "Tiền tiết kiệm",
      dataIndex: "money_saved",
      key: "money_saved",
      render: (amount) => `${(amount ?? 0).toLocaleString()} đ`,
    },
    {
      title: "Giai đoạn",
      dataIndex: "stage_id",
      key: "stage_id",
      render: (stage) => stage?.name || "Không rõ",
    },
    {
      title: "Kế hoạch",
      key: "plan_name",
      render: (_, record) => record?.stage_id?.plan_id?.name || "Không rõ",
    },
  ];

  return (
    <section className='p-10 bg-white min-h-screen text-black'>
      <Title level={2} style={{ textAlign: "center" }}>
        Tiến trình của học viên
      </Title>

      <div className='mt-6 bg-white rounded-xl shadow p-6 max-w-7xl mx-auto'>
        {/* 🎯 Bộ lọc */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            allowClear
            style={{ width: 220 }}
            placeholder='Chọn học viên'
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, user: value }))
            }>
            {users.map((user) => (
              <Select.Option key={user._id} value={user._id}>
                {user.name}
              </Select.Option>
            ))}
          </Select>

          <RangePicker
            format='DD/MM/YYYY'
            onChange={(range) =>
              setFilters((prev) => ({ ...prev, dateRange: range }))
            }
          />
        </Space>

        <Table
          rowKey='_id'
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 6 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </section>
  );
};

export default CoachProgress;
