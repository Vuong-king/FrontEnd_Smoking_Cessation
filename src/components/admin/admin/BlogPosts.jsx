import React, { useState } from "react";
import { Plus, Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import useBlogs from "../../../hook/useBlogs";

const BlogPosts = () => {
  const { blogs, toast, createBlog, updateBlog, deleteBlog } = useBlogs();
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    summary: "",
    thumbnail: "",
  });
  const [isNew, setIsNew] = useState(false);

  const handleNew = () => {
    setIsNew(true);
    setEditingBlog({});
    setFormData({ title: "", author: "", summary: "", thumbnail: "" });
  };

  const handleEdit = (blog) => {
    setIsNew(false);
    setEditingBlog(blog);
    setFormData(blog);
  };

  const handleSave = () => {
    if (!formData.title || !formData.author || !formData.summary) return;
    if (isNew) {
      createBlog(formData);
    } else {
      updateBlog(editingBlog.id, formData);
    }
    setEditingBlog(null);
    setIsNew(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg z-50 text-sm transition-all duration-300
            ${toast.type === "error" ? "bg-red-600" : "bg-green-600"} text-white`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Blog Posts
          </span>
        </h2>
        <p className="text-white/70">
          Manage health tips and user experience sharing.
        </p>
      </div>

      {/* Add New Button */}
      <div className="max-w-5xl mx-auto mb-6 text-right">
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Blog
        </button>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {blogs.map((blog) => (
          <div key={blog.id} className="relative group">
            <Link
              to={`/admin/blogs/${blog.id}`}
              className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
            >
              {blog.thumbnail && (
                <img
                  src={blog.thumbnail}
                  alt="Thumbnail"
                  className="mb-4 w-full h-40 object-cover rounded"
                />
              )}
              <h3 className="text-lg font-semibold mb-1">{blog.title}</h3>
              <p className="text-sm text-white/70 mb-2">By {blog.author}</p>
              <p className="text-sm text-white/50">{blog.summary}</p>
            </Link>

            {/* Nút Edit/Delete nằm ngoài Link */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
              <button
                onClick={() => handleEdit(blog)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => deleteBlog(blog.id)}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-900 to-cyan-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {isNew ? "Add New Blog" : "Edit Blog"}
            </h3>

            <div className="grid gap-3 mb-6">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="p-2 rounded text-black"
              />
              <input
                type="text"
                placeholder="Author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="p-2 rounded text-black"
              />
              <textarea
                placeholder="Summary"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                className="p-2 rounded text-black"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: reader.result,
                    }));
                  };
                  reader.readAsDataURL(file);
                }}
                className="text-sm text-white"
              />
              {formData.thumbnail && (
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded shadow"
                />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setIsNew(false);
                }}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogPosts;
