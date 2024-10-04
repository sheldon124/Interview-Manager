import { useForm, SubmitHandler } from "react-hook-form";
import { FormControl, TextField, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    navigate("/scheduleinterview");
  };

  return (
    <div className="m-auto">
      <FormControl>
        <h1 className="font-bold text-3xl">Sign In</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 mt-5 w-[400px]"
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
          <div className="flex flex-col">
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
            <Link href="#" underline="hover">
              I forgot my password
            </Link>
          </div>

          <Button type="submit" variant="contained">
            Sign In
          </Button>
          <div className="m-auto text-gray-500 -mt-3">
            Don't have an account yet?{" "}
            <Link href="register" underline="hover">
              Sign up
            </Link>
          </div>
        </form>
      </FormControl>
    </div>
  );
};

export default SigninForm;
