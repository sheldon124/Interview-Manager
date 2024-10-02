import React from "react";
import { FormControl, TextField, InputLabel, Button } from "@mui/material";

function Register() {
  return (
    <div className="flex flex-row">
      <div className="bg-blue-700 w-1/3 h-screen" />
      <div className="mx-auto w-[500px] mt-5">
        <h1 className="font-bold text-3xl">Create Your Account</h1>
        <FormControl>
          <div className="flex flex-col gap-6">
            <div className="mt-6 flex flex-row gap-5">
              <TextField
                label="First Name"
                required
                id="firstName"
                variant="outlined"
                aria-describedby="first-name"
              />
              <TextField
                label="Last Name"
                required
                id="lastName"
                variant="outlined"
                aria-describedby="last-name"
              />
            </div>
            <TextField
              label="Email Address"
              required
              id="email"
              variant="outlined"
              aria-describedby="email"
            />
            <TextField
              label="Confirm Email Address"
              required
              id="confirmEmail"
              variant="outlined"
              aria-describedby="confirmEmail"
            />
            <TextField
              label="Password"
              required
              id="password"
              variant="outlined"
              type="password"
              aria-describedby="password"
            />
            <TextField
              label="Confirm Password"
              required
              id="confirmPassword"
              variant="outlined"
              type="password"
              aria-describedby="confirmPassword"
            />
            <div className="flex">
              <Button variant="contained">Create</Button>
            </div>
          </div>
        </FormControl>
      </div>
    </div>
  );
}

export default Register;
