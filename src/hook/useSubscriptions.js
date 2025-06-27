import { useState, useEffect } from 'react';
import SubscriptionService from '../services/subscriptionService';
import QuitPlanServiceAdmin from '../services/quitPlanServiceAdmin';

const useSubscriptions = () => {
  // State cho subscriptions và plans
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho modal/form
  const [selectedSub, setSelectedSub] = useState(null);
  const [editedSub, setEditedSub] = useState({
    name: '',
    price: '',
    start_date: '',
    end_date: '',
    is_active: true,
    plan_id: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    start_date: '',
    end_date: '',
    plan_id: '',
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const data = await QuitPlanServiceAdmin.getAllQuitPlans();
      setPlans(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách gói');
    }
  };

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SubscriptionService.getAllSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách đăng ký');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchPlans();
  }, []);

  // Modal handlers
  const openEditModal = (sub) => {
    setSelectedSub(sub);
    setIsNew(false);
    setEditedSub({
      name: sub.name,
      price: sub.price,
      start_date: sub.start_date ? new Date(sub.start_date).toISOString().split('T')[0] : '',
      end_date: sub.end_date ? new Date(sub.end_date).toISOString().split('T')[0] : '',
      is_active: sub.is_active,
      plan_id: sub.plan_id,
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedSub({
      name: '',
      price: '',
      start_date: '',
      end_date: '',
      is_active: true,
      plan_id: '',
    });
    setSelectedSub({});
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      name: !editedSub.name ? 'Vui lòng nhập tên đăng ký' : '',
      price: !editedSub.price ? 'Vui lòng nhập giá' : '',
      start_date: !editedSub.start_date ? 'Vui lòng chọn ngày bắt đầu' : '',
      end_date: !editedSub.end_date ? 'Vui lòng chọn ngày kết thúc' : '',
      plan_id: !editedSub.plan_id ? 'Vui lòng chọn gói' : '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  // Save changes (add or edit)
  const handleSaveChanges = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isNew) {
        const { plan_id, ...subscriptionData } = editedSub;
        await SubscriptionService.createSubscription(plan_id, subscriptionData);
      } else {
        await SubscriptionService.updateSubscription(selectedSub._id, editedSub);
      }
      await fetchSubscriptions();
      setSelectedSub(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // Delete subscription
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await SubscriptionService.deleteSubscription(id);
      await fetchSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    plans,
    loading,
    error,
    selectedSub,
    setSelectedSub,
    editedSub,
    setEditedSub,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    subToDelete,
    setSubToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
    fetchSubscriptions,
    fetchPlans,
  };
};

export default useSubscriptions; 