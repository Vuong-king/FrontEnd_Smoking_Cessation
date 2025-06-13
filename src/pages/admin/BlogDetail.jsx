import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog) {
    return (
      <div className="text-center text-white mt-20">
        <h2 className="text-2xl font-bold">Blog not found</h2>
        <button
          onClick={() => navigate("/admin/blogs")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded text-white"
        >
          Back to Blog List
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 text-white max-w-4xl mx-auto">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate("/admin/blogs")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-4 py-2 rounded transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog List
      </button>

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-white/70 mb-2">Author: {blog.author}</p>
      {blog.thumbnail && (
        <img
          src={blog.thumbnail}
          alt="Thumbnail"
          className="mb-6 w-full max-h-[300px] object-cover rounded"
        />
      )}
      <p className="text-lg">{blog.summary}</p>
    </div>
  );
};

export default BlogDetail;
