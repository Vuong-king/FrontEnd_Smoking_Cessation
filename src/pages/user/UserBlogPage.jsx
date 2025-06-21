import { useState, useEffect } from "react";
import { usePostData } from "../../hook/usePostData";
import MyPosts from "../../components/user/blog/MyPosts";
import CreateBlog from "../../components/user/blog/CreateBlog";
import UserBlogDetail from "../../components/user/blog/UserBlogDetail";

function UserBlogPage() {
  const {
    createPost,
    getPostsByUserId,
    tags = [],
  } = usePostData();

  const [currentView, setCurrentView] = useState("myPosts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const fetchUserPosts = async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    if (!user?.id) return;

    try {
      const posts = await getPostsByUserId(user.id);
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [currentView]);

  // Kiểm tra và reload khi có thay đổi like
  useEffect(() => {
    const checkForUpdates = () => {
      const shouldReload = localStorage.getItem("should_reload_blog_list");
      if (shouldReload === "true") {
        fetchUserPosts();
        localStorage.removeItem("should_reload_blog_list");
      }
    };

    // Kiểm tra định kỳ mỗi 2 giây
    const interval = setInterval(checkForUpdates, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePostCreate = async (newPost) => {
    try {
      const createdPost = await createPost({
        ...newPost,
        author: "user",
        data: new Date().toISOString(),
        like: 0,
        comment: 0,
      });

      setUserPosts((prev) => [createdPost, ...prev]);
      await fetchUserPosts(); // Refresh posts after creation
      setCurrentView("myPosts");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  if (currentView === "detail" && selectedPost) {
    return (
      <UserBlogDetail
        post={selectedPost}
        onBack={() => {
          setCurrentView("myPosts");
          fetchUserPosts(); // Refresh posts khi quay lại
        }}
        onPostClick={(post) => setSelectedPost(post)}
        relatedPosts={userPosts.filter((p) => p._id !== selectedPost._id)}
      />
    );
  }

  if (currentView === "create") {
    return (
      <CreateBlog
        onSubmit={handlePostCreate}
        onCancel={() => setCurrentView("myPosts")}
        tags={tags}
      />
    );
  }

  return (
    <MyPosts
      posts={userPosts}
      refetchUserPosts={fetchUserPosts} 
      onPostClick={(post) => {
        setSelectedPost(post);
        setCurrentView("detail");
      }}
      onCreateNew={() => setCurrentView("create")}
    />
  );
}

export default UserBlogPage;
