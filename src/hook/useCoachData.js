import { useState, useEffect, useCallback } from 'react';
import CoachService from '../services/CoachService';

export function useCoachData() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const data = await CoachService.getAllCoaches();
      setCoaches(data);
      return data; // Thêm dòng này để trả về dữ liệu
    } catch (err) {
      console.error(err);
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

    const handleRequest = async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      return await requestFn();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCoachProfile = useCallback(
    async (coachData) =>
      handleRequest(() => CoachService.createCoachProfile(coachData)),
    []
  );
 const getCoachById = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await CoachService.getCoachById(id);
      return data;
    } catch (err) {
      setError(err);
      if (err?.response?.status === 404) return null;
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoachProfile = useCallback(
    async (id, coachData) =>
      handleRequest(() => CoachService.updateCoachProfile(id, coachData)),
    []
  );

  const deleteCoachProfile = useCallback(
    async (id) => handleRequest(() => CoachService.deleteCoachProfile(id)),
    []
  );
  return {
    coaches,
    loading,
    error,
    getAllCoaches: fetchCoaches,
    refetch: fetchCoaches,
    createCoachProfile,
    getCoachById,
    updateCoachProfile,
    deleteCoachProfile,
  };
}
