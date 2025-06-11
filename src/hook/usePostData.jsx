import { useState, useEffect } from "react";
import api from "../api";

export function usePostData() {
  const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchTags();

  }, []);
  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tags");
      console.log("Tags API response:", response.data);
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
      console.error("Error fetching tags:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/posts");
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    // postData chỉ nên có: content, image, tag
    try {
      setLoading(true);
      const response = await api.post("/posts/create", postData);
      setPosts((prev) => [...prev, response.data]);
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

  return {
    posts,
    tags,
    loading,
    error,
    fetchPosts,
    fetchTags,
    createPost,
    updatePost,
    deletePost,
  };
}
