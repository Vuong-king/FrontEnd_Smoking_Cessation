import { useState, useEffect } from 'react';
import StageService from '../services/stageService';
import QuitPlanServiceAdmin from '../services/quitPlanServiceAdmin';

const useStages = (planId) => {
  const [stages, setStages] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho modal/form
  const [selectedStage, setSelectedStage] = useState(null);
  const [editedStage, setEditedStage] = useState({
    plan_id: '',
    title: '',
    description: '',
    stage_number: '',
    start_date: '',
    end_date: '',
    is_completed: false,
    cigarette_limit: 0
  });
  const [errors, setErrors] = useState({
    plan_id: '',
    title: '',
    description: '',
    stage_number: '',
    start_date: '',
    end_date: '',
    cigarette_limit: 0
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stageToDelete, setStageToDelete] = useState(null);

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const data = await QuitPlanServiceAdmin.getAllQuitPlans();
      setPlans(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách kế hoạch');
    }
  };

  // Fetch stages (all hoặc theo planId)
  const fetchStages = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (planId) {
        data = await StageService.getStagesByPlanId(planId);
      } else {
        data = await StageService.getAllStages();
      }
      setStages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách giai đoạn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
    fetchPlans();
  }, [planId]);

  // Modal handlers
  const openEditModal = (stage) => {
    setSelectedStage(stage);
    setIsNew(false);
    setEditedStage({
      plan_id: stage.plan_id,
      title: stage.title,
      description: stage.description,
      stage_number: stage.stage_number,
      start_date: stage.start_date ? new Date(stage.start_date).toISOString().split('T')[0] : '',
      end_date: stage.end_date ? new Date(stage.end_date).toISOString().split('T')[0] : '',
      is_completed: stage.is_completed,
      cigarette_limit: stage.cigarette_limit !== undefined ? stage.cigarette_limit : 0,
    });
  };

  const openNewModal = () => {
    setIsNew(true);
    setEditedStage({
      plan_id: planId || '',
      title: '',
      description: '',
      stage_number: '',
      start_date: '',
      end_date: '',
      is_completed: false,
      cigarette_limit: 0,
    });
    setSelectedStage({});
  };

  // Validate form
  const validate = () => {
    const newErrors = {
      plan_id: !editedStage.plan_id ? 'Vui lòng chọn một kế hoạch' : '',
      title: !editedStage.title ? 'Vui lòng nhập tiêu đề' : '',
      description: !editedStage.description ? 'Vui lòng nhập mô tả' : '',
      stage_number: !editedStage.stage_number ? 'Vui lòng nhập số thứ tự giai đoạn' : '',
      start_date: !editedStage.start_date ? 'Vui lòng chọn ngày bắt đầu' : '',
      end_date: !editedStage.end_date ? 'Vui lòng chọn ngày kết thúc' : '',
      cigarette_limit:
        editedStage.cigarette_limit === '' || editedStage.cigarette_limit === undefined || isNaN(Number(editedStage.cigarette_limit))
          ? 'Vui lòng nhập giới hạn điếu thuốc'
          : Number(editedStage.cigarette_limit) < 0
          ? 'Giới hạn điếu thuốc phải >= 0'
          : '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Save changes (add or edit)
  const handleSaveChanges = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isNew) {
        await StageService.createStage(editedStage);
      } else {
        await StageService.updateStage(selectedStage._id, editedStage);
      }
      await fetchStages();
      setSelectedStage(null);
      setIsNew(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu giai đoạn');
    } finally {
      setLoading(false);
    }
  };

  // Delete stage
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await StageService.deleteStage(id);
      await fetchStages();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa giai đoạn');
    } finally {
      setLoading(false);
    }
  };

  return {
    stages,
    plans,
    loading,
    error,
    selectedStage,
    setSelectedStage,
    editedStage,
    setEditedStage,
    errors,
    setErrors,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    stageToDelete,
    setStageToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
    fetchStages,
    fetchPlans,
  };
};

export default useStages; 