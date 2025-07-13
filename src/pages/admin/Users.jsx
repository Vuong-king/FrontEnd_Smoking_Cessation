import React from "react";
import { Table, Button, Modal, Input, Select, Avatar, Spin, Tag } from "antd";
import { ExclamationCircleOutlined, UserOutlined, CrownOutlined, SolutionOutlined } from "@ant-design/icons";
import useUsers from "../../hook/useUsers";
import ColourfulText from "../../components/ui/ColourfulText";

const { Option } = Select;

const roleLabels = {
  admin: { label: "Quản trị viên", icon: <CrownOutlined style={{ color: '#a259ec' }} /> },
  coach: { label: "Huấn luyện viên", icon: <SolutionOutlined style={{ color: '#06b6d4' }} /> },
  user: { label: "Người dùng", icon: <UserOutlined style={{ color: '#22c55e' }} /> },
};

const Users = () => {
  const {
    users,
    loading,
    error,
    role,
    setRole,
    showModal,
    setShowModal,
    newUser,
    setNewUser,
    errors,
    editingId,
    setEditingId,
    showConfirm,
    setShowConfirm,
    userToDelete,
    setUserToDelete,
    openNewModal,
    openEditModal,
    handleSave,
    deleteUser,
  } = useUsers();

  const filteredUsers = users.filter((u) => u.role === role);

  const handleDelete = async (id) => {
    await deleteUser(id);
  };

  // Table columns
  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar_url",
      key: "avatar_url",
      render: (url, record) => (
        <Avatar src={url} alt={`Ảnh đại diện của ${record.name}`} size={40} icon={<UserOutlined />} />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (r) => (
        <Tag color={r === "admin" ? "purple" : r === "coach" ? "cyan" : "green"}>
          {roleLabels[r]?.icon} {roleLabels[r]?.label}
        </Tag>
      ),
    },
    (role === "coach" || role === "user") && {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => {
            setUserToDelete(record.id);
            setShowConfirm(true);
          }}>
            Xóa
          </Button>
        </>
      ),
    },
  ].filter(Boolean);

  // Role switcher
  const roleOptions = [
    { value: "admin", label: "Quản trị viên" },
    { value: "coach", label: "Huấn luyện viên" },
    { value: "user", label: "Người dùng" },
  ];

  // Modal form content
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {editingId && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar src={newUser.avatar_url || undefined} size={64} icon={<UserOutlined />} />
          <Input
            placeholder="URL ảnh đại diện"
            value={newUser.avatar_url}
            onChange={e => setNewUser({ ...newUser, avatar_url: e.target.value })}
            status={errors.avatar_url ? "error" : ""}
          />
        </div>
      )}
      <Input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
        status={errors.email ? "error" : ""}
      />
      <Input
        placeholder="Họ tên"
        value={newUser.name}
        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
        status={errors.name ? "error" : ""}
      />
      {editingId && (
        <Select
          placeholder="Chọn vai trò"
          value={newUser.role}
          onChange={value => setNewUser({ ...newUser, role: value })}
          status={errors.role ? "error" : ""}
        >
          <Option value="admin">Quản trị viên</Option>
          <Option value="coach">Huấn luyện viên</Option>
          <Option value="user">Người dùng</Option>
        </Select>
      )}
      {Object.keys(errors).map(
        (key) => errors[key] && <div key={key} style={{ color: "#ff4d4f" }}>{errors[key]}</div>
      )}
    </div>
  );

  // Loading
  if (loading && users.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ff4d4f", fontSize: 18, background: "#fff1f0", padding: 24, borderRadius: 8, border: "1px solid #ffa39e" }}>{error}</div>
      </div>
    );
  }

  return (
    <section style={{ padding: "40px 0", background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "black" }}>
          Quản lý {" "}
          <ColourfulText text={roleLabels[role]?.label}/>
        </h2>
        <Select
          value={role}
          onChange={value => {
            setRole(value);
            setNewUser({ email: "", name: "", role: "", avatar_url: "" });
            setEditingId(null);
            setShowModal(false);
          }}
          options={roleOptions}
          style={{ width: 200, marginTop: 16 }}
        />
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px #f0f1f2" }}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          locale={{
            emptyText:
              role === "admin"
                ? "Không có quản trị viên nào."
                : role === "coach"
                ? "Không có huấn luyện viên nào."
                : "Không có người dùng nào.",
          }}
        />
      </div>
      {/* {(role === "coach" || role === "user") && (
        <Button
          type="primary"
          shape="round"
          size="large"
          style={{ position: "fixed", bottom: 40, right: 40, zIndex: 100 }}
          onClick={openNewModal}
        >
          ➕ Thêm {role === "coach" ? "huấn luyện viên" : "người dùng"}
        </Button>
      )} */}
      <Modal
        open={showModal && (role === "coach" || role === "user")}
        title={editingId ? `Sửa ${role === "coach" ? "huấn luyện viên" : "người dùng"}` : `Thêm ${role === "coach" ? "huấn luyện viên" : "người dùng"}`}
        onCancel={() => {
          setShowModal(false);
          setNewUser({ email: "", name: "", role: "", avatar_url: "" });
          setEditingId(null);
        }}
        onOk={handleSave}
        confirmLoading={loading}
        okText={editingId ? "Cập nhật" : "Thêm"}
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
          setUserToDelete(null);
        }}
        onOk={() => {
          handleDelete(userToDelete);
          setShowConfirm(false);
          setUserToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn xóa người dùng này không?
      </Modal>
    </section>
  );
};

export default Users;
