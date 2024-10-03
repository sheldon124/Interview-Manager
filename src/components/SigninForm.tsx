
import { FormControl, TextField, Button } from "@mui/material";


const SigninForm = () => {
    return (
        <div className="flex justify-center items-center ml-20">
            
            <FormControl>
            <h1 className="font-bold text-3xl">Sign In</h1>
            <div className="flex flex-col gap-6 mt-5">
                <TextField
                label="Email Address"
                required
                id="email"
                variant="outlined"
                aria-describedby="email"
                />
                <TextField
                label="Password"
                required
                id="password"
                variant="outlined"
                type="password"
                aria-describedby="password"
                />
                <div className="flex">
                <Button variant="contained">Sign In</Button>
                </div>
            </div>
            </FormControl>
      </div>

    )
}

export default SigninForm;