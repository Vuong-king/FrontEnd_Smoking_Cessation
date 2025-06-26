import { useState, useEffect } from 'react';
import ProgressService from '../services/progressService';

const useProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProgressService.getAllProgress();
      setProgress(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  const createProgress = async (progressData) => {
    try {
      setLoading(true);
      await ProgressService.createProgress(progressData);
      await fetchProgress();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create progress');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (id, progressData) => {
    try {
      setLoading(true);
      await ProgressService.updateProgress(id, progressData);
      await fetchProgress();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const deleteProgress = async (id) => {
    try {
      setLoading(true);
      await ProgressService.deleteProgress(id);
      await fetchProgress();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    progress,
    loading,
    error,
    fetchProgress,
    createProgress,
    updateProgress,
    deleteProgress,
  };
};

export default useProgress; 