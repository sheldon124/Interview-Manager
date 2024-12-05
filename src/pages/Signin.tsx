import { useEffect, useState } from "react";
import SigninForm from "../components/SigninForm";
import { Snackbar, SnackbarCloseReason, Alert } from "@mui/material";
import ThemeProvider from "../styles/ThemeProvider";

const Signin = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const showSnackbar: string | null = localStorage.getItem("showsnackbar");
    if (showSnackbar) setOpen(true);
    localStorage.removeItem("showsnackbar");
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="signin-container">
    <ThemeProvider>
      <div className="flex justify-center items-center h-screen">
  {/* <div className="left-pane bg-blue-700 w-1/3 h-screen" /> */}

  <SigninForm />

  <Snackbar
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    open={open}
    autoHideDuration={6000}
    onClose={handleClose}
  >
    <Alert
      onClose={handleClose}
      severity="success"
      variant="filled"
      sx={{ width: "100%" }}
    >
      Account Created Successfully!
    </Alert>
  </Snackbar>
</div>
    </ThemeProvider>
    
    </div>
  );
};

export default Signin;
