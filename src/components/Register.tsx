import { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ThemeProvider from "../styles/ThemeProvider";
import {
  FormControl,
  TextField,
  InputLabel,
  Button,
  Box,
  MenuItem,
  Select,
  FormHelperText,
  Snackbar,
  SnackbarCloseReason,
  Alert,
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  department: string;
  role: string;
}

interface ErrorResponse {
  [key: string]: string[];
}

const departmentChoice = [
  { value: "Software", label: "Software" },
  { value: "Testing", label: "Testing" },
  { value: "Cyber-Security", label: "Cyber-Security" },
  { value: "Finance", label: "Finance" },
];

const roleChoice = [
  { value: "Manager", label: "Manager" },
  { value: "Senior", label: "Senior" },
  { value: "Junior", label: "Junior" },
  { value: "Team Lead", label: "Team Lead" },
  { value: "Intern", label: "Intern" },
];

function Register() {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>();

  const [open, setOpen] = useState(false);

  const [overlay, setOverlay] = useState(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const onSubmit = async (data: FormData) => {
    const registrationData = {
      email: data.email,
      password: data.password,
      password2: data.confirmPassword,
      first_name: data.firstName,
      last_name: data.lastName,
      department: data.department,
      role: data.role,
    };

    let submitForm = true;
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match." });
      submitForm = false;
    }

    if (data.email !== data.confirmEmail) {
      setError("confirmEmail", { message: "Emails do not match." });
      submitForm = false;
    }

    if (!submitForm) return;
    try {
      setOverlay(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        registrationData
      );
      localStorage.setItem("showsnackbar", "true");
      navigate("/signin");
    } catch (error) {
      setOverlay(false);

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response && axiosError.response.data) {
          // Backend validation errors
          const errorData = axiosError.response.data;

          // Format errors into a readable string
          const formattedErrors = Object.keys(errorData)
            .map((key) => `<strong>${key}</strong>: ${errorData[key][0]}`)
            .join("<br />");

          setApiError(formattedErrors);
        } else if (axiosError.request) {
          // No response received (network error)
          setApiError("Network error. Please check your internet connection.");
        } else {
          // Unknown Axios error
          setApiError("An unexpected error occurred. Please try again.");
        }
      } else {
        // Handle non-Axios errors
        setApiError("An unknown error occurred. Please try again.");
      }

      setOpen(true); // Open the Snackbar
    }
  };

  const handleBlur = (field: keyof FormData) => {
    if (field === "email") {
      const email = watch("email");
      if (!!email && !validateEmail(email)) {
        setError("email", { message: "Email is not valid." });
      } else {
        clearErrors("email");
      }
    }

    if (field === "confirmEmail") {
      const email = watch("email");
      const confirmEmail = watch("confirmEmail");
      if (!!confirmEmail && confirmEmail !== email) {
        setError("confirmEmail", { message: "Emails do not match." });
      } else {
        clearErrors("confirmEmail");
      }
    }

    if (field === "confirmPassword") {
      const password = watch("password");
      const confirmPassword = watch("confirmPassword");
      if (!!confirmPassword && confirmPassword !== password) {
        setError("confirmPassword", { message: "Passwords do not match." });
      } else {
        clearErrors("confirmPassword");
      }
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setApiError(null);

    setOpen(false);
  };

  return (
    <div className="signin-container">
      <ThemeProvider>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <Typography
                sx={{
                  fontSize: "1.5rem", // Approx equivalent to text-2xl
                  fontWeight: "bold",
                }}
              >
                Create Your Account
              </Typography>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Box display="flex" flexDirection="column" gap={2}>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                >
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "First Name is required." }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "Last Name is required." }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                </Box>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      variant="outlined"
                      fullWidth
                      onBlur={() => handleBlur("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="confirmEmail"
                  control={control}
                  rules={{ required: "Confirm Email is required." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm Email Address"
                      variant="outlined"
                      fullWidth
                      onBlur={() => handleBlur("confirmEmail")}
                      error={!!errors.confirmEmail}
                      helperText={errors.confirmEmail?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      onBlur={() => handleBlur("password")}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{ required: "Confirm Password is required." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      onBlur={() => handleBlur("confirmPassword")}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                    />
                  )}
                />
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                >
                  <Controller
                    name="department"
                    control={control}
                    rules={{ required: "Department is required." }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.department}>
                        <InputLabel id="department-label">
                          Department
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="department-label"
                          label="Department"
                          onChange={(e) => {
                            field.onChange(e);
                            clearErrors("department");
                          }}
                        >
                          {departmentChoice.map((dept) => (
                            <MenuItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.department?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Role is required." }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.role}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                          {...field}
                          labelId="role-label"
                          label="Role"
                          onChange={(e) => {
                            field.onChange(e);
                            clearErrors("role");
                          }}
                        >
                          {roleChoice.map((roleobj) => (
                            <MenuItem key={roleobj.value} value={roleobj.value}>
                              {roleobj.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.role?.message}</FormHelperText>
                      </FormControl>
                    )}
                  />
                </Box>
                <Button variant="contained" type="submit">
                  Create
                </Button>
                <Snackbar
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
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          apiError ??
                          "Error Creating Account. Please try again later.",
                      }}
                    />
                  </Alert>
                </Snackbar>
                <Backdrop
                  sx={(theme) => ({
                    color: "#fff",
                    zIndex: theme.zIndex.drawer + 1,
                  })}
                  open={overlay}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Box>
            </form>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default Register;
