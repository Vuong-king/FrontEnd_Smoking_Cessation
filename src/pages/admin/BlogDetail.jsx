import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BlogDetail = () => {
  const navigate = useNavigate();
  const { blog } = useLocation().state || {};

  if (!blog) {
    return (
      <div className="text-center text-white mt-20">
        <h2 className="text-2xl font-bold">Không tìm thấy bài viết</h2>
        <button
          onClick={() => navigate("/admin/blogs")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded text-white"
        >
          Quay lại danh sách Blog
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 text-white max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/blogs")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-4 py-2 rounded transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách Blog
      </button>

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-white/70 mb-2">Tác giả: {blog.user_id?.name || "Không xác định"}</p>
      {blog.image && (
        <img
          src={blog.image}
          alt="Hình ảnh bài viết"
          className="mb-6 w-full max-h-[300px] object-cover rounded"
          onError={e => (e.target.src = 'https://via.placeholder.com/600x300?text=Không+tìm+thấy+hình+ảnh')}
        />
      )}
      <div className="prose prose-invert max-w-none mb-6">
        {blog.content}
      </div>
      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag, idx) => (
            <span
              key={tag._id || tag || idx}
              className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20"
            >
              {tag.title || tag}
            </span>
          ))}
        </div>
      )}
      {/* Blog metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
        <span className="flex items-center gap-1">
          <span className="text-red-400">❤️</span> {blog.reaction_count || 0}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-blue-400">💬</span> {blog.comment_count || 0}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-green-400">📅</span> {blog.post_date ? new Date(blog.post_date).toLocaleDateString() : ""}
        </span>
      </div>
    </div>
  );
};

export default BlogDetail;
