import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
  Calendar,
  User,
  Tag,
  Facebook,
  Twitter,
  MessageCircle,
  Send,
} from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { usePostData } from "../../../hook/usePostData"

const UserBlogDetail = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const { getPostById } = usePostData()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        setError(null);
        setPost(null);
        if (!id) {
          setError("Không tìm thấy bài viết");
          return;
        }
        const postData = await getPostById(id);
        console.log('Loaded post:', postData);
        setPost(postData);
      } catch (err) {
        console.error('Error loading post:', err);
        setError(err.message || "Có lỗi xảy ra khi tải bài viết");
      }
    };

    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Nguyễn Văn A",
      content: "Bài viết rất hữu ích! Cảm ơn tác giả đã chia sẻ.",
      date: "2024-01-15",
      replies: [],
    },
  ])
  const [newComment, setNewComment] = useState("")
  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Người dùng",
        content: newComment,
        date: new Date().toISOString().split("T")[0],
        replies: [],
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const handleBack = () => {
    navigate('/user/blog');
  };

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
      {/* Sửa nút back */}
      <button 
        onClick={handleBack} 
        className="flex items-center text-purple-600 hover:text-purple-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Quay lại danh sách
      </button>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img 
          src={post.image || post.banner || post.thumbnail || "/placeholder.svg"} 
          alt={post.title || "Blog image"} 
          className="w-full h-64 md:h-96 object-cover"
          onError={(e) => {
            e.target.src = '/placeholder.svg'
          }}
        />

        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {post.title || "Untitled"}
          </h1>

          <div className="flex items-center text-gray-600 mb-6">
            <User className="h-5 w-5 mr-2" />
            <span className="mr-6">{post.user_id?.name || post.author || "Anonymous"}</span>
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date(post.post_date || post.date).toLocaleDateString("vi-VN")}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(Array.isArray(post.tags) ? post.tags : [post.tags]).filter(Boolean).map((tag, idx) => (
              <span
                key={tag._id || tag || idx}
                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag.title || tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-8 text-gray-900">
            {post.content ? (
              <div>{post.content}</div>
            ) : (
              <p className="text-gray-500">Không có nội dung</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                <span>{(post.likes || 0) + (liked ? 1 : 0)}</span>
              </button>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  bookmarked ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
                <span>Lưu</span>
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
      <div className="bg-white rounded-lg shadow-lg mt-8 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2" />
          Bình luận ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
          />
          <button
            type="submit"
            className="mt-3 flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            Gửi bình luận
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium text-gray-800">{comment.author}</span>
                <span className="text-gray-500 text-sm ml-2">{new Date(comment.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <p className="text-gray-700 ml-11">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserBlogDetail