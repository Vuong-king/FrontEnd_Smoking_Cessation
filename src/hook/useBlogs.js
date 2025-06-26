import { useState, useEffect } from 'react';
import BlogService from '../services/blogService';

const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setBlogs(BlogService.getAllBlogs());
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const createBlog = (blog) => {
    const updated = BlogService.createBlog(blog);
    setBlogs(updated);
    showToast('Blog post added.');
  };

  const updateBlog = (id, blog) => {
    const updated = BlogService.updateBlog(id, blog);
    setBlogs(updated);
    showToast('Blog post updated.');
  };

  const deleteBlog = (id) => {
    const updated = BlogService.deleteBlog(id);
    setBlogs(updated);
    showToast('Blog post deleted.', 'error');
  };

  return {
    blogs,
    toast,
    showToast,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};

export default useBlogs; 