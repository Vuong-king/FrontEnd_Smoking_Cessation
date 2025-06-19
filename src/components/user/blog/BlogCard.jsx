"use client"
import { Heart, MessageCircle, Calendar, User, Tag } from "lucide-react"

const BlogCard = ({ post, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={() => onClick(post)}
    >
      <img src={post.thumbnail || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <User className="h-4 w-4 mr-1" />
          <span className="mr-4">{post.author}</span>
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(post.date).toLocaleDateString("vi-VN")}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes}
            </span>
            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments}
            </span>
          </div>
          <span className="text-purple-600 font-medium">{post.category}</span>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
