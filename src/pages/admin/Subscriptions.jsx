import React from "react";
import { Table, Button, Modal, Input, Select, Tag, Spin } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import useSubscriptions from "../../hook/useSubscriptions";
import ColourfulText from "../../components/ui/ColourfulText";

const { Option } = Select;

const statusLabels = {
  active: { label: "Đang hoạt động", color: "green" },
  pending: { label: "Chờ xử lý", color: "gold" },
  cancelled: { label: "Đã hủy", color: "red" },
  expired: { label: "Hết hạn", color: "default" },
  grace_period: { label: "Gia hạn", color: "orange" },
};

const Subscriptions = () => {
  const {
    subscriptions,
    users,
    packages,
    loading,
    error,
    showConfirm,
    setShowConfirm,
    subToDelete,
    setSubToDelete,
    handleDelete,
    openNewModal,
    openEditModal,
    editedSub,
    setEditedSub,
    errors,
    setSelectedSub,
    isNew,
    setIsNew,
    handleSaveChanges,
    selectedSub,
  } = useSubscriptions();


  // Modal form content
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Select
        placeholder="Chọn người dùng"
        value={editedSub.user_id}
        onChange={value => setEditedSub({ ...editedSub, user_id: value })}
        status={errors.user_id ? "error" : ""}
        showSearch
        optionFilterProp="children"
      >
        {users.map((u) => (
          <Option key={u.id} value={u.id}>{u.name}</Option>
        ))}
      </Select>
      {errors.user_id && <div style={{ color: "#ff4d4f" }}>{errors.user_id}</div>}
      <Select
        placeholder="Chọn một gói"
        value={editedSub.package_id}
        onChange={value => setEditedSub({ ...editedSub, package_id: value })}
        status={errors.package_id ? "error" : ""}
      >
        {packages.map((p) => (
          <Option key={p._id} value={p._id}>{p.name}</Option>
        ))}
      </Select>
      {errors.package_id && <div style={{ color: "#ff4d4f" }}>{errors.package_id}</div>}
      <Input
        placeholder="Tên đăng ký"
        value={editedSub.name}
        onChange={e => setEditedSub({ ...editedSub, name: e.target.value })}
        status={errors.name ? "error" : ""}
      />
      {errors.name && <div style={{ color: "#ff4d4f" }}>{errors.name}</div>}
      <Input
        placeholder="Giá"
        value={editedSub.price}
        onChange={e => setEditedSub({ ...editedSub, price: e.target.value })}
        status={errors.price ? "error" : ""}
      />
      {errors.price && <div style={{ color: "#ff4d4f" }}>{errors.price}</div>}
      <Input
        type="date"
        placeholder="Ngày bắt đầu"
        value={editedSub.start_date}
        onChange={e => setEditedSub({ ...editedSub, start_date: e.target.value })}
        status={errors.start_date ? "error" : ""}
      />
      {errors.start_date && <div style={{ color: "#ff4d4f" }}>{errors.start_date}</div>}
      <Input
        type="date"
        placeholder="Ngày kết thúc"
        value={editedSub.end_date}
        onChange={e => setEditedSub({ ...editedSub, end_date: e.target.value })}
        status={errors.end_date ? "error" : ""}
      />
      {errors.end_date && <div style={{ color: "#ff4d4f" }}>{errors.end_date}</div>}
      <Select
        placeholder="Trạng thái"
        value={editedSub.status}
        onChange={value => setEditedSub({ ...editedSub, status: value })}
        status={errors.status ? "error" : ""}
      >
        <Option value="pending">Chờ xử lý</Option>
        <Option value="active">Đang hoạt động</Option>
        <Option value="cancelled">Đã hủy</Option>
        <Option value="expired">Hết hạn</Option>
        <Option value="grace_period">Gia hạn</Option>
      </Select>
      {errors.status && <div style={{ color: "#ff4d4f" }}>{errors.status}</div>}
    </div>
  );

  // Table columns
  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "user_id",
      key: "user_id",
      render: (userId) => {
        const user = Array.isArray(users) ? users.find((u) => u.id === userId) : null;
        return user ? user.name : "Không rõ";
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Gói",
      dataIndex: "package_id",
      key: "package_id",
      render: (id) => {
        const pkg = packages.find((p) => p._id === id);
        if (!pkg) return id;
        let color = "#d9d9d9";
        if (pkg.name === "free") color = "#52c41a";
        if (pkg.name === "plus") color = "#1890ff";
        if (pkg.name === "premium") color = "#faad14";
        return (
          <span style={{
            border: `2px solid ${color}`,
            color: color,
            padding: "2px 12px",
            borderRadius: 8,
            fontWeight: 600,
            textTransform: "capitalize",
            background: "#fff"
          }}>
            {pkg.name}
          </span>
        );
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusLabels[status]?.color || "default"}>
          {statusLabels[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "right",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSubToDelete(record._id);
              setShowConfirm(true);
            }}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  // Loading
  if (loading && subscriptions.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#ff4d4f",
            fontSize: 18,
            background: "#fff1f0",
            padding: 24,
            borderRadius: 8,
            border: "1px solid #ffa39e",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <section
      style={{ padding: "40px 0", background: "#f9fafb", minHeight: "100vh" }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "black" }}>
          Quản lý <ColourfulText text="Đăng ký"/>
        </h2>
        <p style={{ color: "#666", fontSize: 18 }}>
          Quản lý và xem xét tất cả các đăng ký hiện tại và đã qua.
        </p>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto 32px auto", display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          shape="round"
          size="large"
          onClick={openNewModal}
        >
          Thêm đăng ký
        </Button>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 8px #f0f1f2",
        }}
      >
        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: "Không có đăng ký nào.",
          }}
        />
      </div>
      <Modal
        open={!!selectedSub}
        title={isNew ? "Thêm đăng ký mới" : "Chỉnh sửa đăng ký"}
        onCancel={() => {
          setSelectedSub(null);
          setIsNew(false);
        }}
        onOk={handleSaveChanges}
        confirmLoading={loading}
        okText={isNew ? "Thêm" : "Lưu"}
        cancelText="Hủy"
        destroyOnClose
      >
        {modalForm}
      </Modal>

      <Modal
        open={showConfirm}
        title="Xác nhận xoá"
        onCancel={() => {
          setShowConfirm(false);
          setSubToDelete(null);
        }}
        onOk={() => {
          handleDelete(subToDelete);
          setShowConfirm(false);
          setSubToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn xóa đăng ký này không?
      </Modal>
    </section>
  );
};

export default Subscriptions;
