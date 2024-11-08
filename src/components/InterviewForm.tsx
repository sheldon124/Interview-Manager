import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import moment from "moment";
import axios from "axios";

interface FormData {
  date: string;
  time: string;
  durationValue: string;
  durationUnit: "minutes" | "hours";
  interviewers: string;
  interviewee: string;
  role: string;
  notes: string;
  email?: string; // Optional email field
  phone?: string; // Optional phone number field
}

interface Interview {
  id: number;
  interviewee: string;
  date: string;
  time: string;
  duration: string;
  role: string;
  interviewer: string;
  additional_notes: string;
  email: string;
  phone: string;
}

interface InterviewFormProps {
  postApiCallback: (message: string) => void;
  register: boolean;
  interviewData: Interview | null;
}

const InterviewForm: React.FC<InterviewFormProps> = ({
  postApiCallback,
  register,
  interviewData,
}) => {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    time: "",
    durationValue: "",
    durationUnit: "minutes",
    interviewers: "",
    interviewee: "",
    role: "",
    notes: "",
    email: "", // Default value for email
    phone: "", // Default value for phone
  });

  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (interviewData) {
      // Pre-fill the form data when editing an existing interview
      setFormData({
        date: interviewData.date,
        time: moment(interviewData.time, "HH:mm:ss").format("HH:mm"),
        durationValue: interviewData.duration
          ? `${
              Number(interviewData.duration.split(":")[0]) * 60 +
              Number(interviewData.duration.split(":")[1])
            }` // Ensure this is a string
          : "",
        durationUnit: interviewData.duration
          ? interviewData.duration.includes(":")
            ? "hours"
            : "minutes"
          : "minutes",
        interviewers: interviewData.interviewer || "",
        interviewee: interviewData.interviewee,
        role: interviewData.role,
        notes: interviewData.additional_notes,
        email: interviewData.email || "",
        phone: interviewData.phone || "",
      });
    } else {
      // Initialize form data with default values when creating a new interview
      setFormData({
        date: "",
        time: "",
        durationValue: "",
        durationUnit: "minutes",
        interviewers: "",
        interviewee: "",
        role: "",
        notes: "",
        email: "",
        phone: "",
      });
    }
  }, [interviewData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name && name in formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name && name in formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const registerInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the API call

    // Formatting time using moment.js
    const formattedTime = moment(formData.time, "HH:mm").format("HH:mm:ss");
    const durationInHours =
      formData.durationUnit === "minutes"
        ? `${Math.floor(Number(formData.durationValue) / 60)
            .toString()
            .padStart(2, "0")}:${(Number(formData.durationValue) % 60)
            .toString()
            .padStart(2, "0")}:00`
        : `${formData.durationValue.padStart(2, "0")}:00:00`;

    const requestBody = {
      interviewee: formData.interviewee,
      date: formData.date,
      time: formattedTime,
      duration: durationInHours,
      role: formData.role,
      interviewer: formData.interviewers,
      job_title: formData.role,
      business_area: "Development", // Placeholder value
      department: "Software", // Placeholder value
      additional_notes: formData.notes,
      email: formData.email, // Include email if available
      phone: formData.phone, // Include phone number if available
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/interview/schedule/",
        requestBody
      );
      console.log("Interview scheduled successfully:", response.data);
      postApiCallback("success"); // Call the onSuccess callback
    } catch (error) {
      console.error("Error scheduling interview:", error);
      postApiCallback("Error scheduling interview. Please try again later.");
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false); // Set loading to false when the API call is finished
    }
  };

  const modifyInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the API call

    // Formatting time using moment.js
    const formattedTime = moment(formData.time, "HH:mm").format("HH:mm:ss");
    const durationInHours =
      formData.durationUnit === "minutes"
        ? `${Math.floor(Number(formData.durationValue) / 60)
            .toString()
            .padStart(2, "0")}:${(Number(formData.durationValue) % 60)
            .toString()
            .padStart(2, "0")}:00`
        : `${formData.durationValue.padStart(2, "0")}:00:00`;

    // Initialize the request body with only changed fields
    const updatedFields: Record<string, any> = {};

    if (formData.interviewee !== interviewData?.interviewee) {
      updatedFields.interviewee = formData.interviewee;
    }
    if (formData.date !== interviewData?.date) {
      updatedFields.date = formData.date;
    }
    if (formData.time !== interviewData?.time) {
      updatedFields.time = formattedTime;
    }

    // Correct the duration comparison (convert strings to numbers before arithmetic operation)
    const currentDurationInMinutes = interviewData?.duration
      ? Number(interviewData.duration.split(":")[0]) * 60 +
        Number(interviewData.duration.split(":")[1])
      : 0;

    if (Number(formData.durationValue) !== currentDurationInMinutes) {
      updatedFields.duration = durationInHours;
    }

    if (formData.role !== interviewData?.role) {
      updatedFields.role = formData.role;
    }
    if (formData.interviewers !== interviewData?.interviewer) {
      updatedFields.interviewer = formData.interviewers;
    }
    if (formData.notes !== interviewData?.additional_notes) {
      updatedFields.additional_notes = formData.notes;
    }
    if (formData.email !== interviewData?.email) {
      updatedFields.email = formData.email;
    }
    if (formData.phone !== interviewData?.phone) {
      updatedFields.phone = formData.phone;
    }

    // Check if there are any changes
    if (Object.keys(updatedFields).length === 0) {
      setLoading(false);
      postApiCallback("No changes detected");
      return;
    }

    // Add id to the updated fields to send it in the request URL
    const interviewId = interviewData?.id;

    if (!interviewId) {
      setLoading(false);
      postApiCallback("Interview ID is missing");
      return;
    }

    try {
      // Send PATCH request with updated fields
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/interview/${interviewId}/`,
        updatedFields
      );
      console.log("Interview updated successfully:", response.data);
      postApiCallback("success"); // Call the onSuccess callback
    } catch (error) {
      console.error("Error updating interview:", error);
      postApiCallback("Error updating interview. Please try again later.");
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false); // Set loading to false when the API call is finished
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (register) registerInterview(e);
    else modifyInterview(e);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {register ? "Schedule an Interview" : "Modify Interview"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleInputChange}
                inputProps={{ min: moment().format("YYYY-MM-DD") }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Duration"
                name="durationValue"
                type="number"
                value={formData.durationValue}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="duration-unit-label">Unit</InputLabel>
                <Select
                  labelId="duration-unit-label"
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleSelectChange}
                  required
                  label="Unit"
                >
                  <MenuItem value="minutes">Minutes</MenuItem>
                  <MenuItem value="hours">Hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Interviewers"
              name="interviewers"
              value={formData.interviewers}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Interviewee"
              name="interviewee"
              value={formData.interviewee}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* New Optional Fields */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              multiline
              rows={3}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
              ) : register ? (
                "Schedule Interview"
              ) : (
                "Modify Interview"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InterviewForm;
