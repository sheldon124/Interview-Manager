import React from "react";
import { Box, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import InterviewForm from "../components/InterviewForm";
import ThemeProvider from "../styles/ThemeProvider";
const ScheduleInterviewForm: React.FC = () => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default ScheduleInterviewForm;
