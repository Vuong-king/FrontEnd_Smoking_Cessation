import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Empty,
  Spin,
  Typography,
  Popconfirm,
  Button,
  Alert,
} from "antd";
import { UserCheck, Clock } from "lucide-react";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { useQuitPlanData } from "../../../hook/useQuitPlanData";

const { Title } = Typography;

const statusColorMap = {
  pending: "orange",
  approved: "green",
  rejected: "red",
  draft: "default",
};

const statusLabelMap = {
  pending: "Đang chờ",
  approved: "Đã duyệt",
  rejected: "Bị từ chối",
  draft: "Bản nháp",
};

const RequestHistory = () => {
  const { getMyQuitPlanRequests, deleteQuitPlanRequest } = useQuitPlanData();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ visible: false, type: "success", message: "" });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const result = await getMyQuitPlanRequests();
      setRequests(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Lỗi khi lấy yêu cầu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuitPlanRequest(id); 
      setRequests((prev) => prev.filter((item) => item._id !== id));
      setAlert({ visible: true, type: "success", message: "Đã xoá yêu cầu thành công" });
    } catch {
      setAlert({ visible: true, type: "error", message: "Xoá thất bại" });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, visible: false }));
      }, 5000); // 10 giây
      return () => clearTimeout(timer);
    }
  }, [alert.visible]);

  const columns = [
    {
      title: "Tên kế hoạch",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-gray-800">
          {text || "Không có tiêu đề"}
        </span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (text) => (
        <span className="text-gray-600">{text || "Không có"}</span>
      ),
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? (
          <span className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock size={14} /> {moment(date).format("DD/MM/YYYY HH:mm")}
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: "Huấn luyện viên",
      dataIndex: ["coach_id", "name"],
      key: "coach",
      render: (_, record) =>
        record.coach_id?.name ? (
          <span className="flex items-center gap-1 text-green-700">
            <UserCheck size={14} />
            {record.coach_id.name}
          </span>
        ) : (
          <span className="text-gray-400">Chưa phân công</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={statusColorMap[status] || "default"}
          className="rounded-full px-3 py-1 text-sm"
        >
          {statusLabelMap[status] || status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xoá yêu cầu này?"
          onConfirm={() => handleDelete(record._id)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            className="hover:text-red-600"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        <Title level={2} className="mb-6 text-center text-gray-800">
          Lịch sử yêu cầu huấn luyện viên
        </Title>
        {alert.visible && (
          <Alert
            message={alert.message}
            type={alert.type}
            showIcon
            closable
            onClose={() => setAlert({ ...alert, visible: false })}
            style={{ marginBottom: 16 }}
          />
        )}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : requests.length === 0 ? (
          <Empty description="Chưa có yêu cầu nào" />
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <Table
              dataSource={requests}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              className="ant-table-striped"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHistory;
