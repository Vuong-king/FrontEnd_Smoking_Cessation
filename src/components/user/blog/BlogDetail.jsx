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
import { useParams } from "react-router-dom"

const BlogDetail = ({ post, onBack, relatedPosts, onPostClick }) => {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const { id } = useParams()
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }, [id, post.id]); 
  
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center text-purple-600 hover:text-purple-700 mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Quay lại danh sách
      </button>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={post.banner || post.thumbnail} alt={post.title} className="w-full h-64 md:h-96 object-cover" />

        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>

          <div className="flex items-center text-gray-600 mb-6">
            <User className="h-5 w-5 mr-2" />
            <span className="mr-6">{post.author}</span>
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date(post.date).toLocaleDateString("vi-VN")}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-8 text-gray-900">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
                <span>{post.likes + (liked ? 1 : 0)}</span>
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

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Bài viết liên quan</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div
                key={relatedPost.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onPostClick(relatedPost)}
              >
                <img
                  src={relatedPost.thumbnail || "/placeholder.svg"}
                  alt={relatedPost.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{relatedPost.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogDetail
