import { Stack, useTheme } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Moment } from "moment";

interface CalendarProps {
  date: Moment;
  handleDateChange: (newDate: Moment) => void;
}

export default function Calendar({ date, handleDateChange }: CalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateCalendar
        sx={{
          border: `1px solid`,
        }}
        value={date}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
}
