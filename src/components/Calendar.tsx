import { useEffect, useState } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Moment } from "moment";
import { styled } from "@mui/material/styles";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import moment from "moment";

interface CalendarProps {
  date: Moment | null;
  handleDateChange: (newDate: Moment) => void;
  view: "month" | "week" | "day"; // New view prop
}

interface CustomPickerDayProps extends PickersDayProps<Moment> {
  isSelected: boolean;
  isHovered: boolean;
  isCurrentWeek: boolean;
}

const selectedBorderWidth = "1px solid rgba(0, 0, 0, 0.6)";

// Custom styling for PickersDay to highlight the week
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "isSelected" && prop !== "isHovered" && prop !== "isCurrentWeek",
})<CustomPickerDayProps>(
  ({ theme, isSelected, isHovered, day, isCurrentWeek }) => ({
    borderRadius: 0,
    ...(isSelected && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.primary.main,
      },
    }),
    ...(isHovered && {
      backgroundColor: theme.palette.primary.light,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.primary.light,
      },
    }),
    ...(day.day() === 0 && {
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
    }),
    ...(day.day() === 6 && {
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    }),
    // Border for the current week
    ...(isCurrentWeek &&
      !isSelected && {
        borderTop: selectedBorderWidth,
        borderBottom: selectedBorderWidth,
        borderLeft: day.day() === 0 ? selectedBorderWidth : "none", // Apply border only to first and last days of the week
        borderRight: day.day() === 6 ? selectedBorderWidth : "none", // Apply border only to first and last days of the week
      }),
  })
);

// Function to check if two days are in the same week
const isInSameWeek = (dayA: Moment, dayB: Moment | null | undefined) => {
  if (dayB == null) {
    return false;
  }
  return dayA.isSame(dayB, "week");
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
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
      isCurrentWeek={currentWeek ?? false} // Ensure boolean value
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
      const currentDate = moment(); // If date prop is not passed, use current date
      console.log("here");
      if (
        view == "week" &&
        date.format("YYYY-MM-DD") !== date.startOf("week").format("YYYY-MM-DD")
      ) {
        console.log(date.format("YYYY-MM-DD"));
        console.log(date.startOf("week").format("YYYY-MM-DD"));
        handleWeekSelection(currentDate);
      } else if (
        view !== "week" &&
        date.format("YYYY-MM-DD") !== currentDate.format("YYYY-MM-DD")
      ) {
        console.log("this-" + date.format("YYYY-MM-DD"));
        console.log("curr-" + currentDate.format("YYYY-MM-DD"));
        setSelectedDay(currentDate);
        handleDateChange(currentDate);
      }
    }
  }, [view]);

  const handleWeekSelection = (day: Moment) => {
    const startOfWeek = day.startOf("week");
    setSelectedDay(startOfWeek);
    handleDateChange(startOfWeek); // Update parent component with selected week's start
  };

  // Check if the day is within the current week
  const isCurrentWeek = (day: Moment) => {
    return day.isSame(new Date(), "week");
  };

  return (
    <Box sx={{ marginTop: "80px" }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateCalendar
          sx={{
            border: `1px solid`,
          }}
          value={date}
          onChange={view == "week" ? handleWeekSelection : handleDateChange}
          views={view === "month" ? ["year", "month"] : ["day"]} // Dynamically set views
          openTo={view === "month" ? "month" : view === "week" ? "day" : "day"} // Open the calendar to the correct view
          showDaysOutsideCurrentMonth={view !== "day"} // Only show days outside current month in month/week view
          slots={{ day: view === "week" ? Day : undefined }} // Use custom day rendering for week view
          disableHighlightToday={view === "week"} // Disable today highlight in day view
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
      </LocalizationProvider>
    </Box>
  );
}
