// services/postService.js
import api from "../api";

// Tags
export const fetchTagsAPI = () => api.get("/tags");

// Posts
export const fetchPostsAPI = () => api.get("/posts");
export const createPostAPI = (data) => api.post("/posts/create", data);
export const updatePostAPI = (id, data) => api.put(`/posts/${id}`, data);
export const deletePostAPI = (id) => api.delete(`/posts/${id}`);
export const getPostByIdAPI = (id) => api.get(`/posts/${id}`);
export const getPostsByUserIdAPI = (userId) => api.get(`/posts/user/${userId}`);
export const likePostAPI = (postId) => api.post(`/posts/like/${postId}`);

// Comments
export const createCommentAPI = (data) => api.post("/comments/create", data);
export const getCommentsByPostIdAPI = (postId) => api.get(`/comments/post/${postId}`);
export const updateCommentAPI = (commentId, data) => api.put(`/comments/${commentId}`, data);
export const deleteCommentAPI = (commentId) => api.delete(`/comments/${commentId}`);
