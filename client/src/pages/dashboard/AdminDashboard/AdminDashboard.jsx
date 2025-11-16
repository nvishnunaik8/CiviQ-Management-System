import { useState, useEffect, useContext } from "react";
import {
  CssBaseline,
  Box,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from "@mui/material";
import toast from "react-hot-toast";

import { DarkMode, LightMode, Dashboard, ListAlt, Map, Apartment } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import IssuesList from "./IssuesList";
import IssueModal from "./IssueModal";
import Departments from "./Departments";
import MapIssues from "./MapIssues";
import { navigationItems } from "../AdminDashboard/backend/constant";
import { calculateStats } from "../AdminDashboard/backend/hooks";
import { ThemeContext } from "../../../Context/ThemeContext";
import {useNavigate} from "react-router-dom";
export default function AdminDashboard() {
  const { isDark, toggleTheme } = useContext(ThemeContext); // useContext for theme
const navigate=useNavigate();
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({ status: "all", category: "all", priority: "all", search: "" });
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, todayReports: 0 });

  const isMobile = useMediaQuery("(max-width:768px)");

 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      toast.error("Login Required");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://hackathon-r2yi.onrender.com/api/AdminDetails", {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setIssues(data.Issues || []);
      setDepartments(data.Departments || []);
    } catch (err) {
      console.error("Error fetching admin details:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [navigate]);

const handleLogout = () => {
  // Remove tokens
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  // Optional: show a success toast
  toast.success("Logged out successfully");

  // Redirect to login
  navigate("/login");
};
  useEffect(() => {
    setStats(calculateStats(issues));
  }, [issues]);

  if (loading)
    return (
      <>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: isDark ? "#121212" : "#f3f3f3",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );

  return (
    <>
      {/* <CssBaseline /> */}
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "100vh", bgcolor: isDark ? "#121212" : "#f3f3f3" }}>
        {!isMobile && <Sidebar navigationItems={navigationItems} activeView={activeView} setActiveView={setActiveView} />}

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
      <AppBar
  position="static"
  color="default"
  sx={{
    borderBottom: 1,
    borderColor: "divider",
    boxShadow: "none",
    bgcolor: isDark ? "#1A1A1A" : "#fff",
  }}
>
  <Toolbar>
    <Typography
      variant="h6"
      sx={{
        flexGrow: 1,
        textTransform: "capitalize",
        color: isDark ? "#fff" : "#000", // make title visible
      }}
    >
      {activeView}
    </Typography>
    {/* <Button className="bg-red-600 p-5 ">
      LogOut
    </Button> */}
    <IconButton
  onClick={handleLogout}
  color="inherit"
  sx={{
    mr: 1,
    border: "1px solid",
    borderColor: "red",
    bgcolor:"red",
    borderRadius: "8px",
    px: 2,
    py: 0.5,
    color: "white",
    fontSize: "0.9rem",
    "&:hover": {
      bgcolor: "red", // maintain same color on hover
    },
  }}
>
  Logout
</IconButton>

    <IconButton onClick={toggleTheme} color="inherit">
      {isDark ? (
        <LightMode sx={{ color: "#FFD700" }} /> // sun icon, yellow in dark mode
      ) : (
        <DarkMode sx={{ color: "#00008B" }} /> // moon icon, dark blue in light mode
      )}
    </IconButton>
  </Toolbar>
</AppBar>


          <Container sx={{ flex: 1, overflowY: "auto", py: 3, mb: isMobile ? "56px" : 0 }}>
            {activeView === "dashboard" && (
              <DashboardOverview stats={stats} issues={issues} setActiveView={setActiveView} setSelectedIssue={setSelectedIssue} />
            )}
            {activeView === "issues" && (
              <IssuesList issues={issues} filters={filters} setFilters={setFilters} setSelectedIssue={setSelectedIssue} dept={departments} />
            )}
            {activeView === "departments" && <Departments dept={departments} />}
            {activeView === "map" && <MapIssues issues={issues} />}
          </Container>

          {selectedIssue && <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} departments={departments} />}

          {isMobile && (
            <BottomNavigation
              value={activeView}
              onChange={(e, newValue) => setActiveView(newValue)}
              showLabels
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: isDark ? "#1A1A1A" : "#fff",
                zIndex: 1200,
              }}
            >
              <BottomNavigationAction label="Dashboard" value="dashboard" icon={<Dashboard />} />
              <BottomNavigationAction label="Issues" value="issues" icon={<ListAlt />} />
              <BottomNavigationAction label="Departments" value="departments" icon={<Apartment />} />
              <BottomNavigationAction label="Map" value="map" icon={<Map />} />
            </BottomNavigation>
          )}
        </Box>
      </Box>
    </>
  );
}
