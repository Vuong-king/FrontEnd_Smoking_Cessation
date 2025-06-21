import { useEffect, useState} from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  User,
  Tag,
  Facebook,
  Twitter,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostData } from "../../../hook/usePostData";
import { useAuth } from "../../../context/AuthContext";
import CommentsSection from "./CommentsSection";

const UserBlogDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?._id;

  const {
    getPostById,
    likePost,
    refetchPosts,
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
  } = usePostData();

  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setPost(null);

        if (!id) {
          setError("Không tìm thấy bài viết");
          return;
        }

        const postData = await getPostById(id);
        setPost(postData);

        // So sánh userId kiểu string để tránh lỗi
        const hasLiked = user?._id
          ? postData.like_user_ids?.map(String).includes(String(user?._id))
          : false;
        setLiked(hasLiked);

        const commentList = await getCommentsByPostId(id);
        const formatted = commentList.map((c) => ({
          id: c._id || Date.now(),
          author:
            (typeof c.userId === "object" && c.userId?.name) // Nếu userId là object
              ? c.userId.name
              : (String(c.userId) === String(user._id)) // Nếu userId là id của user hiện tại
                ? user.name || "Bạn"
                : "Ẩn danh",
          comment_text: c.comment_text || "",
          date: c.createdAt || new Date().toISOString(),
          userId: c.userId,
          replies: [],
        }));
        setComments(formatted);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải bài viết hoặc bình luận.");
      }
    };

    fetchData();

  }, [id, user?._id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData = {
      comment_text: newComment.trim(),
      post_id: post._id || post.id,
      userId: user._id,
      createdAt: new Date().toISOString(),
    };
    try {
      const newCommentRes = await createComment(commentData);
      const commentToShow = {
        id: newCommentRes._id || Date.now(),
        author: user.name || "Bạn",
        comment_text: newCommentRes.comment_text || newComment,
        date: newCommentRes.createdAt || new Date().toISOString(),
        userId: user._id,
        replies: [],
      };
      setComments([...comments, commentToShow]);
      setNewComment("");
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    }
  };

  const handleEditComment = async (commentId, newText) => {
    await updateComment(commentId, { comment_text: newText });
    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, comment_text: newText }
        : c
    ));
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleBack = () => navigate("/blog");

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <button onClick={handleBack} className="text-purple-600 hover:text-purple-700 mb-4">
          ← Quay lại
        </button>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <button onClick={handleBack} className="text-purple-600 hover:text-purple-700 mb-4">
          ← Quay lại
        </button>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={handleBack} className="flex items-center text-purple-600 hover:text-purple-700 mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Quay lại danh sách
      </button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={post.image || post.banner || post.thumbnail || "/placeholder.svg"}
          alt={post.title || "Blog image"}
          className="w-full h-64 md:h-96 object-cover"
          onError={(e) => { e.target.src = "/placeholder.svg"; }}
        />

        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {post.title || "Untitled"}
          </h1>

          <div className="flex items-center text-gray-600 mb-6">
            <User className="h-5 w-5 mr-2" />
            <span className="mr-6">{post.user_id?.name || "Anonymous"}</span>
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date(post.post_date || post.date).toLocaleDateString("vi-VN")}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(Array.isArray(post.tags) ? post.tags : [post.tags])
              .filter(Boolean)
              .map((tag, idx) => (
                <span
                  key={tag._id || tag || idx}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.title || tag}
                </span>
              ))}
          </div>

          <div className="prose max-w-none mb-8 text-gray-900">
            {post.content ? (
              <div>{post.content}</div>
            ) : (
              <p className="text-gray-500">Không có nội dung</p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={async () => {
                  try {
                    await likePost(post._id || post.id);
                    await refetchPosts();
                    const updatedPost = await getPostById(id);
                    setPost(updatedPost);
                    const hasLiked = userId
                      ? updatedPost.like_user_ids?.includes(userId)
                      : false;
                    setLiked(hasLiked);
                    localStorage.setItem("should_reload_blog_list", "true");
                  } catch (error) {
                    console.error("Lỗi khi xử lý like:", error);
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  liked
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                <span>{post.reaction_count || 0}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600 mr-2">Chia sẻ:</span>
              <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <CommentsSection 
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmitComment={handleSubmitComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        currentUser={user}
      />
    </div>
  );
};

export default UserBlogDetail;