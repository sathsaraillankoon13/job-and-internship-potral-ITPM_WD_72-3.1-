import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { closeJob as closeJobRequest, createJob, createSubmission, deleteJob as deleteJobRequest, fetchAnalytics, fetchJobs } from "../api";

const EmployerJobsContext = createContext(null);

export function EmployerJobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({ total: 0, scheduled: 0, active: 0, expired: 0, closed: 0, draft: 0, applicants: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [jobsData, analyticsData] = await Promise.all([fetchJobs(), fetchAnalytics()]);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setCounts({
        total: analyticsData.totalJobPostings || 0,
        scheduled: analyticsData.scheduledJobs || 0,
        active: analyticsData.activeJobs || 0,
        expired: analyticsData.expiredJobs || 0,
        closed: analyticsData.closedJobs || 0,
        draft: analyticsData.draftJobs || 0,
        applicants: analyticsData.totalApplicants || 0,
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load employer data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addJob = useCallback(async (payload) => {
    await createJob(payload);
    await refreshData();
  }, [refreshData]);

  const deleteJob = useCallback(async (id) => {
    await deleteJobRequest(id);
    await refreshData();
  }, [refreshData]);

  const closeJob = useCallback(async (id) => {
    await closeJobRequest(id);
    await refreshData();
  }, [refreshData]);

  const addApplicationToJob = useCallback(async (payload) => {
    await createSubmission(payload);
    await refreshData();
  }, [refreshData]);

  const value = useMemo(
    () => ({ jobs, counts, loading, error, addJob, closeJob, deleteJob, addApplicationToJob, refreshData }),
    [jobs, counts, loading, error, addJob, closeJob, deleteJob, addApplicationToJob, refreshData]
  );

  return <EmployerJobsContext.Provider value={value}>{children}</EmployerJobsContext.Provider>;
}

export function useEmployerJobs() {
  const ctx = useContext(EmployerJobsContext);
  if (!ctx) {
    throw new Error("useEmployerJobs must be used within EmployerJobsProvider");
  }
  return ctx;
}
