import Register from "./components/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./App.css";
import Signin from "./pages/Signin";
import ScheduleInterview from "./pages/ScheduleInterview";
import ThemeProvider from "./styles/ThemeProvider";

import InterviewList from "./pages/InterviewList";

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
  { path: "/interview-list", element: <InterviewList /> },
]);

function App() {
  return (
      <div className="signin-container">
        <RouterProvider router={router} />
    </div>
    
  );
}

export default App;
