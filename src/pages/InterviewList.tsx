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
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import moment, { Moment } from "moment";
import CustomTable from "../components/CustomTable";
import Switch from "@mui/material/Switch";
import Navbar from "../components/NavBar";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Modal, ModalClose } from "@mui/joy";
import InterviewForm from "../components/InterviewForm";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { BACKEND_URL } from "../constants";
import ThemeProvider from "../styles/ThemeProvider";
import InterviewModal from "../components/InterviewModal";
import '../App.css';

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
    tooltip: "",
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
    id: "Dept",
    tooltip: "",
    align: "left",
  },
  {
    id: "Interviewer",
    tooltip: "",
    align: "left",
  },
  {
    id: "Notes",
    tooltip: "",
    align: "left",
  },
];

interface Interview {
  id: number | null;
  interviewee: string;
  date: string;
  time: string;
  duration: string;
  role: string;
  department: string;
  interviewer: string;
  additional_notes: string;
  email: string;
  phone: string;
}

const InterviewList = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Moment | null>(moment());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [originalInterviews, setOriginalInterviews] = useState([]);
  const [unassignedFilter, setUnassignedFilter] = useState(false); // Track unassigned state
  const [openModal, setOpenModal] = useState(false); // State for modal visibility
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [newInterview, setNewInterview] = useState(true); // If true, modal will display register form. Else edit
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [calendarFilter, setCalendarFilter] = useState("none");
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
      const response = await axios.get(`${BACKEND_URL}/api/interview/date/`, {
        params: { date },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching interviews:", err);
      return [];
    }
  };

  const fetchInterviewsForWeek = async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/interview/date-range`,
        {
          params: { start_date: startDate, end_date: endDate },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching weekly interviews:", err);
      return [];
    }
  };

  const fetchInterviewsForMonth = async (month: number, year: number) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/interview/month`, {
        params: { month: month.toString().padStart(2, "0"), year },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching monthly interviews:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchByCalendarFilters = async () => {
      if (
        calendarFilter !== "week" &&
        calendarFilter !== "month" &&
        calendarFilter !== "work-week"
      )
        return;

      const response = await axios.get(
        `${BACKEND_URL}/api/interview/${calendarFilter}/`
      );
      setInterviews(response.data);
      setOriginalInterviews(response.data); // Store the original data for resetting purposes
    };
    fetchByCalendarFilters();
  }, [calendarFilter]);

  useEffect(() => {
    const filterInterviews = () => {
      let filteredData = [...originalInterviews];

      if (unassignedFilter) {
        filteredData = filteredData.filter(
          (obj: Interview) => !obj.interviewer
        );
      }

      if (roleFilter !== "all") {
        filteredData = filteredData.filter(
          (obj: Interview) => obj.role === roleFilter
        );
      }

      if (deptFilter !== "all") {
        filteredData = filteredData.filter(
          (obj: Interview) => obj.department === deptFilter
        );
      }

      setInterviews(filteredData);
    };

    filterInterviews();
  }, [unassignedFilter, roleFilter, deptFilter, originalInterviews]);

  useEffect(() => {
    const fetchInterviewsData = async () => {
      if (!date) return;

      if (view === "day") {
        // Fetch interviews for the specific day
        const formattedDate = date.format("YYYY-MM-DD");
        const interviewsData = await fetchInterviewsByDate(formattedDate);
        setInterviews(interviewsData);
        setOriginalInterviews(interviewsData);
      } else if (view === "week") {
        // Fetch interviews for the week
        const startDate = date.startOf("week").format("YYYY-MM-DD");
        const endDate = date.endOf("week").format("YYYY-MM-DD");
        const interviewsData = await fetchInterviewsForWeek(startDate, endDate);
        setInterviews(interviewsData);
        setOriginalInterviews(interviewsData);
      } else if (view === "month") {
        // Fetch interviews for the month
        const interviewsData = await fetchInterviewsForMonth(
          date.month() + 1,
          date.year()
        );
        setInterviews(interviewsData);
        setOriginalInterviews(interviewsData);
      }
    };

    fetchInterviewsData();
  }, [view, date]);

  const handleRoleChange = (event: any) => {
    setRoleFilter(event.target.value as string);
  };

  const handleDeptChange = (event: any) => {
    setDeptFilter(event.target.value as string);
  };

  const handleToggleUnassigned = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUnassignedFilter(event.target.checked);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangeCalendar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalendarFilter((event.target as HTMLInputElement).value);
  };
  const openEditInterview = (interviewData: Interview) => {
    setOpenDetailsModal(false);
    setNewInterview(false);
    setCurrentInterview(interviewData);
    setOpenModal(true);
  };

  const handleDeleteInterview = (interviewData: Interview) => {
    setInterviewToDelete(interviewData);
    setDeleteDialogOpen(true);
  };

  const handleSaveInterview = async (updatedInterview: Interview) => {
    try {
      // Make the PATCH API call to update the interview
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/interview/${updatedInterview.id}/`,
        updatedInterview
      );

      // Check if the update was successful
      if (response.status === 200) {
        // Optionally, update the local state with the updated interview
        setInterviews((prevInterviews) =>
          prevInterviews.map((interview) =>
            interview.id === updatedInterview.id ? updatedInterview : interview
          )
        );

        // Show a success message using Snackbar
        setSnackbarMessage("Interview updated successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Close the modal after saving
        // closeModals();
      }
    } catch (error) {
      // Handle any errors during the API call
      console.error("Error updating interview:", error);
      setSnackbarMessage("Failed to update interview.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (interviewToDelete) {
      try {
        // Assuming there's an API for deleting the interview
        await axios.delete(
          `${BACKEND_URL}/api/interview/${interviewToDelete.id}/`
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

  const openDetails = (interview: Interview) => {
    setCurrentInterview(interview); // Set the selected interview
    setOpenDetailsModal(true); // Open the details modal
  };

  const closeModals = () => {
    setOpenDetailsModal(false); // Close the details modal
  };

  return (
    <div className="schedule-container">
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
      

      <Container sx={{ display: "flex", marginLeft: "0px", padding: "0px" }}>
        <ThemeProvider>
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
                "department",
                "interviewer",
                "additional_notes",
              ]}
              data={interviews}
              rowClickHandler={(interviewData) => {
                setCurrentInterview(interviewData);
                // console.log(interviewData);
                setTimeout(() => {
                  setOpenDetailsModal(true);
                }, 1);
              }}
              onDeleteRow={handleDeleteInterview}
            />
          </Box>
          <Divider
            variant="middle"
            sx={{ marginTop: "25px" }}
            orientation="vertical"
            flexItem
          />
        </ThemeProvider>

        <Stack
          sx={{
            display: "flex",
            flexDirection: "column", // Align items vertically
            alignItems: "flex-start", // Align everything to the top
            marginTop: "0px",
            marginLeft: "10px",
            gap: 1, // Add spacing between the calendar, radio buttons, and filters
          }}
        >
          {/* Calendar */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Calendar
              date={date}
              handleDateChange={(newValue) => {
                setDate(newValue);
              }}
              view={view}
            />
          </Box>
          <ThemeProvider>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center", // Center the radio buttons
              }}
            >
              <FormControl>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={(event, newView) => {
                    if (newView !== null) {
                      setView(newView);
                    }
                  }}
                  aria-label="view options"
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid #ccc", // Optional: Add a border around the group
                  }}
                >
                  <ToggleButton value="day" aria-label="Day view">
                    Day
                  </ToggleButton>
                  <ToggleButton value="week" aria-label="Week view">
                    Week
                  </ToggleButton>
                  <ToggleButton value="month" aria-label="Month view">
                    Month
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            </Box>

            {/* Filters */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // Stack filters vertically
                justifyContent: "flex-start", // Align filters to the top
                alignItems: "center", // Center filters horizontally
                gap: 2, // Add spacing between filter elements
                width: "100%",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={unassignedFilter}
                    onChange={handleToggleUnassigned}
                  />
                }
                sx={{ paddingLeft: "8px" }}
                label="Unassigned"
              />
              <FormControl variant="outlined" size="small">
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

              <FormControl variant="outlined" size="small">
                <InputLabel>Dept</InputLabel>
                <Select
                  value={deptFilter}
                  onChange={handleDeptChange}
                  label="Dept"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                  <MenuItem value="Testing">Testing</MenuItem>
                  <MenuItem value="Cyber-Security">Cyber-Security</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </ThemeProvider>
          {/* Radio Buttons */}
        </Stack>
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
            sx={{ position: "absolute" }}
          />
          <ThemeProvider>
            <InterviewForm
              register={newInterview}
              postApiCallback={(
                message: string,
                newInterviewObj: Interview
              ) => {
                // postApiCallback={(message: string) => {
                setOpenModal(false);
                if (message === "success") {
                  setSnackbarMessage("Interview scheduled successfully.");
                  setSnackbarSeverity("success");
                  setInterviews((old) => [...old, newInterviewObj]);
                  const fetchInterviews = async () => {
                    if (!date) return;
                    setCalendarFilter("none"); // Disable calendar filter if a specific date is chosen

                    const formattedDate = date.format("YYYY-MM-DD");
                    const interviewsData = await fetchInterviewsByDate(
                      formattedDate
                    );

                    setInterviews(interviewsData);
                    setOriginalInterviews(interviewsData); // Update originalInterviews to reset filters correctly
                  };

                  fetchInterviews();
                } else {
                  setSnackbarMessage(message);
                  setSnackbarSeverity("error");
                }
                setSnackbarOpen(true);
              }}
              currId={
                interviews.length > 0
                  ? interviews[interviews.length - 1].id
                  : null
              }
              interviewData={currentInterview}
            />
          </ThemeProvider>
        </Box>
      </Modal>

      {currentInterview ? (
        <InterviewModal
          open={openDetailsModal}
          interview={currentInterview}
          onClose={closeModals}
          onSave={handleSaveInterview}
        />
      ) : null}
      <ThemeProvider>
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
      </ThemeProvider>
      
    </div>
  );
};

export default InterviewList;
