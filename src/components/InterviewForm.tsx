import React, { useState } from "react";
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
  department:string;
  interviewers: string;
  interviewee: string;
  role: string;
  notes: string;
}

interface InterviewFormProps {
  postApiCallback: (message: string) => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ postApiCallback }) => {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    time: "",
    durationValue: "",
    durationUnit: "minutes",
    department:"",
    interviewers: "",
    interviewee: "",
    role: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false); // Loading state

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      department: formData.department,
      interviewer: formData.interviewers,
      job_title: formData.role,
      business_area: "Development", // Placeholder value
      additional_notes: formData.notes,
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

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Schedule an Interview
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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

          <Grid item xs={12}>
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
          {/* Department Dropdown */}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                name="department"
                value={formData.department}
                onChange={handleSelectChange}
                required
                label="Department"
              >
                <MenuItem value="Software">Software</MenuItem>
                <MenuItem value="Testing">Testing</MenuItem>
                <MenuItem value="Cyber-Security">Cyber-Security</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </Select>
            </FormControl>
            
            
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
              label="Role/Title"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role/Title</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                required
                label="Role/Title"
              >
                <MenuItem value="">
                  <em>Select a role</em>
                </MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Team Lead">Team Lead</MenuItem>
                <MenuItem value="Intern">Intern</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}

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
              ) : (
                "Schedule Interview"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InterviewForm;
