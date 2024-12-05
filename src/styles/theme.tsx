import { createTheme } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";
import "@mui/x-date-pickers/themeAugmentation"; // Import for x-date-pickers theme augmentation
import "@fontsource/raleway";

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Set primary color to black
    },
    secondary: {
      main: "#333333", // Use dark gray for secondary elements
    },
    background: {
      default: "#000000", // Default background black
      paper: "#121212", // Paper background slightly lighter
    },
    text: {
      primary: "#000000", // Black text for primary content
      secondary: "#333333", // Dark gray for secondary text
    },
  },
  typography: {
    fontFamily: "'Raleway'",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#000000", // Black headings
    },
    body1: {
      fontSize: "1rem",
      color: "#000000", // Black text for form and body
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#000", // Black buttons
          color: "#fff", // White text
          "&:hover": {
            backgroundColor: "#333", // Dark gray on hover
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000", // Black border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#333", // Dark gray on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000", // Black border when focused
          },
        },
        input: {
          color: "#000000", // Black input text
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#000000", // Black labels
          "&.Mui-focused": {
            color: "#000000",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000", // Black navbar
          color: "#fff", // White text
        },
      },
    },
    // MuiPickersDay: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: "#000", // Black background for days
    //       color: "#fff", // White text
    //       "&.Mui-selected": {
    //         backgroundColor: "#333", // Dark gray for selected day
    //         color: "#fff",
    //         "&:hover": {
    //           backgroundColor: "#444", // Slightly lighter on hover
    //         },
    //       },
    //       "&:hover": {
    //         backgroundColor: "#222", // Lighter gray for hover effect
    //       },
    //     },
    //   },
    // },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff", // White paper background for form
          color: "#000000", // Black text for content
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          backgroundColor: "#000", // Ensure the header background matches
          color: "#fff", // White text for month and year
        },
        switchViewButton: {
          color: "#fff", // White arrows
        },
        labelContainer: {
          color: "#fff", // White text for month and year
        },
      },
    },
  },
});

export default theme;
