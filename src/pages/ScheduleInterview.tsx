import React from "react";
import { Box, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import InterviewForm from "../components/InterviewForm";

const ScheduleInterviewForm: React.FC = () => {
  return (
    <Grid container>
      {/* Sidebar */}
      {/* <Grid item xs={3}>
        <Sidebar />
      </Grid> */}
      {/* <Navbar /> */}

      {/* Main content */}
      <Box sx={{ padding: "20px", margin: "auto" }}>
        {/* <InterviewForm /> */}
      </Box>
    </Grid>
  );
};

export default ScheduleInterviewForm;
