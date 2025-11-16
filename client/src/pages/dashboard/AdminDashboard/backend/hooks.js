import { dummyIssues, dummyDepartments } from "../backend/constant";

/*
  🧠 These functions simulate backend calls.
  They can be replaced later with real API requests.
*/

// Calculates dashboard statistics
export const calculateStats = (issues) => {
  const total = issues.length;
  const pending = issues.filter((i) => i.status === "pending").length;
  const inProgress = issues.filter((i) => i.status === "inprogress").length;
  const resolved = issues.filter((i) => i.status === "resolved").length;
  const todayReports = issues.filter(
    (i) => new Date(i.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return { total, pending, inProgress, resolved, todayReports };
};
