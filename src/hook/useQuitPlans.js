import { useState, useEffect } from 'react';
import QuitPlanServiceAdmin from '../services/quitPlanServiceAdmin';

const useQuitPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuitPlanServiceAdmin.getAllQuitPlans();
      setPlans(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch quit plans');
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData) => {
    try {
      setLoading(true);
      await QuitPlanServiceAdmin.createQuitPlan(planData);
      await fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quit plan');
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (id, planData) => {
    try {
      setLoading(true);
      await QuitPlanServiceAdmin.updateQuitPlan(id, planData);
      await fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quit plan');
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id) => {
    try {
      setLoading(true);
      await QuitPlanServiceAdmin.deleteQuitPlan(id);
      await fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete quit plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
};

export default useQuitPlans;
