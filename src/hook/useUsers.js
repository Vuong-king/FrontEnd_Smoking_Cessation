import { useState, useEffect } from 'react';
import UserService from '../services/userService';

const useUsers = () => {
  // Data state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('admin');

  // Modal/form state
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', role: '', avatar_url: '' });
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    role: '',
    avatar_url: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getAllUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [role]);

  // Modal handlers
  const openNewModal = () => {
    setShowModal(true);
    setNewUser({ email: '', name: '', role: '', avatar_url: '' });
    setEditingId(null);
    setErrors({ email: '', name: '', role: '', avatar_url: '' });
  };

  const openEditModal = (u) => {
    setNewUser({
      email: u.email,
      name: u.name,
      role: u.role,
      avatar_url: u.avatar_url
    });
    setErrors({ email: '', name: '', role: '', avatar_url: '' });
    setEditingId(u.id);
    setShowModal(true);
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      email: !newUser.email ? 'Please enter an email' :
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email) ? 'Please enter a valid email' : '',
      name: !newUser.name ? 'Please enter a name' : '',
      role: editingId && !newUser.role ? 'Please select a role' : '',
      avatar_url: ''
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Save changes (add or edit)
  const handleSave = async () => {
    if (!validate()) return;
    if (editingId) {
      await updateUser(editingId, { ...newUser });
    } else {
      await createUser({
        ...newUser,
        role: role,
        avatar_url: newUser.avatar_url || 'https://example.com/default-avatar.png'
      });
    }
    setNewUser({ email: '', name: '', role: '', avatar_url: '' });
    setErrors({ email: '', name: '', role: '', avatar_url: '' });
    setEditingId(null);
    setShowModal(false);
  };

  // CRUD
  const createUser = async (userData) => {
    try {
      setLoading(true);
      await UserService.createUser(userData);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      await UserService.updateUser(id, userData);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await UserService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    role,
    setRole,
    showModal,
    setShowModal,
    newUser,
    setNewUser,
    errors,
    setErrors,
    editingId,
    setEditingId,
    showConfirm,
    setShowConfirm,
    userToDelete,
    setUserToDelete,
    openNewModal,
    openEditModal,
    handleSave,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers,
  };
};

export default useUsers; 