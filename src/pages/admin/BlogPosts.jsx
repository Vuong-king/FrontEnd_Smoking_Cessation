import React from "react";
import { Card, Button, Modal, Input, Select, Tag, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useBlogs from "../../hook/useBlogs";
import ColourfulText from "../../components/ui/ColourfulText";

const { Option } = Select;

const BlogPosts = () => {
  const {
    blogs,
    tags,
    loading,
    error,
    editingBlog,
    setEditingBlog,
    formData,
    setFormData,
    errors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    blogToDelete,
    setBlogToDelete,
    handleNew,
    handleSave,
    handleDelete,
    getTagTitle,
  } = useBlogs();

  // Modal form content
  const modalForm = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input
        placeholder="Tiêu đề bài viết"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
        status={errors.title ? "error" : ""}
      />
      {errors.title && <div style={{ color: "#ff4d4f" }}>{errors.title}</div>}
      <Input.TextArea
        placeholder="Nội dung bài viết"
        value={formData.content}
        onChange={e => setFormData({ ...formData, content: e.target.value })}
        rows={5}
        status={errors.content ? "error" : ""}
      />
      {errors.content && <div style={{ color: "#ff4d4f" }}>{errors.content}</div>}
      <Input
        placeholder="URL hình ảnh"
        value={formData.image}
        onChange={e => setFormData({ ...formData, image: e.target.value })}
        status={errors.image ? "error" : ""}
      />
      {errors.image && <div style={{ color: "#ff4d4f" }}>{errors.image}</div>}
      {formData.image && (
        <img
          src={formData.image}
          alt="Xem trước"
          style={{ marginTop: 12, width: "100%", height: 160, objectFit: "cover", borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb", border: "1px solid #e5e7eb" }}
          onError={e => (e.target.src = 'https://via.placeholder.com/300x200?text=Không+tìm+thấy+hình+ảnh')}
        />
      )}
      <div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Thẻ</div>
        <div style={{ maxHeight: 160, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#f9fafb" }}>
          {tags.map((tag) => (
            <label key={tag._id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={formData.tags.includes(tag._id)}
                onChange={e => {
                  if (e.target.checked) {
                    setFormData({ ...formData, tags: [...formData.tags, tag._id] });
                  } else {
                    setFormData({ ...formData, tags: formData.tags.filter(id => id !== tag._id) });
                  }
                }}
                style={{ marginRight: 8 }}
              />
              <span>{tag.title}</span>
            </label>
          ))}
        </div>
        {formData.tags.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {formData.tags.map(id => (
              <Tag key={id} color="cyan">{getTagTitle(id)}</Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Loading
  if (loading && blogs.length === 0) {
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
          Quản lý <ColourfulText text="Blog" />
        </h2>
        <p style={{ color: "#666", fontSize: 18 }}>
          Tạo, chỉnh sửa và quản lý các mẹo sức khỏe và câu chuyện người dùng một cách dễ dàng.
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
          Bài viết mới
        </Button>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            hoverable
            style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2", position: "relative" }}
            cover={blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                style={{ width: "100%", height: 192, objectFit: "cover", borderRadius: "16px 16px 0 0" }}
                onError={e => (e.target.src = 'https://via.placeholder.com/300x200?text=Không+tìm+thấy+hình+ảnh')}
              />
            ) : null}
            actions={[
              <Button type="link" danger icon={<DeleteOutlined />} onClick={() => { setBlogToDelete(blog._id); setShowConfirm(true); }} key="delete">Xóa</Button>,
            ]}
          >
            <Link to={`/admin/blogs/${blog._id}`} state={{ blog }} style={{ textDecoration: "none", color: "inherit" }}>
              <Card.Meta
                title={<div style={{ fontWeight: 600 }}>{blog.title}</div>}
                description={
                  <>
                    <div style={{ color: "#666", marginBottom: 8 }}>Bởi {blog.user_id?.name || 'Tác giả không xác định'}</div>
                    <div style={{ color: "#888", marginBottom: 8, minHeight: 48, overflow: "hidden", textOverflow: "ellipsis" }}>{blog.content}</div>
                    {blog.tags && blog.tags.length > 0 && (
                      <div style={{ marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <Tag key={tag._id || tag || index} color="cyan">{getTagTitle(tag._id || tag)}</Tag>
                        ))}
                        {blog.tags.length > 3 && (
                          <span style={{ color: "#888" }}>+{blog.tags.length - 3} thêm</span>
                        )}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#888" }}>
                      <span>❤️ {blog.reaction_count || 0}</span>
                      <span>💬 {blog.comment_count || 0}</span>
                      <span>📅 {new Date(blog.post_date).toLocaleDateString()}</span>
                    </div>
                  </>
                }
              />
            </Link>
          </Card>
        ))}
      </div>
      <Modal
        open={!!editingBlog}
        title={isNew ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
        onCancel={() => {
          setEditingBlog(null);
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
          setBlogToDelete(null);
        }}
        onOk={() => {
          handleDelete(blogToDelete);
          setShowConfirm(false);
          setBlogToDelete(null);
        }}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
        destroyOnClose
      >
        Bạn có chắc chắn muốn xóa bài viết này không?
      </Modal>
    </section>
  );
};

export default BlogPosts;