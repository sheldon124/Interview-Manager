import Calendar from "../components/Calendar";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Box,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import CustomTable from "../components/CustomTable";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Navbar from "../components/NavBar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Modal, ModalClose } from "@mui/joy";
import InterviewForm from "../components/InterviewForm";
import axios from "axios";

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
  additional_notes: string;
  email: string;
  phone: string;
}

const InterviewList = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(moment());
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [unassignedFilter, setUnassignedFilter] = useState(false); // Track unassigned state
  const [openModal, setOpenModal] = useState(false); // State for modal visibility
  const [newInterview, setNewInterview] = useState(true); // If true, modal will display register form. Else edit
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(
    null
  ); // State for the current interview data

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Dialog state for deletion confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<Interview | null>(
    null
  );

  const fetchInterviewsByDate = async (date: String) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/interview/date/`,
        {
          params: { date },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching interviews:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchAndFilterInterviews = async () => {
      if (!date) return;

      const formattedDate = date.format("YYYY-MM-DD");
      const interviewsData = await fetchInterviewsByDate(formattedDate);

      // Apply filters
      let filteredData = interviewsData;

      // Filter by unassigned status
      if (unassignedFilter) {
        filteredData = filteredData.filter(
          (obj: Interview) => !obj.interviewer
        );
      }

      // Filter by role if a specific role is selected
      if (roleFilter !== "all") {
        filteredData = filteredData.filter(
          (obj: Interview) => obj.role === roleFilter
        );
      }

      setInterviews(filteredData);
    };

    fetchAndFilterInterviews();
  }, [date, unassignedFilter, roleFilter]);

  const handleRoleChange = (event: any) => {
    setRoleFilter(event.target.value as string);
  };

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openEditInterview = (interviewData: Interview) => {
    console.log(interviewData);
    setNewInterview(false);
    setCurrentInterview(interviewData);
    setOpenModal(true);
  };

  const handleDeleteInterview = (interviewData: Interview) => {
    setInterviewToDelete(interviewData);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (interviewToDelete) {
      try {
        // Assuming there's an API for deleting the interview
        await axios.delete(
          `http://localhost:8000/api/interview/${interviewToDelete.id}`
        );
        setInterviews((prev) =>
          prev.filter((interview) => interview.id !== interviewToDelete.id)
        );
        setSnackbarMessage("Interview deleted successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage("Failed to delete interview.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      setDeleteDialogOpen(false);
      setInterviewToDelete(null); // Reset the interview to delete
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setInterviewToDelete(null); // Reset the interview to delete
  };

  return (
    <>
      <Navbar />
      <Container sx={{ display: "flex", marginLeft: "40px" }}>
        <Box>
          <CustomTable
            title="Scheduled Interviews"
            primaryButton={
              <Button
                variant="contained"
                color="primary"
                sx={{ gap: "4px", padding: "8px 24px 8px 20px" }}
                onClick={() => {
                  setNewInterview(true);
                  setOpenModal(true);
                  setCurrentInterview(null);
                }}
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
            data={interviews}
            rowClickHandler={openEditInterview}
            onDeleteRow={handleDeleteInterview}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={unassignedFilter}
                  onChange={handleToggleUnassigned}
                />
              }
              label="Unassigned"
            />
            <FormControl variant="outlined" size="small" sx={{ ml: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={handleRoleChange}
                label="Role"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Team Lead">Team Lead</MenuItem>
                <MenuItem value="Intern">Intern</MenuItem>
              </Select>
            </FormControl>
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
        disableAutoFocus={true}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
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
          <InterviewForm
            register={newInterview}
            postApiCallback={(message: string) => {
              setOpenModal(false);
              if (message === "success") {
                setSnackbarMessage("Interview scheduled successfully.");
                setSnackbarSeverity("success");
              } else {
                setSnackbarMessage(message);
                setSnackbarSeverity("error");
              }
              setSnackbarOpen(true);
            }}
            interviewData={currentInterview}
          />
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this interview?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InterviewList;
