import React from "react";
import Register from "./components/Register";
import logo from "./logo.svg";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import Signin from "./pages/Signin";
import ScheduleInterview from "./pages/ScheduleInterview";
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import ScheduleInterviewForm from "./pages/ScheduleInterview";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/scheduleinterview",
    element: <ScheduleInterview />,
  },
]);

function App() {
  return (
    
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
