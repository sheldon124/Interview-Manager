import React from 'react';
import { Box, Grid } from '@mui/material';
import Sidebar from '../components/Sidebar';
import InterviewForm from '../components/InterviewForm';

const ScheduleInterviewForm: React.FC = () => {
  return (
    <Grid container>
      {/* Sidebar */}
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      
      {/* Main content */}
      <Grid item xs={9}>
        <Box sx={{ padding: '20px' }}>
          <InterviewForm />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ScheduleInterviewForm;
