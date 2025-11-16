import React from "react";
import { Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { ThemeContext, ThemeProvider } from "../../../Context/ThemeContext";
import { useContext } from "react";
export default function StatsCards({ stats, loading, getStatusColor }) {
  const { isDark } = useContext(ThemeContext);

  return (
    <Grid container spacing={2}>
      {["total", "pending", "inprogress", "resolved"].map((key) => (
        <Grid item xs={12} sm={6} md={3} key={key}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: isDark ? "#1E1E2F" : "#fff",
              color: isDark ? "#fff" : "#000"
            }}
          >
            <Typography variant="subtitle2" color={isDark ? "gray" : "textSecondary"}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
            {loading ? (
              <CircularProgress size={24} sx={{ mt: 1 }} />
            ) : (
              <Typography variant="h5" fontWeight="bold" color={getStatusColor(key).color}>
                {stats[key]}
              </Typography>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
