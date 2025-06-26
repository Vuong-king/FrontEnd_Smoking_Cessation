import { useState, useEffect } from 'react';
import BadgesService from '../services/badgesService';

const useBadges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const createBadge = async (badgeData) => {
    try {
      setLoading(true);
      await BadgesService.createBadge(badgeData);
      await fetchBadges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create badge');
    } finally {
      setLoading(false);
    }
  };

  const updateBadge = async (id, badgeData) => {
    try {
      setLoading(true);
      await BadgesService.updateBadge(id, badgeData);
      await fetchBadges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update badge');
    } finally {
      setLoading(false);
    }
  };

  const deleteBadge = async (id) => {
    try {
      setLoading(true);
      await BadgesService.deleteBadge(id);
      await fetchBadges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete badge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return {
    badges,
    loading,
    error,
    fetchBadges,
    createBadge,
    updateBadge,
    deleteBadge,
  };
};

export default useBadges;
