"use client"

import { useState } from "react"
import BlogDetail from "../../components/user/blog/BlogDetail"
import CreateBlog from "../../components/user/blog/CreateBlog"
import MyPosts from "../../components/user/blog/MyPosts"
import FilterSidebar from "../../components/user/blog/FilterSidbar"
import FilterBar from "../../components/user/blog/FilterBar"
import BlogCard from "../../components/user/blog/BlogCard"


const samplePosts = [
  {
    id: 1,
    title: "10 Bước Đầu Tiên Để Bỏ Thuốc Lá Thành Công",
    summary:
      "Hướng dẫn chi tiết các bước cơ bản giúp bạn bắt đầu hành trình cai thuốc lá một cách hiệu quả và bền vững.",
    content: `
      <h2>Tại sao việc bỏ thuốc lá lại quan trọng?</h2>
      <p>Thuốc lá là một trong những nguyên nhân hàng đầu gây ra các bệnh về tim mạch, phổi và ung thư. Việc bỏ thuốc lá không chỉ cải thiện sức khỏe mà còn giúp tiết kiệm chi phí và nâng cao chất lượng cuộc sống.</p>
      
      <h2>10 Bước để bắt đầu</h2>
      <ol>
        <li><strong>Xác định động lực:</strong> Tìm ra lý do mạnh mẽ để bỏ thuốc</li>
        <li><strong>Chọn ngày bỏ thuốc:</strong> Đặt một mục tiêu cụ thể</li>
        <li><strong>Thông báo với người thân:</strong> Tìm kiếm sự hỗ trợ</li>
        <li><strong>Loại bỏ kích thích:</strong> Tránh xa những yếu tố gây thèm thuốc</li>
        <li><strong>Chuẩn bị thay thế:</strong> Tìm hoạt động thay thế khi thèm thuốc</li>
      </ol>
      
      <p>Hành trình cai thuốc không dễ dàng, nhưng với quyết tâm và phương pháp đúng, bạn hoàn toàn có thể thành công.</p>
    `,
    thumbnail: "/placeholder.svg?height=300&width=400",
    banner: "/placeholder.svg?height=400&width=800",
    author: "Bác sĩ Nguyễn Văn A",
    date: "2024-01-15",
    category: "Sức khỏe",
    tags: ["kinhnghiem", "suckhoe", "caithuan"],
    likes: 45,
    comments: 12,
  },
  {
    id: 2,
    title: "Tác Hại Của Thuốc Lá Đến Sức Khỏe Tâm Lý",
    summary:
      "Khám phá những ảnh hưởng tiêu cực của thuốc lá đến tâm lý và cách khắc phục chúng trong quá trình cai nghiện.",
    content: `
      <h2>Thuốc lá và sức khỏe tâm lý</h2>
      <p>Nhiều người không nhận ra rằng thuốc lá không chỉ gây hại cho sức khỏe thể chất mà còn ảnh hưởng nghiêm trọng đến tâm lý.</p>
      
      <h2>Những tác hại chính</h2>
      <ul>
        <li>Tăng nguy cơ trầm cảm và lo âu</li>
        <li>Giảm khả năng tập trung</li>
        <li>Ảnh hưởng đến giấc ngủ</li>
        <li>Tạo ra sự phụ thuộc tâm lý</li>
      </ul>
      
      <p>Việc hiểu rõ những tác hại này sẽ giúp bạn có động lực mạnh mẽ hơn để bỏ thuốc lá.</p>
    `,
    thumbnail: "/placeholder.svg?height=300&width=400",
    author: "Chuyên gia Tâm lý Trần Thị B",
    date: "2024-01-12",
    category: "Tâm lý",
    tags: ["tamly", "suckhoe", "chuyengia"],
    likes: 32,
    comments: 8,
  },
  {
    id: 3,
    title: "Chia Sẻ Kinh Nghiệm: 6 Tháng Không Thuốc Lá",
    summary:
      "Câu chuyện thật từ một người đã thành công cai thuốc lá sau 15 năm hút thuốc, chia sẻ những khó khăn và bí quyết vượt qua.",
    content: `
      <h2>Hành trình của tôi</h2>
      <p>Tôi đã hút thuốc lá trong 15 năm, từ khi còn là sinh viên. Việc quyết định bỏ thuốc không hề dễ dàng.</p>
      
      <h2>Những thách thức đầu tiên</h2>
      <p>Tuần đầu tiên là khó khăn nhất. Tôi cảm thấy bồn chồn, khó tập trung và thường xuyên thèm thuốc.</p>
      
      <h2>Bí quyết thành công</h2>
      <ul>
        <li>Tập thể dục đều đặn</li>
        <li>Uống nhiều nước</li>
        <li>Tìm sở thích mới</li>
        <li>Nhờ sự hỗ trợ từ gia đình</li>
      </ul>
      
      <p>Giờ đây, sau 6 tháng, tôi cảm thấy khỏe mạnh hơn bao giờ hết và tự hào về quyết định của mình.</p>
    `,
    thumbnail: "/placeholder.svg?height=300&width=400",
    author: "Nguyễn Minh C",
    date: "2024-01-10",
    category: "Kinh nghiệm",
    tags: ["kinhnghiem", "thanhcong", "dongvienluc"],
    likes: 67,
    comments: 23,
  },
  {
    id: 4,
    title: "Phương Pháp Thiền Định Hỗ Trợ Cai Thuốc",
    summary:
      "Tìm hiểu cách sử dụng thiền định và các kỹ thuật thư giãn để vượt qua cơn thèm thuốc và giảm stress trong quá trình cai nghiện.",
    content: `
      <h2>Thiền định và cai thuốc lá</h2>
      <p>Thiền định là một công cụ mạnh mẽ giúp kiểm soát cơn thèm thuốc và quản lý stress hiệu quả.</p>
      
      <h2>Các kỹ thuật cơ bản</h2>
      <ol>
        <li>Thiền hơi thở: Tập trung vào nhịp thở tự nhiên</li>
        <li>Thiền chánh niệm: Quan sát cảm xúc mà không phán xét</li>
        <li>Thiền hình dung: Tưởng tượng bản thân khỏe mạnh, không thuốc lá</li>
      </ol>
      
      <p>Thực hành thiền định 10-15 phút mỗi ngày sẽ giúp bạn có được sự bình tĩnh cần thiết trong hành trình cai thuốc.</p>
    `,
    thumbnail: "/placeholder.svg?height=300&width=400",
    author: "Huấn luyện viên Yoga Lê Thị D",
    date: "2024-01-08",
    category: "Tâm lý",
    tags: ["tamly", "thien", "thugian"],
    likes: 28,
    comments: 15,
  },
]

const categories = ["Sức khỏe", "Tâm lý", "Kinh nghiệm", "Dinh dưỡng"]
const tags = ["kinhnghiem", "suckhoe", "tamly", "chuyengia", "thanhcong", "caithuan", "dongvienluc", "thien", "thugian"]

function UserBlogPage() {
  const [currentView, setCurrentView] = useState("home")
  const [selectedPost, setSelectedPost] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTags, setSelectedTags] = useState([])

  // Handlers
  const handleViewChange = (view) => setCurrentView(view)
  const handlePostSelect = (post) => {
    setSelectedPost(post)
    setCurrentView("detail")
  }
  const handlePostCreate = (newPost) => {
    const post = {
      ...newPost,
      id: Date.now(),
      author: "Bạn",
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
    }
    setUserPosts([post, ...userPosts])
    setCurrentView("myPosts")
  }

  const handleFilterChange = (filters) => {
    if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm)
  }

  const handleCategoryChange = (category) => setSelectedCategory(category)
  const handleTagToggle = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Filter posts
  const allPosts = [...samplePosts, ...userPosts]
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => post.tags.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })

  // Render views
  if (currentView === "detail" && selectedPost) {
    const relatedPosts = allPosts.filter(
      (post) =>
        post.id !== selectedPost.id &&
        (post.category === selectedPost.category ||
          post.tags.some((tag) => selectedPost.tags.includes(tag)))
    ).slice(0, 3);

    return (
      <BlogDetail
        post={selectedPost}
        relatedPosts={relatedPosts}
        onBack={() => setCurrentView("home")}
        onPostClick={handlePostSelect}
      />
    )
  }

  if (currentView === "create") {
    return <CreateBlog onSubmit={handlePostCreate} onCancel={() => setCurrentView("home")} />
  }

  if (currentView === "myPosts") {
    return (
      <MyPosts
        posts={userPosts}
        onPostClick={handlePostSelect}
        onBack={() => setCurrentView("home")}
        onCreateNew={() => setCurrentView("create")}
      />
    )
  }

  // Home view with sidebar layout
  return (
    <div className="flex gap-6">
      {/* Filter Sidebar */}
      <FilterSidebar
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        onCategoryChange={handleCategoryChange}
        onTagToggle={handleTagToggle}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <FilterBar
          onNavigate={handleViewChange}
          onFilterChange={handleFilterChange}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <BlogList posts={filteredPosts} onPostClick={handlePostSelect} />
      </div>
    </div>
  )
}


const BlogList = ({ posts, onPostClick }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bài viết mới nhất ({posts.length})</h2>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} onClick={onPostClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào phù hợp.</p>
        </div>
      )}
    </div>
  )
}

export default UserBlogPage
