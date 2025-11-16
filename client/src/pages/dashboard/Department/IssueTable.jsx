import React, { useState, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function IssueTable({ issues, getStatusColor, getStatusIcon }) {
  const { isDark } = useContext(ThemeContext);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleClose = () => setSelectedIssue(null);
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  return (
    <>
      <Paper
        sx={{
          overflowX: "auto",
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: isDark ? "#1E1E2F" : "#fff",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["ID", "Title", "Category", "Reporter", "Status", "Created", "Actions"].map(
                (h) => (
                  <TableCell
                    key={h}
                    sx={{ fontWeight: "bold", color: isDark ? "#aaa" : "#000" }}
                  >
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.issue_id} hover>
                <TableCell sx={{ color: isDark ? "#fff" : "#000" }}>{issue.issue_id}</TableCell>
                <TableCell sx={{ color: isDark ? "#fff" : "#000" }}>{issue.title}</TableCell>
                <TableCell sx={{ color: isDark ? "#ccc" : "#555" }}>{issue.category}</TableCell>
                <TableCell sx={{ color: isDark ? "#ccc" : "#555" }}>
                  {issue.is_anonymous ? "Anonymous" : issue.reporter_name}
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      border: "1px solid",
                      ...getStatusColor(issue.status),
                    }}
                  >
                    {getStatusIcon(issue.status)}
                    <span style={{ marginLeft: 4 }}>{issue.status}</span>
                  </span>
                </TableCell>
                <TableCell sx={{ color: isDark ? "#ccc" : "#555" }}>
                  {new Date(issue.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => {
                    setSelectedIssue(issue);
                    setSelectedStatus(issue.status);
                  }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal */}
      <Dialog
        open={!!selectedIssue}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? "#111827" : "#fff",
            color: isDark ? "#fff" : "#000",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>{selectedIssue?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Category: {selectedIssue?.category}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Reporter: {selectedIssue?.is_anonymous ? "Anonymous" : selectedIssue?.reporter_name}
          </Typography>
          <TextField
            select
            label="Status"
            fullWidth
            value={selectedStatus}
            onChange={handleStatusChange}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-input": { color: isDark ? "#fff" : "#000" },
              "& .MuiInputLabel-root": { color: isDark ? "#fff" : "#000" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#374151" : "#d1d5db",
              },
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: isDark ? "#fff" : "#000" }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Update issue status here if needed
              handleClose();
            }}
            sx={{ color: "#fff", bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
