import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function IssuesTable({ issues }) {
  const { isDark } = React.useContext(ThemeContext);

  const columns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "status", label: "Status", minWidth: 120 },
    { id: "priority", label: "Priority", minWidth: 120 },
    { id: "category", label: "Category", minWidth: 150 },
    { id: "department", label: "Department", minWidth: 150 },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Dark/light mode styles
  const tableBg = isDark ? "#1f1f1f" : "#fff";
  const headerBg = isDark ? "#2c2c2c" : "#f5f5f5";
  const textColor = isDark ? "#e0e0e0" : "#000";
  const hoverColor = isDark ? "#333" : "#f0f0f0";

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", bgcolor: tableBg, color: textColor }}>
      <TableContainer sx={{ maxHeight: 440, bgcolor: tableBg }}>
        <Table stickyHeader aria-label="issues table" sx={{ bgcolor: tableBg, color: textColor }}>
          <TableHead sx={{ bgcolor: headerBg }}>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth, color: textColor }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {issues
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(issue => (
                <TableRow
                  hover
                  key={issue.id || issue._id}
                  sx={{
                    "&:hover": { backgroundColor: hoverColor },
                    backgroundColor: tableBg,
                  }}
                >
                  <TableCell>{issue.title}</TableCell>
                  <TableCell>{issue.status}</TableCell>
                  <TableCell>{issue.priority}</TableCell>
                  <TableCell>{issue.category}</TableCell>
                  <TableCell>{issue.department || "None"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={issues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: textColor,
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": { color: textColor },
          ".MuiTablePagination-actions button": { color: textColor },
          bgcolor: tableBg,
        }}
      />
    </Paper>
  );
}
