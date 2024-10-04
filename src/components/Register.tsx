import { useForm, Controller } from "react-hook-form";
import {
  FormControl,
  TextField,
  InputLabel,
  Button,
  Box,
  MenuItem,
  Select,
  FormHelperText,
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

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert("Registration Successful")
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

  return (
    <div className="flex flex-row">
      <div className="bg-blue-700 w-1/3 h-screen" />
      <div className="w-full m-auto">
        <div className="mx-auto w-[500px] mt-5">
          <h1 className="font-bold text-3xl">Create Your Account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
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
                      <InputLabel id="department-label">Department</InputLabel>
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
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
