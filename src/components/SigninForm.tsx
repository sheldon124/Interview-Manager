import { useForm, SubmitHandler } from "react-hook-form";
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import ThemeProvider from "../styles/ThemeProvider";
import { useState } from "react";
import {
  FormControl,
  TextField,
  Button,
  Link,
  Snackbar,
  SnackbarCloseReason,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';

interface FormInputs {
  email: string;
  password: string;
}

const SigninForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [overlay, setOverlay] = useState(false);

  // Create a custom theme
  // const theme = createTheme({
  //   components: {
  //     MuiButton: {
  //       styleOverrides: {
  //         root: {
  //           backgroundColor: 'black', // Button background color
  //           color: 'white', // Button text color
  //           '&:hover': {
  //             backgroundColor: '#333', // Hover color
  //           },
  //         },
  //       },
  //     },
  //     MuiOutlinedInput: {
  //       styleOverrides: {
  //         root: {
  //           '& .MuiOutlinedInput-notchedOutline': {
  //             borderColor: 'black', // Border color
  //           },
  //           '&:hover .MuiOutlinedInput-notchedOutline': {
  //             borderColor: '#333', // Hover border color
  //           },
  //           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //             borderColor: 'black', // Focus border color
  //           },
  //         },
  //         input: {
  //           color: 'black', // Input text color
  //         },
  //       },
  //     },
  //     MuiInputLabel: {
  //       styleOverrides: {
  //         root: {
  //           color: 'black', // Label color
  //           '&.Mui-focused': {
  //             color: 'black', // Focused label color
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setOverlay(true);
      // Make a POST request to your API endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        data
      );
      // If successful, navigate to the /interview-list page
      if (response.status === 200) {
        navigate("/interview-list");
      }
    } catch (error) {
      // Handle error (you might want to display an error message)
      setOverlay(false);
      setOpen(true);
    }
  };

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
    <>
      <div className="signin-form-container flex items-center justify-center min-h-screen h-">
        <div className="form-box bg-white shadow-lg rounded-lg p-8 w-[400px] flex flex-col justify-center items-center">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Invalid Username or Password!
            </Alert>
          </Snackbar>
          <FormControl>
            <h1 className="font-bold text-3xl text-center">Sign In</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 mt-5"
            >
              <TextField
                label="Email Address"
                required
                id="email"
                variant="outlined"
                aria-describedby="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
              <TextField
                label="Password"
                required
                id="password"
                variant="outlined"
                type="password"
                aria-describedby="password"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />

              <Button type="submit" variant="contained">
                Sign In
              </Button>
              <div className="text-center text-gray-500">
                Don't have an account yet?{" "}
                <Link href="register" underline="hover">
                  Sign up
                </Link>
              </div>
            </form>
          </FormControl>
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={overlay}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </div>
    </>

  );


};

export default SigninForm;
