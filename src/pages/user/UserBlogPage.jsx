"use client";

import { useState, useEffect } from "react";
import { usePostData } from "../../hook/usePostData";
import BlogDetail from "../../components/user/blog/UserBlogDetail";
import CreateBlog from "../../components/user/blog/CreateBlog";
import MyPosts from "../../components/user/blog/MyPosts";
import FilterSidebar from "../../components/user/blog/FilterSidbar";
import FilterBar from "../../components/user/blog/FilterBar";
import BlogCard from "../../components/user/blog/BlogCard";

function UserBlogPage() {
  const {
    posts: apiPosts,
    createPost,
    tags = [],
    loading,
    error,
    getPostsByUserId,
    fetchPosts,
  } = usePostData();
  const [currentView, setCurrentView] = useState("home");
  const [selectedPost, setSelectedPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userString = localStorage.getItem("user");
        let userId = null;
        let userObject = null;

        if (userString) {
          userObject = JSON.parse(userString);

          if (userObject && userObject.id) {
            userId = userObject.id;
          }
        }

        if (userId) {
          console.log("Calling getPostsByUserId with userId:", userId);
          const posts = await getPostsByUserId(userId);
          console.log("Fetched posts:", posts);
          setUserPosts(posts);
        } else {
          console.log("UserId is null or undefined, not fetching posts.");
          setUserPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
        setUserPosts([]);
      }
    };

    if (currentView === "myPosts") {
      console.log("Current view is myPosts, attempting to fetch user posts.");
      fetchUserPosts();
    } else {
      console.log("Current view is not myPosts, not fetching user posts.");
    }
  }, [currentView]);

  const refreshAllPosts = async () => {
    await fetchPosts();
    await refetchUserPosts();
  };
  const refetchUserPosts = async () => {
    try {
      const userString = localStorage.getItem("user");
      const userObject = userString ? JSON.parse(userString) : null;
      const userId = userObject?.id;

      if (userId) {
        const posts = await getPostsByUserId(userId);
        setUserPosts(posts);
      }
    } catch (error) {
      console.error("Failed to re-fetch user posts:", error);
    }
  };

  // Filter posts
  const filteredPosts = (apiPosts || []).filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      post.tags?.some((tag) => selectedTags.includes(tag._id)); // Sửa chỗ này

    return matchesSearch && matchesTags;
  });

  // Handlers
  const handleViewChange = (view) => setCurrentView(view);
  const handlePostSelect = (post) => {
    setSelectedPost(post);
    setCurrentView("detail");
  };
  const handlePostCreate = async (newPost) => {
    try {
      const createdPost = await createPost({
        ...newPost,
        author: "user",
        data: new Date().toISOString(),
        like: 0,
        comment: 0,
      });
      setUserPosts([createdPost, ...userPosts]);
      await refetchUserPosts();
      setCurrentView("myPosts");
    } catch (error) {
      console.error("Failed to create post:", error);
      // Add error handling UI here
    }
  };

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

  // Render views
  const allPosts = [...(apiPosts || []), ...userPosts];
  if (currentView === "detail" && selectedPost) {
    const relatedPosts = allPosts
      .filter(
        (post) =>
          post.id !== selectedPost.id &&
          post.tags.some((tag) => selectedPost.tags.includes(tag))
      )
      .slice(0, 3);

    return (
      <BlogDetail
        post={selectedPost}
        relatedPosts={relatedPosts}
        onBack={() => setCurrentView("home")}
        onPostClick={handlePostSelect}
      />
    );
  }

  if (currentView === "create") {
    if (!tags || tags.length === 0) {
      return <div>Loading tags...</div>;
    }
    return (
      <CreateBlog
        onSubmit={handlePostCreate}
        onCancel={() => setCurrentView("home")}
        tags={tags}
      />
    );
  }

  if (currentView === "myPosts") {
    console.log("Rendering Myposts with userPosts:", userPosts);
    return (
      <MyPosts
        posts={userPosts}
        onPostClick={handlePostSelect}
        onBack={() => setCurrentView("home")}
        onCreateNew={() => setCurrentView("create")}
        refetchUserPosts={refreshAllPosts}
      />
    );
  }

  // Home view with sidebar layout
  return (
    <div className="flex gap-6">
      <FilterSidebar
        tags={tags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <FilterBar
          onNavigate={handleViewChange}
          onFilterChange={handleFilterChange}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">Error: {error}</div>
        ) : (
          <BlogList posts={filteredPosts} onPostClick={handlePostSelect} />
        )}
      </div>
    </div>
  );
}

const BlogList = ({ posts, onPostClick }) => {
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
            <BlogCard key={post._id} post={post} onClick={onPostClick} />
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

export default UserBlogPage;
