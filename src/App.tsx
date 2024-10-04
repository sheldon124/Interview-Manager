import React from "react";
import Register from "./components/Register";
import logo from "./logo.svg";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./App.css";
import InterviewList from "./pages/InterviewList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/interview-list",
    element: <InterviewList />,
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
