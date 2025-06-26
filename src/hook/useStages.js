import { useState, useEffect } from 'react';
import StageService from '../services/stageService';

const useStages = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StageService.getAllStages();
      setStages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stages');
    } finally {
      setLoading(false);
    }
  };

  const createStage = async (stageData) => {
    try {
      setLoading(true);
      await StageService.createStage(stageData);
      await fetchStages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create stage');
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (id, stageData) => {
    try {
      setLoading(true);
      await StageService.updateStage(id, stageData);
      await fetchStages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stage');
    } finally {
      setLoading(false);
    }
  };

  const deleteStage = async (id) => {
    try {
      setLoading(true);
      await StageService.deleteStage(id);
      await fetchStages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete stage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  return {
    stages,
    loading,
    error,
    fetchStages,
    createStage,
    updateStage,
    deleteStage,
  };
};

export default useStages; 