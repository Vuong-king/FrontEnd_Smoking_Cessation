import React from "react";
import { Table, Button, Modal, Select, message } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import useCoachRequests from "../../hook/useCoachRequests";

const { Option } = Select;

const Request = () => {
  const {
    requests,
    users,
    loading,
    error,
    isNew,
    setIsNew,
    formData,
    setFormData,
    errors,
    handleNew,
    handleSave,
    handleDelete,
  } = useCoachRequests();

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [requestToDelete, setRequestToDelete] = React.useState(null);

  // Table columns
  const columns = [
    {
      title: "Người dùng",
      dataIndex: ["user_id", "name"],
      key: "user",
      render: (_, record) => record.user_id?.name || "-",
    },
    {
      title: "Email",
      dataIndex: ["user_id", "email"],
      key: "email",
      render: (_, record) => record.user_id?.email || "-",
    },
    {
      title: "Người gửi",
      dataIndex: ["sent_by", "name"],
      key: "sent_by",
      render: (_, record) => record.sent_by?.name || "-",
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "pending") color = "gold";
        else if (status === "accepted") color = "green";
        else if (status === "rejected") color = "red";
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        record.status === "pending" ? (
          <Button
            danger
            onClick={e => {
              e.stopPropagation();
              setRequestToDelete(record._id);
              setShowConfirm(true);
            }}
          >
            Từ chối
          </Button>
        ) : null
      ),
    },
  ];

  // Modal form content
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Select
        placeholder="Chọn người dùng"
        value={formData.user || ""}
        onChange={val => setFormData({ ...formData, user: val })}
        status={errors.user ? "error" : ""}
        showSearch
        optionFilterProp="children"
      >
        {users.filter(user => user.id).map(user => (
          <Option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </Option>
        ))}
      </Select>
      {errors.user && <div style={{ color: "#ff4d4f" }}>{errors.user}</div>}
    </div>
  );

  return (
    <section style={{ padding: "40px 0", background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "black" }}>
          Quản lý <span style={{ color: '#9333ea' }}>Lời mời Coach</span>
        </h2>
        <p style={{ color: "#666", fontSize: 18 }}>
          Quản lý các lời mời trở thành coach cho người dùng.
        </p>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto 32px auto", display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          shape="round"
          size="large"
          onClick={handleNew}
        >
          Gửi lời mời mới
        </Button>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px #f0f1f2" }}>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Không có lời mời nào." }}
          loading={loading}
        />
        {error && <div style={{ color: "#ff4d4f", marginTop: 16 }}>{error}</div>}
      </div>
      <Modal
        open={isNew}
        title="Gửi lời mời Coach mới"
        onCancel={() => setIsNew(false)}
        onOk={async () => {
          await handleSave();
          setIsNew(false);
          message.success("Đã gửi lời mời!");
        }}
        confirmLoading={loading}
        okText="Gửi"
        cancelText="Hủy"
        destroyOnClose
      >
        {modalForm}
      </Modal>
      <Modal
        open={showConfirm}
        title="Xác nhận từ chối"
        onCancel={() => {
          setShowConfirm(false);
          setRequestToDelete(null);
        }}
        onOk={async () => {
          await handleDelete(requestToDelete);
          setShowConfirm(false);
          setRequestToDelete(null);
          message.success("Đã từ chối lời mời!");
        }}
        okText="Từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn từ chối lời mời này không?
      </Modal>
    </section>
  );
};

export default Request;