import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Moment } from "moment";
import { styled } from "@mui/material/styles";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";

interface CalendarProps {
  date: Moment | null;
  handleDateChange: (newDate: Moment) => void;
  view: "month" | "week" | "day";
}

interface CustomPickerDayProps extends PickersDayProps<Moment> {
  isSelected: boolean;
  isHovered: boolean;
  isCurrentWeek: boolean;
}

const customTheme = createTheme({
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
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
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
    MuiPickersDay: {
      styleOverrides: {
        root: {
          backgroundColor: "#000", // Black background for days
          color: "#fff", // White text
          "&.Mui-selected": {
            backgroundColor: "#333", // Dark gray for selected day
            color: "#fff",
            "&:hover": {
              backgroundColor: "#444", // Slightly lighter on hover
            },
          },
          "&:hover": {
            backgroundColor: "#222", // Lighter gray for hover effect
          },
          "&:focus.Mui-selected": {
            backgroundColor: "#333", // Black background on focus
            color: "#fff", // Ensure text remains white on focus
          },
        },
      },
    },
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
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#fff", // Ensure all arrows/icons are white
        },
      },
    },
    // MuiPickersMonth: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: "#000", // Black background for months
    //       color: "#fff", // White text
    //       "&:hover": {
    //         backgroundColor: "#333", // Dark gray background on hover
    //         cursor: "pointer",
    //       },
    //       "MuiPickersMonth-monthButton.Mui-selected": {
    //         backgroundColor: "#444 !important", // Slightly lighter gray for selected month
    //         color: "#fff !important",
    //         fontWeight: "bold",
    //       },
    //       "&.Mui-selected:hover": {
    //         backgroundColor: "#555 !important", // Even lighter on hover when selected
    //       },
    //     },
    //   },
    // },
  },
});

const selectedBorderWidth = "1px solid rgba(255, 255, 255, 0.6)"; // White for visibility on black

// Custom styled component for PickersDay
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "isSelected" && prop !== "isHovered" && prop !== "isCurrentWeek",
})<CustomPickerDayProps>(
  ({ theme, isSelected, isHovered, day, isCurrentWeek }) => ({
    borderRadius: 0,
    ...(isSelected && {
      backgroundColor: "#333",
      color: theme.palette.primary.contrastText,
      "&:hover, &:focus": {
        backgroundColor: "#333",
      },
    }),
    ...(isHovered && {
      backgroundColor: "#333", // Light gray for hover effect
    }),
    ...(day.day() === 0 && {
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
    }),
    ...(day.day() === 6 && {
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    }),
    ...(isCurrentWeek &&
      !isSelected && {
        borderTop: selectedBorderWidth,
        borderBottom: selectedBorderWidth,
        borderLeft: day.day() === 0 ? selectedBorderWidth : "none",
        borderRight: day.day() === 6 ? selectedBorderWidth : "none",
      }),
  })
);

// Helper function to check if two days are in the same week
const isInSameWeek = (
  dayA: Moment,
  selectedDate: Moment | null | undefined
) => {
  if (!selectedDate) return false;
  return dayA.isSame(selectedDate, "week");
};

function Day(
  props: PickersDayProps<Moment> & {
    selectedDay?: Moment | null;
    hoveredDay?: Moment | null;
    currentWeek?: boolean;
  }
) {
  const { day, selectedDay, hoveredDay, currentWeek, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      disableMargin
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
      isCurrentWeek={currentWeek ?? false}
    />
  );
}

export default function Calendar({
  date,
  handleDateChange,
  view,
}: CalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<Moment | null>(null);
  const [selectedDay, setSelectedDay] = useState<Moment | null>(date);

  useEffect(() => {
    if (date) {
      const currentDate = moment();
      if (
        view === "week" &&
        date.format("YYYY-MM-DD") !== date.startOf("week").format("YYYY-MM-DD")
      ) {
        handleWeekSelection(currentDate);
      } else if (
        view !== "week" &&
        date.format("YYYY-MM-DD") !== currentDate.format("YYYY-MM-DD")
      ) {
        setSelectedDay(currentDate);
        handleDateChange(currentDate);
      }
    }
  }, [view]);

  const handleWeekSelection = (day: Moment) => {
    const startOfWeek = day.startOf("week");
    setSelectedDay(startOfWeek);
    handleDateChange(startOfWeek);
  };

  const isCurrentWeek = (day: Moment) => {
    return day.isSame(new Date(), "week");
  };

  return (
    <Box sx={{ marginTop: "80px" }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={customTheme}>
          <DateCalendar
            sx={{
              width: "300px",
              backgroundColor: "#000", // Calendar background set to black
              color: "#fff", // Text color set to white
              ".MuiPickersMonth-monthButton": {
                backgroundColor: "#000", // Default background for months
                color: "#fff", // Default text color
                "&:hover": {
                  backgroundColor: "#333", // Hover background
                },
                "&.Mui-selected": {
                  backgroundColor: "#444", // Selected month background
                  color: "#fff", // Selected month text color
                  fontWeight: "bold",
                  // "&:focus.Mui-selected": {
                  //   backgroundColor: "#333", // Black background on focus
                  //   color: "#fff", // Ensure text remains white on focus
                  // },
                  "&:focus": {
                    backgroundColor: "#444 !important",
                    color: "#fff !important",
                  },
                  "&:hover": {
                    backgroundColor: "#555", // Slightly lighter when hovered and selected
                  },
                },
              },
            }}
            value={date}
            onChange={view === "week" ? handleWeekSelection : handleDateChange}
            views={view === "month" ? ["year", "month"] : ["day"]}
            openTo={
              view === "month" ? "month" : view === "week" ? "day" : "day"
            }
            showDaysOutsideCurrentMonth={view !== "day"}
            slots={{ day: view === "week" ? Day : undefined }}
            disableHighlightToday={view === "week"}
            slotProps={{
              day: (ownerState) => ({
                selectedDay,
                hoveredDay,
                currentWeek: isCurrentWeek(ownerState.day) ?? false,
                onPointerEnter: () => setHoveredDay(ownerState.day),
                onPointerLeave: () => setHoveredDay(null),
              }),
            }}
          />
        </ThemeProvider>
      </LocalizationProvider>
    </Box>
  );
}
