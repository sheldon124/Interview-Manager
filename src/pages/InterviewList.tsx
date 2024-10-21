import Calendar from "../components/Calendar";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Box, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import CustomTable from "../components/CustomTable";
import { getInterviewsByDate } from "../dummy-data/mockInterviews";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Navbar from "../components/NavBar";
import { Modal, ModalClose } from "@mui/joy";
import InterviewForm from "../components/InterviewForm";

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
  const navigate = useNavigate();
  const [date, setDate] = useState(moment());
  const [mockInterviews, setMockInterviews] = useState<Interview[]>([]);
  const [unassignedFilter, setUnassignedFilter] = useState(false); // Track unassigned state
  const [openModal, setOpenModal] = useState(false); // State for modal visibility

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ display: "flex", marginLeft: "40px" }}>
        <Box>
          <CustomTable
            title="Scheduled Interviews"
            primaryButton={
              <Button
                variant="contained"
                color="primary"
                sx={{ gap: "4px", padding: "8px 24px 8px 20px" }}
                onClick={() => setOpenModal(true)}
              >
                <AddIcon sx={{ fontSize: "1.25rem" }} />
                Schedule
              </Button>
            }
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
        </Box>
        <Divider sx={{ marginTop: "60px" }} orientation="vertical" flexItem />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "80px",
            marginLeft: "50px",
          }}
        >
          <Calendar
            date={date}
            handleDateChange={(newValue) => setDate(newValue)}
          />
        </Box>
      </Container>
      <Modal
        open={openModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            bgcolor: "background.paper",
            position: "relative",
          }}
        >
          <ModalClose
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 16, right: 16 }}
          />
          <InterviewForm />
        </Box>
      </Modal>
    </>
  );
};

export default InterviewList;
