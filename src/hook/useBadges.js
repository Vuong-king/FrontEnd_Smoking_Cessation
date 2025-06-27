import { useState, useEffect } from 'react';
import BadgesService from '../services/badgesService';

const useBadges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho modal/form
  const [editingBadge, setEditingBadge] = useState(null);
  const [newData, setNewData] = useState({
    name: '',
    condition: '',
    tier: 'Bronze',
    point_value: 0,
    url_image: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    condition: '',
    tier: '',
    point_value: '',
    url_image: ''
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BadgesService.getAllBadges();
      setBadges(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch badges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  // Modal handlers
  const handleEdit = (badge) => {
    setEditingBadge(badge);
    setNewData({
      name: badge.name,
      condition: badge.condition,
      tier: badge.tier,
      point_value: badge.point_value,
      url_image: badge.url_image
    });
    setIsNew(false);
  };

  const handleNew = () => {
    setNewData({
      name: '',
      condition: '',
      tier: 'Bronze',
      point_value: 0,
      url_image: ''
    });
    setErrors({
      name: '',
      condition: '',
      tier: '',
      point_value: '',
      url_image: ''
    });
    setEditingBadge({});
    setIsNew(true);
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      name: !newData.name ? 'Vui lòng nhập tên huy hiệu' : '',
      condition: !newData.condition ? 'Vui lòng nhập điều kiện' : '',
      tier: !newData.tier ? 'Vui lòng chọn cấp bậc' : '',
      point_value: !newData.point_value && newData.point_value !== 0 ? 'Vui lòng nhập giá trị điểm' :
        newData.point_value < 0 ? 'Giá trị điểm không được âm' : '',
      url_image: ''
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Save changes (add or edit)
  const handleSave = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isNew) {
        await BadgesService.createBadge(newData);
      } else {
        await BadgesService.updateBadge(editingBadge._id, newData);
      }
      await fetchBadges();
      setEditingBadge(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu huy hiệu');
    } finally {
      setLoading(false);
    }
  };

  // Delete badge
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await BadgesService.deleteBadge(id);
      await fetchBadges();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa huy hiệu');
    } finally {
      setLoading(false);
    }
  };

  return {
    badges,
    loading,
    error,
    editingBadge,
    setEditingBadge,
    newData,
    setNewData,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    badgeToDelete,
    setBadgeToDelete,
    handleEdit,
    handleNew,
    handleSave,
    handleDelete,
    fetchBadges,
  };
};

export default useBadges;
