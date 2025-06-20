import { useState, useEffect } from "react";
import api from "../api";

export function usePostData() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Đưa hai hàm này lên trước useEffect
  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tags");
      if (Array.isArray(response.data.data)) {
        setTags(response.data.data);
      } else if (Array.isArray(response.data.tags)) {
        setTags(response.data.tags);
      } else if (Array.isArray(response.data)) {
        setTags(response.data);
      } else {
        setTags([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/posts");
      
      // Format posts để đảm bảo có đầy đủ dữ liệu
      const postsData = response.data.posts || response.data.data || response.data || [];
      const formattedPosts = postsData.map(post => ({
        _id: post._id || post.id,
        title: post.title || post.content?.substring(0, 50) || "Untitled",
        content: post.content || "",
        image: post.image || post.banner || post.thumbnail || "/placeholder.svg",
        post_date: post.post_date || post.createdAt || new Date().toISOString(),
        user_id: post.user_id || { name: "Anonymous" },
        tags: Array.isArray(post.tags) ? post.tags : [],
        reaction_count: post.reaction_count || 0,
        comment_count: post.comment_count || 0,
        post_type: post.post_type || "blog",
        like_user_ids: Array.isArray(post.like_user_ids) ? post.like_user_ids : [],
      }));
      
      setPosts(formattedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  const createPost = async (postData, onSuccess) => {
    // postData chỉ nên có: content, image, tag
    try {
      setLoading(true);
      const response = await api.post("/posts/create", postData);
      await fetchPosts(); // Tự động làm mới danh sách
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, postData) => {
    try {
      setLoading(true);
      const response = await api.put(`/posts/${postId}`, postData);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, ...response.data } : post
        )
      );
      return response.data;
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      setLoading(true);
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPostById = async (postId) => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${postId}`);
      console.log("API Response:", response);

      // Handle different response structures
      let postData;
      if (response.data?.data) {
        postData = response.data.data;
      } else if (response.data?.post) {
        postData = response.data.post;
      } else {
        postData = response.data;
      }

      // Validate post data
      if (!postData) {
        throw new Error("Post not found");
      }

      // Ensure required fields exist with proper fallbacks
      const formattedPost = {
        _id: postData._id || postId,
        title:
          postData.title || postData.content?.substring(0, 50) || "Untitled",
        content: postData.content || "",
        image:
          postData.image ||
          postData.banner ||
          postData.thumbnail ||
          "/placeholder.svg",
        post_date:
          postData.post_date || postData.createdAt || new Date().toISOString(),
        user_id: postData.user_id || { name: "Anonymous" },
        tags: Array.isArray(postData.tags) ? postData.tags : [],
        reaction_count: postData.reaction_count || 0,
        comment_count: postData.comment_count || 0,
        post_type: postData.post_type || "blog",
        like_user_ids: Array.isArray(postData.like_user_ids) ? postData.like_user_ids : [],
      };

      console.log("Formatted post data:", formattedPost);
      return formattedPost;
    } catch (err) {
      console.error("Error loading post:", err);
      setError(err.message || "Có lỗi xảy ra khi tải bài viết");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getPostsByUserId = async (userId) => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/user/${userId}`);
      console.log("Posts by user ID:", response.data);

      let postList;
      if (Array.isArray(response.data)) {
        postList = response.data;
      } else if (Array.isArray(response.data.posts)) {
        postList = response.data.posts;
      } else if (Array.isArray(response.data.data)) {
        postList = response.data.data;
      } else {
        postList = [];
      }

      return postList;
    } catch (err) {
      console.error("Error fetching posts by user ID:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId) => {
    try {
      setLoading(true);
      const response = await api.post(`/posts/like/${postId}`);
      await fetchPosts();
      return response.data;
    } catch (err) {
      console.error("Error liking post:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createComment = async ( commentData, onSuccess) => {
    try{
      setLoading(true);
      const response = await api.post(`/comments/create`, commentData);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    }catch (err) {
    console.error("Error creating comment:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
  }

const getCommentsByPostId = async (postId) => {
  try {
    setLoading(true);
    const response = await api.get(`/comments/post/${postId}`);
    
    // Giả sử API trả về danh sách comment trong response.data
    const commentList = Array.isArray(response.data)
      ? response.data
      : response.data.comments || response.data.data || [];

    return commentList;
  } catch (err) {
    console.error("Error fetching comments:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

const updateComment = async (commentId, commentData, onSuccess) => {
  try {
    setLoading(true);
    const response = await api.put(`/comments/${commentId}`, commentData);
    if (onSuccess) onSuccess(response.data);
    return response.data;
  } catch (err) {
    console.error("Error updating comment:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

const deleteComment = async (commentId, onSuccess) => {
  try {
    setLoading(true);
    await api.delete(`/comments/${commentId}`);
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error("Error deleting comment:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  return {
    posts,
    tags,
    loading,
    error,
    fetchTags,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    getPostsByUserId,
    likePost,
    refetchPosts: fetchPosts,
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
  };
}
