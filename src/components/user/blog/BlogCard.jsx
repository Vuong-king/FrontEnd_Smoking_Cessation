"use client"
import { Heart, MessageCircle, Calendar, User, Tag } from "lucide-react"
import { usePostData } from '../../../hook/usePostData'

const BlogCard = ({ post, onClick }) => {
  const { updatePost } = usePostData();

  const handleLikeClick = async (e) => {
    e.stopPropagation(); 
    try {
      await updatePost(post._id, { 
        reaction_count: (post.reaction_count || 0) + 1 
      });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const renderTitle = () => {
    // Giới hạn nội dung hiển thị 50 ký tự đầu tiên
    return post.content?.substring(0, 50) + '...' || 'Untitled';
  };

  return (
    <div
      className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={() => onClick(post)}
    >
      <img 
        src={post.image || "/placeholder.svg"} 
        alt={renderTitle()} 
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/placeholder.svg'
        }}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <User className="h-4 w-4 mr-1" />
          <span className="mr-4">{post.user_id?.name || 'Anonymous'}</span>
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(post.post_date)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag) => (
            <span
              key={tag._id}
              className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag.title}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLikeClick}
              className="flex items-center hover:text-purple-600 transition-colors"
            >
              <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-purple-600' : ''}`} />
              {post.reaction_count || 0}
            </button>
            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comment_count || 0}
            </span>
          </div>
          <span className="text-purple-600 font-medium">{post.post_type}</span>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
