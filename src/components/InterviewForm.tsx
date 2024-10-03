import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import moment from 'moment';

const InterviewForm: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '',
    interviewers: '',
    interviewee: '',
    role: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Formatting time using moment.js
    const formattedTime = moment(formData.time, 'HH:mm').format('hh:mm A');

    // Final form data with formatted time
    const finalFormData = {
      ...formData,
      time: formattedTime,  // Use moment to format time
    };

    console.log(finalFormData);

    // Form submission logic here (e.g., sending data to a server or storing it)
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Schedule an Interview
      </Typography>

      <Typography variant="body1" paragraph>
        
      </Typography>

      <Typography variant="body1" paragraph>
        
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
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Interviewers"
              name="interviewers"
              value={formData.interviewers}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Interviewee"
              name="interviewee"
              value={formData.interviewee}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role/Title"
              name="role"
              value={formData.role}
              onChange={handleChange}
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
              onChange={handleChange}
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
