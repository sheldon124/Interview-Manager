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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
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

function convertDuration(duration: string): [string, "hours" | "minutes"] {
  // Split the duration string into hours and minutes
  const [hours, minutes] = duration.split(":").map(Number);

  // If there are no minutes, return the duration in hours
  if (minutes === 0) {
    return [`${hours}`, "hours"];
  }

  // Otherwise, return the total minutes
  const totalMinutes = hours * 60 + minutes;
  return [`${totalMinutes}`, "minutes"];
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  open,
  onClose,
  interview,
  onSave,
}) => {
  const [updatedInterview, setUpdatedInterview] =
    useState<Interview>(interview);

  const [unit, setUnit] = useState<string>(
    convertDuration(interview.duration)[1]
  );

  const [duration, setDuration] = useState<string>(
    convertDuration(interview.duration)[0]
  );

  const [editMode, setEditMode] = useState<{
    personalInfo: boolean;
    interviewDetails: boolean;
    additionalNotes: boolean;
  }>({
    personalInfo: false,
    interviewDetails: false,
    additionalNotes: false,
  });

  // Duration conversion helpers
  const convertDurationToHoursMinutes = (duration: string): string => {
    const [hours, minutes] = duration.split(":").map(Number);
    if (minutes === 0) {
      return `${hours}:00:00`;
    }
    const totalMinutes = hours * 60 + minutes;
    return `${Math.floor(totalMinutes / 60)}:${totalMinutes % 60}:00`;
  };

  useEffect(() => {
    if (open) {
      setUpdatedInterview(interview);
      setDuration(convertDuration(interview.duration)[0]);
      setUnit(convertDuration(interview.duration)[1]);
    }
  }, [interview, open]);

  const toggleEditMode = (section: keyof typeof editMode) => {
    if (editMode[section]) {
      setUpdatedInterview(interview);
    }
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFieldChange = (
    field: keyof Interview | "unit",
    value: string
  ) => {
    if (field === "unit") {
      const durationInHours =
        value === "minutes"
          ? `${Math.floor(Number(duration) / 60)
              .toString()
              .padStart(2, "0")}:${(Number(duration) % 60)
              .toString()
              .padStart(2, "0")}:00`
          : `${duration.padStart(2, "0")}:00:00`;
      setUpdatedInterview((prev) => ({
        ...prev,
        duration: durationInHours,
      }));
    } else if (field === "duration") {
      const durationInHours =
        unit === "minutes"
          ? `${Math.floor(Number(value) / 60)
              .toString()
              .padStart(2, "0")}:${(Number(value) % 60)
              .toString()
              .padStart(2, "0")}:00`
          : `${value.padStart(2, "0")}:00:00`;
      setUpdatedInterview((prev) => ({
        ...prev,
        duration: durationInHours,
      }));
    } else setUpdatedInterview((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionSave = (section: keyof typeof editMode) => {
    setEditMode((prev) => ({ ...prev, [section]: false }));
    onSave(updatedInterview);
  };

  const handleCancel = () => {
    setUpdatedInterview(interview);
    setEditMode({
      personalInfo: false,
      interviewDetails: false,
      additionalNotes: false,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} disableAutoFocus>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: 600,
          width: "100%",
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
              {editMode.personalInfo ? (
                <CancelIcon sx={{ color: "red" }} />
              ) : (
                <EditIcon />
              )}
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
          {editMode.personalInfo && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSectionSave("personalInfo")}
              >
                Save Personal Info
              </Button>
            </Box>
          )}
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
              {editMode.interviewDetails ? (
                <CancelIcon sx={{ color: "red" }} />
              ) : (
                <EditIcon />
              )}
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
                  value={moment(updatedInterview.date).format("YYYY-MM-DD")}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                  type="date"
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

            {/* Time and Duration Fields */}
            <Grid item xs={12} sm={6}>
              {editMode.interviewDetails ? (
                <TextField
                  fullWidth
                  label="Time"
                  value={updatedInterview.time}
                  onChange={(e) => handleFieldChange("time", e.target.value)}
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Time:</strong> {updatedInterview.time}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode.interviewDetails ? (
                <>
                  <TextField
                    fullWidth
                    label="Duration"
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      handleFieldChange("duration", e.target.value);
                    }}
                    type="number"
                  />
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={unit}
                      onChange={(e) => {
                        setUnit(e.target.value);
                        handleFieldChange("unit", `${e.target.value}`);
                      }}
                    >
                      <MenuItem value="hours">Hours</MenuItem>
                      <MenuItem value="minutes">Minutes</MenuItem>
                    </Select>
                  </FormControl>
                </>
              ) : (
                <Typography variant="body1">
                  <strong>Duration:</strong> {`${duration} ${unit}`}
                </Typography>
              )}
            </Grid>
          </Grid>

          {editMode.interviewDetails && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSectionSave("interviewDetails")}
              >
                Save Interview Details
              </Button>
            </Box>
          )}
        </CardContent>

        <Divider sx={{ mb: 2 }} />

        {/* Additional Notes Section */}
        <CardContent>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Additional Notes
            </Typography>
            <IconButton
              onClick={() => toggleEditMode("additionalNotes")}
              sx={{ mb: 1 }}
            >
              {editMode.additionalNotes ? (
                <CancelIcon sx={{ color: "red" }} />
              ) : (
                <EditIcon />
              )}
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
          {editMode.additionalNotes && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSectionSave("additionalNotes")}
              >
                Save Additional Notes
              </Button>
            </Box>
          )}
        </CardContent>

        {/* Close Button */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InterviewModal;
