import { useState } from "react";
import { usePostData } from "../../hook/usePostData";
import FilterBar from "../../components/generic/blog/FilterBar";
import BlogCard from "../../components/generic/blog/BlogCard";

function BlogPage() {
  const { posts, loading, error, tags } = usePostData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const filteredPosts = (posts || []).filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      post.tags?.some((tag) => selectedTags.includes(tag._id));

    return matchesSearch && matchesTags;
  });

  const handleFilterChange = (filters) => {
    if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm);
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="flex-1 min-w-0 pt-6">
        <FilterBar
          onFilterChange={handleFilterChange}
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">Error: {error}</div>
        ) : (
          <BlogList posts={filteredPosts} />
        )}
      </div>
    </div>
  );
}

const BlogList = ({ posts }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Bài viết mới nhất ({posts.length})
        </h2>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Không tìm thấy bài viết nào phù hợp.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
