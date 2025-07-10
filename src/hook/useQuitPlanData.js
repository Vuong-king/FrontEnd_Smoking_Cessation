import { useState, useCallback} from "react";
import quitPlanService from "../services/quitPlanService"

export function useQuitPlanData() {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publicPlans, setPublicPlans] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [myUsers, setMyUsers] = useState([]);

  const callService = useCallback(async (serviceFn, ...params) => {
    setLoading(true);
    setError(null);
    try {
      return await serviceFn(...params);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- Fetch Wrapper Functions ----------

  const fetchAndSet = async (serviceFn, setter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviceFn();
      setter(data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchQuitPlans = useCallback(
    () => fetchAndSet(quitPlanService.getAllQuitPlans, setQuitPlans),
    []
  );
  const fetchPublicPlans = useCallback(
    () => fetchAndSet(quitPlanService.getPublicQuitPlans, setPublicPlans),
    []
  );
  const fetchMyRequests = useCallback(
    () => fetchAndSet(quitPlanService.getMyQuitPlanRequests, setMyRequests),
    []
  );
  const fetchAllRequests = useCallback(
    () => fetchAndSet(quitPlanService.getAllQuitPlanRequests, setAllRequests),
    []
  );
  const fetchMyUsers = useCallback(
    () => fetchAndSet(quitPlanService.getMyUsers, setMyUsers),
    []
  );

  // ---------- CRUD with refresh ----------
  const createWithRefresh = async (data) => {
    const result = await callService(quitPlanService.createQuitPlan, data);
    await fetchQuitPlans();
    return result;
  };

  const updateWithRefresh = async (id, data) => {
    const result = await callService(quitPlanService.updateQuitPlan, id, data);
    await fetchQuitPlans();
    return result;
  };

  const deleteWithRefresh = async (id) => {
    const result = await callService(quitPlanService.deleteQuitPlan, id);
    await fetchQuitPlans();
    return result;
  };

  const sendRequestWithRefresh = async (data) => {
    const result = await callService(quitPlanService.sendQuitPlanRequest, data);
    await fetchMyRequests();
    return result;
  };

  const cancelRequestWithRefresh = async (id) => {
    const result = await callService(quitPlanService.cancelQuitPlanRequest, id);
    await fetchMyRequests();
    return result;
  };

  const approveRequestWithRefresh = async (id, data) => {
    const result = await callService(
      quitPlanService.approveQuitPlanRequest,
      id,
      data
    );
    await Promise.all([fetchAllRequests(), fetchMyUsers()]);
    return result;
  };

  const rejectRequestWithRefresh = async (id, data) => {
    const result = await callService(
      quitPlanService.rejectQuitPlanRequest,
      id,
      data
    );
    await fetchAllRequests();
    return result;
  };

  // Memoize các function để tránh re-render
  const memoizedGetQuitPlanByUserId = useCallback(
    (userId) => callService(quitPlanService.getQuitPlanByUserId, userId),
    [callService]
  );

  return {
    // State
    quitPlans,
    publicPlans,
    myRequests,
    allRequests,
    myUsers,
    loading,
    error,

    // Fetch methods
    fetchQuitPlans,
    fetchPublicPlans,
    fetchMyRequests,
    fetchAllRequests,
    fetchMyUsers,

    // CRUD
    createQuitPlan: createWithRefresh,
    getAllQuitPlans: () => callService(quitPlanService.getAllQuitPlans),
    getQuitPlanById: (id) => callService(quitPlanService.getQuitPlanById, id),
    updateQuitPlan: updateWithRefresh,
    deleteQuitPlan: deleteWithRefresh,
    getQuitPlanByUserId: memoizedGetQuitPlanByUserId,

    // Public plans
    getPublicQuitPlans: () => callService(quitPlanService.getPublicQuitPlans),
    adoptPublicQuitPlan: (planId, userData) =>
      callService(quitPlanService.adoptPublicQuitPlan, planId, userData),

    // Coach/user management
    getMyUsers: () => callService(quitPlanService.getMyUsers),
    sendQuitPlanRequest: sendRequestWithRefresh,
    getAllQuitPlanRequests: () =>
      callService(quitPlanService.getAllQuitPlanRequests),
    getMyQuitPlanRequests: () =>
      callService(quitPlanService.getMyQuitPlanRequests),
    cancelQuitPlanRequest: cancelRequestWithRefresh,
    approveQuitPlanRequest: approveRequestWithRefresh,
    rejectQuitPlanRequest: rejectRequestWithRefresh,
  };
}

export default useQuitPlanData;
