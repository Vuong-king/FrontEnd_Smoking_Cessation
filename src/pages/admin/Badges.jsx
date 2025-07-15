import React from "react";
import { Card, Button, Modal, Input, Select, Spin, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, TrophyOutlined, SafetyCertificateOutlined, CrownOutlined } from "@ant-design/icons";
import useBadges from "../../hook/useBadges";
import ColourfulText from "../../components/ui/ColourfulText";

const { Option } = Select;

const tierLabels = {
  Bronze: { label: "Đồng", icon: <SafetyCertificateOutlined style={{ color: '#b45309' }} /> },
  Silver: { label: "Bạc", icon: <TrophyOutlined style={{ color: '#a3a3a3' }} /> },
  Gold: { label: "Vàng", icon: <CrownOutlined style={{ color: '#eab308' }} /> },
};

const Badges = () => {
  const {
    badges,
    loading,
    error,
    editingBadge,
    setEditingBadge,
    newData,
    setNewData,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    badgeToDelete,
    setBadgeToDelete,
    handleEdit,
    handleNew,
    handleSave,
    handleDelete,
  } = useBadges();

  // Loading
  if (loading && badges.length === 0) {
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

  // Modal form content
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input
        placeholder="Tên huy hiệu"
        value={newData.name}
        onChange={e => setNewData({ ...newData, name: e.target.value })}
        status={errors.name ? "error" : ""}
      />
      {errors.name && <div style={{ color: "#ff4d4f" }}>{errors.name}</div>}
      <Input
        placeholder="Điều kiện"
        value={newData.condition}
        onChange={e => setNewData({ ...newData, condition: e.target.value })}
        status={errors.condition ? "error" : ""}
      />
      {errors.condition && <div style={{ color: "#ff4d4f" }}>{errors.condition}</div>}
      <Input
        type="number"
        placeholder="Giá trị điểm"
        value={newData.point_value}
        onChange={e => setNewData({ ...newData, point_value: parseInt(e.target.value) })}
        status={errors.point_value ? "error" : ""}
      />
      {errors.point_value && <div style={{ color: "#ff4d4f" }}>{errors.point_value}</div>}
      <Input
        placeholder="URL hình ảnh"
        value={newData.url_image}
        onChange={e => setNewData({ ...newData, url_image: e.target.value })}
        status={errors.url_image ? "error" : ""}
      />
      {errors.url_image && <div style={{ color: "#ff4d4f" }}>{errors.url_image}</div>}
      {newData.url_image && (
        <img
          src={newData.url_image}
          alt="Badge Preview"
          style={{ marginTop: 12, width: "100%", height: 96, objectFit: "contain", borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb", border: "1px solid #e5e7eb" }}
          onError={e => (e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found')}
        />
      )}
      <Select
        placeholder="Chọn cấp bậc"
        value={newData.tier}
        onChange={value => setNewData({ ...newData, tier: value })}
        status={errors.tier ? "error" : ""}
      >
        <Option value="Bronze">Đồng</Option>
        <Option value="Silver">Bạc</Option>
        <Option value="Gold">Vàng</Option>
      </Select>
      {errors.tier && <div style={{ color: "#ff4d4f" }}>{errors.tier}</div>}
    </div>
  );

  return (
    <section style={{ padding: "40px 0", background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "black" }}>
          Quản lý <ColourfulText text="Huy hiệu" />
        </h2>
        <p style={{ color: "#666", fontSize: 18 }}>
          Xem danh sách các thành tích và yêu cầu của chúng.
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
          Thêm huy hiệu
        </Button>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        {badges.map((badge) => (
          <Card
            key={badge._id}
            hoverable
            style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2" }}
            actions={[
              <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(badge)} key="edit">Chỉnh sửa</Button>,
              <Button type="link" danger icon={<DeleteOutlined />} onClick={() => { setBadgeToDelete(badge._id); setShowConfirm(true); }} key="delete">Xóa</Button>,
            ]}
            cover={badge.url_image ? (
              <img
                src={badge.url_image}
                alt={badge.name}
                style={{ width: 64, height: 64, objectFit: "contain", margin: "24px auto 0 auto", borderRadius: "50%" }}
                onError={e => (e.target.src = 'https://via.placeholder.com/64?text=Badge')}
              />
            ) : (
              <div style={{ width: 64, height: 64, margin: "24px auto 0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {tierLabels[badge.tier]?.icon}
              </div>
            )}
          >
            <Card.Meta
              title={<div style={{ textAlign: "center", fontWeight: 600 }}>{badge.name}</div>}
              description={
                <>
                  <div style={{ textAlign: "center", color: "#666", marginBottom: 8 }}>{badge.condition}</div>
                  <div style={{ textAlign: "center", marginBottom: 4 }}>
                    <Tag color={badge.tier === "Bronze" ? "orange" : badge.tier === "Silver" ? "default" : "gold"}>
                      {tierLabels[badge.tier]?.icon} {tierLabels[badge.tier]?.label}
                    </Tag>
                  </div>
                  <div style={{ textAlign: "center", color: "#888" }}>Điểm: {badge.point_value}</div>
                </>
              }
            />
          </Card>
        ))}
      </div>
      <Modal
        open={!!editingBadge}
        title={isNew ? "Thêm huy hiệu mới" : "Chỉnh sửa huy hiệu"}
        onCancel={() => {
          setEditingBadge(null);
          setIsNew(false);
        }}
        onOk={handleSave}
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
          setBadgeToDelete(null);
        }}
        onOk={() => {
          handleDelete(badgeToDelete);
          setShowConfirm(false);
          setBadgeToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn xóa huy hiệu này không?
      </Modal>
    </section>
  );
};

export default Badges;