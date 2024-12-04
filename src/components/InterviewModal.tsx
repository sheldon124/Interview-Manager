import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  IconButton,
  Typography,
  Button,
  Grid,
  Divider,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";

interface Interview {
  id: number | null;
  interviewee: string;
  date: string;
  time: string;
  duration: string;
  role: string;
  department: string;
  interviewer: string;
  additional_notes: string;
  email: string;
  phone: string;
}

interface InterviewModalProps {
  open: boolean;
  onClose: () => void;
  interview: Interview;
  onSave: (updatedInterview: Interview) => void;
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  open,
  onClose,
  interview,
  onSave,
}) => {
  // State to manage the editable form fields
  const [updatedInterview, setUpdatedInterview] =
    useState<Interview>(interview);

  // State to manage edit mode for each section
  const [editMode, setEditMode] = useState<{
    personalInfo: boolean;
    interviewDetails: boolean;
    additionalNotes: boolean;
  }>({
    personalInfo: false,
    interviewDetails: false,
    additionalNotes: false,
  });

  // Sync updatedInterview with the interview prop whenever it changes
  useEffect(() => {
    if (open) {
      setUpdatedInterview(interview); // Sync with the latest interview prop
    }
  }, [interview, open]);

  // Handler for section edit mode toggle
  const toggleEditMode = (section: keyof typeof editMode) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handler for saving field changes
  const handleFieldChange = (field: keyof Interview, value: string) => {
    setUpdatedInterview((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Save
  const handleSave = () => {
    onSave(updatedInterview); // Pass the updated interview to the parent component
    setEditMode({
      personalInfo: false,
      interviewDetails: false,
      additionalNotes: false,
    }); // Reset edit modes
    onClose(); // Close modal after saving
  };

  // Handle Cancel (Reset to initial interview data)
  const handleCancel = () => {
    setUpdatedInterview(interview); // Reset to the initial interview data
    setEditMode({
      personalInfo: false,
      interviewDetails: false,
      additionalNotes: false,
    }); // Reset edit modes
    onClose(); // Close modal without saving
  };

  return (
    <Modal open={open} onClose={onClose} disableAutoFocus>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Center the modal
          maxWidth: 600,
          width: "100%", // Ensure responsiveness up to the max width
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Interview Details
        </Typography>

        {/* Personal Information Section */}
        <CardContent>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Personal Information
            </Typography>
            <IconButton
              onClick={() => toggleEditMode("personalInfo")}
              sx={{ mb: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {editMode.personalInfo ? (
                <TextField
                  fullWidth
                  label="Interviewee"
                  value={updatedInterview.interviewee}
                  onChange={(e) =>
                    handleFieldChange("interviewee", e.target.value)
                  }
                />
              ) : (
                <Typography variant="body1">
                  <strong>Interviewee:</strong> {updatedInterview.interviewee}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode.personalInfo ? (
                <TextField
                  fullWidth
                  label="Email"
                  value={updatedInterview.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Email:</strong> {updatedInterview.email}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode.personalInfo ? (
                <TextField
                  fullWidth
                  label="Phone"
                  value={updatedInterview.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Phone:</strong> {updatedInterview.phone}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mb: 2 }} />

        {/* Interview Details Section */}
        <CardContent>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Interview Details
            </Typography>
            <IconButton
              onClick={() => toggleEditMode("interviewDetails")}
              sx={{ mb: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {editMode.interviewDetails ? (
                <TextField
                  fullWidth
                  label="Role"
                  value={updatedInterview.role}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Role:</strong> {updatedInterview.role}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode.interviewDetails ? (
                <TextField
                  fullWidth
                  label="Department"
                  value={updatedInterview.department}
                  onChange={(e) =>
                    handleFieldChange("department", e.target.value)
                  }
                />
              ) : (
                <Typography variant="body1">
                  <strong>Department:</strong> {updatedInterview.department}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode.interviewDetails ? (
                <TextField
                  fullWidth
                  label="Interviewer"
                  value={updatedInterview.interviewer}
                  onChange={(e) =>
                    handleFieldChange("interviewer", e.target.value)
                  }
                />
              ) : (
                <Typography variant="body1">
                  <strong>Interviewer:</strong> {updatedInterview.interviewer}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode.interviewDetails ? (
                <TextField
                  fullWidth
                  label="Date"
                  value={updatedInterview.date}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Date:</strong>{" "}
                  {moment(updatedInterview.date).format("MMMM Do, YYYY")}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mb: 2 }} />
        <CardContent>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Additional Notes
            </Typography>
            <IconButton
              onClick={() => toggleEditMode("additionalNotes")}
              sx={{ mb: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          {editMode.additionalNotes ? (
            <TextField
              fullWidth
              label="Additional Notes"
              value={updatedInterview.additional_notes}
              onChange={(e) =>
                handleFieldChange("additional_notes", e.target.value)
              }
              multiline
              minRows={3}
            />
          ) : (
            <Box
              sx={{
                maxHeight: "150px",
                overflow: "auto",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <Typography variant="body1">
                {updatedInterview.additional_notes}
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Buttons Section */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InterviewModal;
