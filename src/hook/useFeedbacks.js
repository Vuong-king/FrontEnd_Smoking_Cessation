import { useState, useEffect } from 'react';
import FeedbackService from '../services/feedbackService';

const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setFeedbacks(FeedbackService.getAllFeedbacks());
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const deleteFeedback = (id) => {
    const updated = FeedbackService.deleteFeedback(id);
    setFeedbacks(updated);
    showToast('Feedback deleted.', 'error');
  };

  return {
    feedbacks,
    toast,
    showToast,
    deleteFeedback,
  };
};

export default useFeedbacks; 