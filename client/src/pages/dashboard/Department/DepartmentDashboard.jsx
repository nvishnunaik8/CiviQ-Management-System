'use client';
import React, { useState, useEffect } from "react";
import { Box, Select, MenuItem, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Map as MapIcon, List } from "lucide-react";
import { dummyIssues } from "./dummyIssues";
import StatsCards from "./StatsCards";
import IssueTable from "./IssueTable";
import Charts from "./Charts";
import MapView from "./MapView";
import { ThemeContext, ThemeProvider } from "../../../Context/ThemeContext";
import { useContext } from "react";
export default function DepartmentDashboard() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inprogress: 0, resolved: 0 });
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [viewMode, setViewMode] = useState("map");

  useEffect(() => {
    setIssues(dummyIssues);
    updateStats(dummyIssues);
  }, []);

  const updateStats = (issuesList) => {
    setStats({
      total: issuesList.length,
      pending: issuesList.filter((i) => i.status === "pending").length,
      inprogress: issuesList.filter((i) => i.status === "inprogress").length,
      resolved: issuesList.filter((i) => i.status === "resolved").length,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return { color: "#F59E0B", borderColor: "#F59E0B", backgroundColor: isDark ? "#663E00" : "#FFF4E5" };
      case "inprogress": return { color: "#3B82F6", borderColor: "#3B82F6", backgroundColor: isDark ? "#0D1F33" : "#E5F0FF" };
      case "resolved": return { color: "#10B981", borderColor: "#10B981", backgroundColor: isDark ? "#064E3B" : "#E5FFE5" };
      default: return { color: "#6B7280", borderColor: "#6B7280", backgroundColor: isDark ? "#333" : "#F0F0F0" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <span>🕒</span>;
      case "inprogress": return <span>⚠️</span>;
      case "resolved": return <span>✅</span>;
      default: return null;
    }
  };

  const filteredIssues = issues.filter((i) => (statusFilter === "all" || i.status === statusFilter) && (categoryFilter === "all" || i.category === categoryFilter));
  const categories = [...new Set(issues.map((i) => i.category))];

  const handleStatusChange = (issueId, newStatus) => {
    const updated = issues.map((i) => (i.issue_id === issueId ? { ...i, status: newStatus } : i));
    setIssues(updated);
    updateStats(updated);
    if (selectedIssue?.issue_id === issueId) setSelectedIssue({ ...selectedIssue, status: newStatus });
  };

  return (
   <Box
  p={4}
  bgcolor={isDark ? "#121212" : "#f9f9f9"}
  color={isDark ? "#fff" : "#000"}
>
  {/* Header */}
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h4">Department Dashboard</Typography>

    {/* Theme Toggle Button */}
    <button
      onClick={toggleTheme}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        color: isDark ? "#fff" : "#000"
      }}
    >
      {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  </Box>

  {/* Stats Cards */}
  <StatsCards stats={stats} loading={false} getStatusColor={getStatusColor} />

  {/* Filters & View Toggle */}
  <Box display="flex" gap={2} my={2} flexWrap="wrap">
    <Select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      sx={{
        backgroundColor: isDark ? "#1E1E2F" : "#fff",
        color: isDark ? "#fff" : "#000",
        "& .MuiSvgIcon-root": { color: isDark ? "#fff" : "#000" },
        "& .MuiSelect-select": { padding: "8px 32px 8px 12px" },
        "& fieldset": { borderColor: isDark ? "#555" : "#ccc" }
      }}
    >
      <MenuItem value="all" sx={{ backgroundColor: isDark ? "#1E1E2F" : "#fff", color: isDark ? "#fff" : "#000" }}>All Status</MenuItem>
      <MenuItem value="pending" sx={{ backgroundColor: isDark ? "#1E1E2F" : "#fff", color: isDark ? "#fff" : "#000" }}>Pending</MenuItem>
      <MenuItem value="inprogress" sx={{ backgroundColor: isDark ? "#1E1E2F" : "#fff", color: isDark ? "#fff" : "#000" }}>In Progress</MenuItem>
      <MenuItem value="resolved" sx={{ backgroundColor: isDark ? "#1E1E2F" : "#fff", color: isDark ? "#fff" : "#000" }}>Resolved</MenuItem>
    </Select>

    <Select
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      sx={{
        backgroundColor: isDark ? "#1E1E2F" : "#fff",
        color: isDark ? "#fff" : "#000",
        "& .MuiSvgIcon-root": { color: isDark ? "#fff" : "#000" },
        "& fieldset": { borderColor: isDark ? "#555" : "#ccc" }
      }}
    >
      <MenuItem value="all" sx={{ backgroundColor: isDark ? "#1E1E2F" : "#fff", color: isDark ? "#fff" : "#000" }}>All Categories</MenuItem>
      {categories.map((c) => (
        <MenuItem key={c} value={c} sx={{ backgroundColor: isDark ? "#1E1E2F" : "#fff", color: isDark ? "#fff" : "#000" }}>
          {c}
        </MenuItem>
      ))}
    </Select>

    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={(e, val) => val && setViewMode(val)}
      sx={{ backgroundColor: isDark ? "#1E1E2F" : "#fff", borderRadius: 1 }}
    >
      <ToggleButton
        value="map"
        sx={{
          color: isDark ? "#fff" : "#000",
          "&.Mui-selected": { backgroundColor: "#3B82F6", color: "#fff" },
          "&:hover": { backgroundColor: isDark ? "#333" : "#eee" }
        }}
      >
        <MapIcon size={16} /> Map
      </ToggleButton>

      <ToggleButton
        value="list"
        sx={{
          color: isDark ? "#fff" : "#000",
          "&.Mui-selected": { backgroundColor: "#3B82F6", color: "#fff" },
          "&:hover": { backgroundColor: isDark ? "#333" : "#eee" }
        }}
      >
        <List size={16} /> List
      </ToggleButton>
    </ToggleButtonGroup>
  </Box>

  {/* Main View */}
  {viewMode === "map" ? (
    <MapView issues={filteredIssues} getStatusColor={getStatusColor} />
  ) : (
    <IssueTable issues={filteredIssues} setSelectedIssue={setSelectedIssue} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
  )}

  {selectedIssue && (
    <Box mt={2} p={2} borderRadius={2} border={`1px solid ${isDark ? "#444" : "#ccc"}`}>
      <Typography variant="h6">{selectedIssue.title}</Typography>
      <Typography>Status: {selectedIssue.status}</Typography>
      <Select
        value={selectedIssue.status}
        onChange={(e) => handleStatusChange(selectedIssue.issue_id, e.target.value)}
        sx={{
          backgroundColor: isDark ? "#1E1E2F" : "#fff",
          color: isDark ? "#fff" : "#000",
          "& .MuiSvgIcon-root": { color: isDark ? "#fff" : "#000" },
          "& fieldset": { borderColor: isDark ? "#555" : "#ccc" }
        }}
      >
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="inprogress">In Progress</MenuItem>
        <MenuItem value="resolved">Resolved</MenuItem>
      </Select>
    </Box>
  )}

  <Charts stats={stats} issues={issues} />
</Box>

  );
}
