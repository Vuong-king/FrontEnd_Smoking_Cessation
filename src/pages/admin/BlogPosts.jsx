import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import api from "../../api";

const BlogPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: [],
  });
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    image: "",
    tags: ""
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/posts');
      setBlogs(response.data.posts);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      let tagsData = [];
      if (Array.isArray(response.data.data)) {
        tagsData = response.data.data;
      } else if (Array.isArray(response.data.tags)) {
        tagsData = response.data.tags;
      } else if (Array.isArray(response.data)) {
        tagsData = response.data;
      }
      setTags(tagsData);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const handleNew = () => {
    setFormData({ title: "", content: "", image: "", tags: [] });
    setErrors({ title: "", content: "", image: "", tags: "" });
    setEditingBlog({});
    setIsNew(true);
  };

  const handleEdit = (blog) => {
    setIsNew(false);
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image,
      tags: blog.tags?.map(tag => tag._id || tag) || []
    });
  };

  const handleSave = async () => {
    const newErrors = {
      title: !formData.title ? "Vui lòng nhập tiêu đề" : "",
      content: !formData.content ? "Vui lòng nhập nội dung" : "",
      image: "",
      tags: ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        await api.post('/posts/create', formData);
      } else {
        await api.put(`/posts/${editingBlog._id}`, formData);
      }
      await fetchBlogs();
      setEditingBlog(null);
      setIsNew(false);
    } catch (err) {
      console.error("Error saving blog:", err);
      setError(err.response?.data?.message || "Không thể lưu bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/posts/${id}`);
      await fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError(err.response?.data?.message || "Không thể xóa bài viết");
    } finally {
      setLoading(false);
    }
  };

  const getTagTitle = (tagId) => {
    const tag = tags.find(t => t._id === tagId);
    return tag ? tag.title : tagId;
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex items-center gap-2 text-white text-lg">
          <svg className="animate-spin h-5 w-5 text-cyan-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
          </svg>
          Đang tải...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-lg bg-red-900/30 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="text-center mb-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Quản lý Blog
        </h2>
        <p className="text-gray-300 text-lg">
          Tạo, chỉnh sửa và quản lý các mẹo sức khỏe và câu chuyện người dùng một cách dễ dàng.
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-end">
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Bài viết mới
        </button>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Link
              to={`/admin/blogs/${blog._id}`}
              className="block p-5"
            >
              {blog.image && (
                <div className="relative mb-4">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent rounded-lg"></div>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2 text-cyan-300">{blog.title}</h3>
              <p className="text-sm text-gray-400 mb-3">
                Bởi {blog.user_id?.name || 'Tác giả không xác định'}
              </p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                {blog.content}
              </p>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={tag._id || tag || index}
                      className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20"
                    >
                      {getTagTitle(tag._id || tag)}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{blog.tags.length - 3} thêm
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="text-red-400">❤️</span> {blog.reaction_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-400">💬</span> {blog.comment_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400">📅</span> {new Date(blog.post_date).toLocaleDateString()}
                </span>
              </div>
            </Link>

            {/* Edit/Delete Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => handleEdit(blog)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-cyan-500 text-white text-xs font-medium transition"
              >
                <Pencil className="w-4 h-4" /> Sửa
              </button>
              <button
                onClick={() => {
                  setBlogToDelete(blog._id);
                  setShowConfirm(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition"
              >
                <Trash className="w-4 h-4" /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in-50 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center text-cyan-300">
              {isNew ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề bài viết"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.title ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nội dung</label>
                <textarea
                  placeholder="Viết nội dung bài viết"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.content ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL hình ảnh</label>
                <input
                  type="text"
                  placeholder="Nhập URL hình ảnh"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${errors.image ? 'border-red-500' : 'border-gray-600'} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition`}
                />
                {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Xem trước"
                    className="mt-3 w-full h-40 object-cover rounded-lg shadow-sm"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Không+tìm+thấy+hình+ảnh')}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thẻ</label>
                <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-lg p-3 bg-gray-700">
                  {tags.map((tag) => (
                    <label key={tag._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, tag._id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              tags: formData.tags.filter(id => id !== tag._id)
                            });
                          }
                        }}
                        className="mr-2 accent-cyan-500"
                      />
                      <span className="text-sm text-gray-200">{tag.title}</span>
                    </label>
                  ))}
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map(id => (
                      <span key={id} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full">
                        {getTagTitle(id)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setIsNew(false);
                }}
                className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-200 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                    </svg>
                    Đang lưu...
                  </span>
                ) : (
                  "Lưu bài viết"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message="Bạn có chắc chắn muốn xóa bài viết này?"
          onCancel={() => {
            setShowConfirm(false);
            setBlogToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(blogToDelete);
            setShowConfirm(false);
            setBlogToDelete(null);
          }}
        />
      )}
    </section>
  );
};

export default BlogPosts;