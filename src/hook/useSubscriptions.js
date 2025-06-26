import { useState, useEffect } from 'react';
import SubscriptionService from '../services/subscriptionService';

const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SubscriptionService.getAllSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (plan_id, subData) => {
    try {
      setLoading(true);
      await SubscriptionService.createSubscription(plan_id, subData);
      await fetchSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (id, subData) => {
    try {
      setLoading(true);
      await SubscriptionService.updateSubscription(id, subData);
      await fetchSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscription = async (id) => {
    try {
      setLoading(true);
      await SubscriptionService.deleteSubscription(id);
      await fetchSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subscription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
};

export default useSubscriptions; 