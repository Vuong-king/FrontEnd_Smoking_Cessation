import { useState, useEffect } from "react";
import api from "../api";

export function useQuitPlanData() {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuitPlans();
  }, []);

  const fetchQuitPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quitPlan");

      console.log("QuitPlan API response:", response.data);

      if (Array.isArray(response.data)) {
        setQuitPlans(response.data);
      } else if (Array.isArray(response.data.data)) {
        setQuitPlans(response.data.data);
      } else {
        setQuitPlans([]);            
      }

    } catch (err) {
      console.error("Error fetching quit plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    quitPlans,
    loading,
    error,
    fetchQuitPlans,
  };
}
