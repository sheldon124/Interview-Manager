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
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent
import moment from "moment";

// Define a type for the form data
interface FormData {
  date: string;
  time: string;
  durationValue: string;
  durationUnit: "minutes" | "hours";
  interviewers: string;
  interviewee: string;
  role: string;
  notes: string;
}

const InterviewForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    time: "",
    durationValue: "",
    durationUnit: "minutes",
    interviewers: "",
    interviewee: "",
    role: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name && name in formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<"minutes" | "hours">) => {
    const { name, value } = e.target;
    if (name && name in formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Formatting time using moment.js
    const formattedTime = moment(formData.time, "HH:mm").format("hh:mm A");

    // Final form data with formatted time
    const finalFormData = {
      ...formData,
      time: formattedTime, // Use moment to format time
      duration: `${formData.durationValue} ${formData.durationUnit}`, // Combine duration and unit
    };

    console.log(finalFormData);

    // Form submission logic here (e.g., sending data to a server or storing it)
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
                  onChange={handleSelectChange} // Now correctly typed
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
              required
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
            <Button type="submit" variant="contained" fullWidth>
              Schedule Interview
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InterviewForm;
