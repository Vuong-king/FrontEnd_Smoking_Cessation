import { useState, useEffect } from "react";
import {
  fetchTagsAPI,
  fetchPostsAPI,
  createPostAPI,
  updatePostAPI,
  deletePostAPI,
  getPostByIdAPI,
  getPostsByUserIdAPI,
  likePostAPI,
  createCommentAPI,
  getCommentsByPostIdAPI,
  updateCommentAPI,
  deleteCommentAPI,
} from "../services/postService";

export function usePostData() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetchTagsAPI();
      const data = response.data;
      if (Array.isArray(data?.data)) setTags(data.data);
      else if (Array.isArray(data?.tags)) setTags(data.tags);
      else if (Array.isArray(data)) setTags(data);
      else setTags([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetchPostsAPI();
      const postsData = response.data.posts || response.data.data || response.data || [];

      const formatted = postsData.map(post => ({
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

      setPosts(formatted);
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

  const createPost = async (data, onSuccess) => {
    try {
      setLoading(true);
      const res = await createPostAPI(data);
      await fetchPosts();
      if (onSuccess) onSuccess(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id, data) => {
    try {
      setLoading(true);
      const res = await updatePostAPI(id, data);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, ...res.data } : post
        )
      );
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    try {
      setLoading(true);
      await deletePostAPI(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPostById = async (id) => {
    try {
      setLoading(true);
      const res = await getPostByIdAPI(id);
      let post = res.data?.data || res.data?.post || res.data;
      if (!post) throw new Error("Post not found");

      return {
        _id: post._id || id,
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
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPostsByUserId = async (userId) => {
    try {
      setLoading(true);
      const res = await getPostsByUserIdAPI(userId);
      const list = res.data?.posts || res.data?.data || res.data || [];
      return list;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId) => {
    try {
      setLoading(true);
      const res = await likePostAPI(postId);
      await fetchPosts();
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (commentData, onSuccess) => {
    try {
      setLoading(true);
      const res = await createCommentAPI(commentData);
      if (onSuccess) onSuccess(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCommentsByPostId = async (postId) => {
    try {
      setLoading(true);
      const res = await getCommentsByPostIdAPI(postId);
      return Array.isArray(res.data)
        ? res.data
        : res.data?.comments || res.data?.data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (commentId, commentData, onSuccess) => {
    try {
      setLoading(true);
      const res = await updateCommentAPI(commentId, commentData);
      if (onSuccess) onSuccess(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId, onSuccess) => {
    try {
      setLoading(true);
      await deleteCommentAPI(commentId);
      if (onSuccess) onSuccess();
    } catch (err) {
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
