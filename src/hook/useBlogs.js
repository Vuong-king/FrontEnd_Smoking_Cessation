import { useState, useEffect } from 'react';
import BlogService from '../services/blogService';
import api from '../api';

const useBlogs = () => {
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
    } catch {
      // ignore
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
      setError(err.response?.data?.message || "Không thể xóa bài viết");
    } finally {
      setLoading(false);
    }
  };

  const getTagTitle = (tagId) => {
    const tag = tags.find(t => t._id === tagId);
    return tag ? tag.title : tagId;
  };

  return {
    blogs,
    tags,
    loading,
    error,
    editingBlog,
    setEditingBlog,
    formData,
    setFormData,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    blogToDelete,
    setBlogToDelete,
    fetchBlogs,
    fetchTags,
    handleNew,
    handleEdit,
    handleSave,
    handleDelete,
    getTagTitle,
  };
};

export default useBlogs; 