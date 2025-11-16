import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function IssueModal({ issue, onClose, departments }) {
  const { isDark } = useContext(ThemeContext);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 650, // ✅ wider modal
    bgcolor: isDark ? "#1E1E1E" : "background.paper",
    border: `2px solid ${isDark ? "#333333" : "#000"}`,
    boxShadow: 24,
    p: 5,
    borderRadius: 3,
    color: isDark ? "#FFFFFF" : "#000000",
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={!!issue}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: "rgba(0,0,0,0.6)" },
        },
      }}
    >
      <Fade in={!!issue}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h5" component="h2" sx={{ mb: 2, fontWeight: "bold" }}>
            {issue?.title}
          </Typography>

          <Typography id="transition-modal-description" sx={{ mb: 3, color: isDark ? "#CCC" : "#555" }}>
            {issue?.description}
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Typography sx={{ color: isDark ? "#BBB" : "#444" }}>
              <strong>Category:</strong> {issue?.category}
            </Typography>
            <Typography sx={{ color: isDark ? "#BBB" : "#444" }}>
              <strong>Status:</strong> {issue?.status}
            </Typography>
            
            {issue?.assigned_department && (
              <>
                <Typography sx={{ color: isDark ? "#BBB" : "#444" }}>
                  <strong>Department:</strong> {issue?.assigned_department}
                </Typography>
                <Typography sx={{ color: isDark ? "#BBB" : "#444" }}>
                  <strong>Assigned Employee:</strong> {issue?.assigned_department_employee}
                </Typography>
              </>
            )}

            {issue?.address && (
              <Typography sx={{ color: isDark ? "#BBB" : "#444" }}>
                <strong>Place:</strong> {issue?.address}
              </Typography>
            )}
            
            {issue?.latitude && issue?.longitude && (
              <Typography sx={{ color: isDark ? "#BBB" : "#444" }}>
                <strong>Co-Ordinates</strong> {issue?.latitude}, {issue?.longitude}
              </Typography>
            )}
            <Typography sx={{ color: isDark ? "#BBB" : "#444" }}>
              <strong>Photo Evidence:</strong> <img src={issue?.photo}></img>
            </Typography>
          </Box>

          <Button
            onClick={onClose}
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              py: 1.2,
              fontSize: "1rem",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Close
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
