import { useState, useEffect } from "react";
import coachRequestService from "../services/coachRequestService";
import api from "../api";

const useCoachRequests = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ user: "" });
  const [errors, setErrors] = useState({ user: "" });

  useEffect(() => {
    fetchRequests();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user");
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lấy danh sách người dùng");
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await coachRequestService.getAllRequests();
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lấy danh sách lời mời");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setIsNew(true);
    setEditingRequest({});
    setFormData({ user: "" });
  };

  const handleEdit = (request) => {
    setIsNew(false);
    setEditingRequest(request);
    setSelectedUser(users.find(u => u.id === request.user_id?._id));
    setFormData({ user: request.user_id?._id });
  };

  const handleUserChange = (userId) => {
    setSelectedUser(users.find(u => u.id === userId));
    setFormData({ ...formData, user: userId });
  };

  const validate = () => {
    const newErrors = { user: !formData.user ? "Vui lòng chọn người dùng" : "" };
    setErrors(newErrors);
    return !Object.values(newErrors).some(e => e !== "");
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
        console.log(formData);
      setLoading(true);
      await coachRequestService.sendInvite(formData.user);
      await fetchRequests();
      setEditingRequest(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể gửi lời mời");
    } finally {
      setLoading(false);
    }
  };

  // Không có API xóa lời mời, chỉ có respond (accept/reject)
  // Nếu muốn reject, dùng respondInvite với action: "reject"
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await coachRequestService.respondInvite(id, "reject");
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể từ chối lời mời");
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    users,
    loading,
    error,
    editingRequest,
    setEditingRequest,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    requestToDelete,
    setRequestToDelete,
    selectedUser,
    setSelectedUser,
    formData,
    setFormData,
    errors,
    setErrors,
    fetchRequests,
    fetchUsers,
    handleNew,
    handleEdit,
    handleUserChange,
    handleSave,
    handleDelete,
  };
};

export default useCoachRequests;