import Calendar from "../components/Calendar";
import { useEffect, useState, useContext } from "react";
import { Container, Button, Stack, Box, Divider } from "@mui/material";
import moment from "moment";
import CustomTable from "../components/CustomTable";
import { getInterviewsByDate } from "../dummy-data/mockInterviews";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

type AlignType =
  | "right"
  | "left"
  | "center"
  | "inherit"
  | "justify"
  | undefined;

interface TableHeadItem {
  id: string;
  tooltip: string;
  align: AlignType;
}

const TABLE_HEAD_IL: TableHeadItem[] = [
  {
    id: "ID",
    tooltip: "Interview ID",
    align: "left",
  },
  {
    id: "Interviewee",
    tooltip: "",
    align: "left",
  },
  {
    id: "Date",
    tooltip: "",
    align: "left",
  },
  {
    id: "Time",
    tooltip: "",
    align: "left",
  },
  {
    id: "Duration",
    tooltip: "",
    align: "left",
  },
  {
    id: "Role",
    tooltip: "",
    align: "left",
  },
  {
    id: "Interviewer",
    tooltip: "",
    align: "left",
  },
  {
    id: "Additional Notes",
    tooltip: "",
    align: "left",
  },
];

interface Interview {
  id: number;
  interviewee: string;
  date: string;
  time: string;
  duration: string;
  role: string;
  interviewer: string;
  assigned: boolean;
  additional_notes: string;
}

const InterviewList = () => {
  const [date, setDate] = useState(moment());
  const [mockInterviews, setMockInterviews] = useState<Interview[]>([]);
  const [unassignedFilter, setUnassignedFilter] = useState(false); // Track unassigned state

  useEffect(() => {
    setMockInterviews(getInterviewsByDate(date.format("YYYY-MM-DD")));
  }, []);

  useEffect(() => {
    setUnassignedFilter(false);
    setMockInterviews(getInterviewsByDate(date.format("YYYY-MM-DD")));
  }, [date]);

  useEffect(() => {
    if (unassignedFilter) {
      setMockInterviews(mockInterviews.filter((obj) => !obj.assigned));
    } else {
      setMockInterviews(getInterviewsByDate(date.format("YYYY-MM-DD")));
    }
  }, [unassignedFilter]);

  const handleToggleUnassigned = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUnassignedFilter(event.target.checked);
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Stack spacing={3} mt={1} mb={3}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Calendar
            date={date}
            handleDateChange={(newValue) => setDate(newValue)}
          />
        </Box>

        <Divider />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={unassignedFilter}
                onChange={handleToggleUnassigned}
              />
            }
            label="Unassigned"
          />
        </Box>

        <CustomTable
          title="Scheduled Interviews"
          TABLE_HEAD={TABLE_HEAD_IL}
          columnOrder={[
            "id",
            "interviewee",
            "date",
            "time",
            "duration",
            "role",
            "interviewer",
            "additional_notes",
          ]}
          data={mockInterviews}
        />
      </Stack>
    </Container>
  );
};

export default InterviewList;
