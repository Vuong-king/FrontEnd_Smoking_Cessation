"use client"

import { useState } from "react"
import { ArrowLeft, Save, Eye, ImageIcon, Tag, FileText } from "lucide-react"

const CreateBlog = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    tags: [],
    thumbnail: "",
  })
  const [newTag, setNewTag] = useState("")
  const [preview, setPreview] = useState(false)

  const categories = ["Sức khỏe", "Tâm lý", "Kinh nghiệm", "Dinh dưỡng"]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title && formData.summary && formData.content && formData.category) {
      onSubmit(formData)
    }
  }

  if (preview) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setPreview(false)} className="flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại chỉnh sửa
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Xuất bản
          </button>
        </div>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={formData.thumbnail || "/placeholder.svg?height=400&width=800"}
            alt={formData.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{formData.title}</h1>

            <div className="flex items-center text-gray-600 mb-6">
              <span className="mr-6">Bạn</span>
              <span>{new Date().toLocaleDateString("vi-VN")}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, "<br>") }} />
            </div>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onCancel} className="flex items-center text-purple-600 hover:text-purple-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại
        </button>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreview(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!formData.title || !formData.content}
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={!formData.title || !formData.summary || !formData.content || !formData.category}
          >
            <Save className="h-4 w-4 mr-2" />
            Xuất bản
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Tạo bài viết mới
        </h1>

        {/* Tiêu đề */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề bài viết *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Nhập tiêu đề bài viết..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            required
          />
        </div>

        {/* Tóm tắt */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt nội dung *</label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleInputChange("summary", e.target.value)}
            placeholder="Viết tóm tắt ngắn gọn về bài viết..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows="3"
            required
          />
        </div>

        {/* Chuyên mục */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên mục *</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Chọn chuyên mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Ảnh đại diện */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ImageIcon className="h-4 w-4 inline mr-1" />
            URL ảnh đại diện
          </label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => handleInputChange("thumbnail", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-purple-500 hover:text-purple-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Chọn tag...</option>
              <option value="kinhnghiem">kinhnghiem</option>
              <option value="suckhoe">suckhoe</option>
              <option value="tamly">tamly</option>
              <option value="chuyengia">chuyengia</option>
              <option value="thanhcong">thanhcong</option>
              <option value="caithuan">caithuan</option>
              <option value="dongvienluc">dongvienluc</option>
              <option value="thien">thien</option>
              <option value="thugian">thugian</option>
              <option value="dinhduong">dinhduong</option>
              <option value="tapluyen">tapluyen</option>
              <option value="giadinh">giadinh</option>
              <option value="hotro">hotro</option>
              <option value="thuoc">thuoc</option>
              <option value="stress">stress</option>
            </select>
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!newTag || formData.tags.includes(newTag)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Thêm
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Chọn các tag phù hợp để người đọc dễ tìm thấy bài viết của bạn</p>
        </div>

        {/* Nội dung */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung bài viết *</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Viết nội dung bài viết của bạn ở đây..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows="15"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Bạn có thể sử dụng HTML cơ bản như &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;ol&gt;
          </p>
        </div>
      </form>
    </div>
  )
}

export default CreateBlog
