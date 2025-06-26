import { useState, useEffect } from 'react';
import NotificationService from '../services/notificationService';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await NotificationService.getAllNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (notificationData) => {
    try {
      setLoading(true);
      await NotificationService.createNotification(notificationData);
      await fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  const updateNotification = async (id, notificationData) => {
    try {
      setLoading(true);
      await NotificationService.updateNotification(id, notificationData);
      await fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update notification');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      setLoading(true);
      await NotificationService.deleteNotification(id);
      await fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notification');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
  };
};

export default useNotifications; 