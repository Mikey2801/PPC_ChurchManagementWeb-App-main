import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, parseISO, addHours } from "date-fns";
import api from "../../utils/api";

export default function ScheduleMass() {
  // Calendar state
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Data state
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false); // Start false - calendar will trigger fetch on mount
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    title: "",
    pastor: "",
    description: "",
  });

  /**
   * Transform mass schedule data from API format to FullCalendar event format
   * Converts date and time strings into a datetime object for FullCalendar
   */
  const formatSchedulesToEvents = (schedules) => {
    return schedules.map((schedule) => {
      // Combine date and time into a datetime string
      const dateStr = schedule.date;
      const timeStr = schedule.time || "00:00";
      const datetimeStr = `${dateStr}T${timeStr}:00`;

      // Parse the datetime and create end time (default 1 hour duration)
      const startDate = parseISO(datetimeStr);
      const endDate = addHours(startDate, 1);

      // Determine event color based on type or use default green
      // You can customize this logic based on your needs
      const eventColor = "#4caf50"; // Green for mass schedules

      return {
        id: schedule.schedule_id.toString(),
        title: schedule.title,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        backgroundColor: eventColor,
        borderColor: eventColor,
        classNames: ["mass-schedule-event"], // Custom class for styling
        extendedProps: {
          schedule_id: schedule.schedule_id,
          pastor: schedule.pastor,
          description: schedule.description,
        },
      };
    });
  };

  /**
   * Fetch mass schedules from API with optional date range filtering
   * @param {string} startDate - Start date in YYYY-MM-DD format (optional)
   * @param {string} endDate - End date in YYYY-MM-DD format (optional)
   */
  const fetchSchedules = async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      setError("");

      // Build query parameters for date range filtering
      const params = {};
      if (startDate) {
        params.startDate = format(startDate, "yyyy-MM-dd");
      }
      if (endDate) {
        params.endDate = format(endDate, "yyyy-MM-dd");
      }

      const response = await api.get("/api/mass-schedules", { params });
      setSchedules(response.data.data || []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load mass schedules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle clicking on a date/time slot in the calendar
   * Opens the add dialog with pre-filled date and time
   */
  const handleDateClick = (arg) => {
    try {
      const clickedDate = arg.date;
      const dateStr = format(clickedDate, "yyyy-MM-dd");
      const timeStr = format(clickedDate, "HH:mm");

      setEditingSchedule(null);
      setFormData({
        date: dateStr,
        time: timeStr,
        title: "",
        pastor: "",
        description: "",
      });
      setOpenDialog(true);
    } catch (err) {
      console.error("Error in handleDateClick:", err);
      setError("Failed to open schedule dialog. Please try again.");
    }
  };

  /**
   * Handle clicking on an existing event in the calendar
   * Opens the edit dialog with event data or shows context menu
   */
  const handleEventClick = (clickInfo) => {
    try {
      const event = clickInfo.event;
      const scheduleId = parseInt(event.id);

      // Find the original schedule data
      const schedule = schedules.find((s) => s.schedule_id === scheduleId);
      if (!schedule) return;

      // Open edit dialog
      setEditingSchedule(schedule);
      setFormData({
        date: schedule.date,
        time: schedule.time,
        title: schedule.title,
        pastor: schedule.pastor || "",
        description: schedule.description || "",
      });
      setOpenDialog(true);
    } catch (err) {
      console.error("Error in handleEventClick:", err);
      setError("Failed to open edit dialog. Please try again.");
    }
  };

  /**
   * Handle when calendar dates change (navigation, view change)
   * Fetches schedules for the visible date range
   * This fires when the calendar first renders and on navigation
   */
  const handleDatesSet = (arg) => {
    try {
      setCurrentDate(arg.start);
      setCurrentView(arg.view.type);

      // Fetch schedules for the visible date range
      fetchSchedules(arg.start, arg.end);
    } catch (err) {
      console.error("Error in handleDatesSet:", err);
      // Don't break the calendar if there's an error
    }
  };

  /**
   * Open dialog for adding or editing a schedule
   */
  const handleOpenDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        date: schedule.date,
        time: schedule.time,
        title: schedule.title,
        pastor: schedule.pastor || "",
        description: schedule.description || "",
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        date: "",
        time: "",
        title: "",
        pastor: "",
        description: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
    setFormData({
      date: "",
      time: "",
      title: "",
      pastor: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission for creating or updating a schedule
   */
  const handleSubmit = async () => {
    try {
      if (!formData.date || !formData.time || !formData.title) {
        setError("Date, time, and title are required");
        return;
      }

      if (editingSchedule) {
        await api.put(
          `/api/mass-schedules/${editingSchedule.schedule_id}`,
          formData
        );
        setSuccessMessage("Mass schedule updated successfully");
      } else {
        await api.post("/api/mass-schedules", formData);
        setSuccessMessage("Mass schedule created successfully");
      }

      handleCloseDialog();

      // Refresh calendar data - get current view's date range
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const view = calendarApi.view;
        fetchSchedules(view.activeStart, view.activeEnd);
      } else {
        fetchSchedules();
      }
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError(err.response?.data?.message || "Failed to save mass schedule");
    }
  };

  /**
   * Handle deletion of a mass schedule
   */
  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this mass schedule?")
    ) {
      return;
    }

    try {
      await api.delete(`/api/mass-schedules/${id}`);
      setSuccessMessage("Mass schedule deleted successfully");

      // Refresh calendar data
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const view = calendarApi.view;
        fetchSchedules(view.activeStart, view.activeEnd);
      } else {
        fetchSchedules();
      }
    } catch (err) {
      console.error("Error deleting schedule:", err);
      setError(err.response?.data?.message || "Failed to delete mass schedule");
    }
  };

  // Convert schedules to FullCalendar event format
  const calendarEvents = formatSchedulesToEvents(schedules);

  // Suppress browser extension errors that don't affect functionality
  useEffect(() => {
    const handleError = (event) => {
      // Suppress extension-related errors that are harmless
      if (
        event.message &&
        event.message.includes("message channel closed") &&
        event.message.includes("asynchronous response")
      ) {
        event.preventDefault();
        // Optionally log for debugging but don't show to user
        console.warn("Browser extension error suppressed:", event.message);
        return false;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", (event) => {
      if (
        event.reason &&
        event.reason.message &&
        event.reason.message.includes("message channel closed")
      ) {
        event.preventDefault();
        console.warn("Browser extension promise rejection suppressed:", event.reason.message);
      }
    });

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Mass Schedules
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            color: "white",
            "& .MuiSvgIcon-root": {
              color: "white",
            },
          }}
        >
          Add Schedule
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert severity="success" onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Calendar Component */}
      <Box
        sx={{
          position: "relative",
          minHeight: "600px", // Ensure calendar has minimum height
          "& .fc": {
            fontFamily: "inherit",
          },
          // Style events to look like pills with rounded corners
          "& .fc-event": {
            cursor: "pointer",
            borderRadius: "20px", // Pill-shaped with rounded ends
            padding: "4px 8px",
            fontSize: "0.875rem",
            border: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            transition: "all 0.2s ease",
          },
          "& .fc-event:hover": {
            opacity: 0.85,
            transform: "translateY(-1px)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.16)",
          },
          "& .fc-daygrid-event": {
            borderRadius: "20px",
            border: "none",
          },
          "& .fc-timegrid-event": {
            borderRadius: "20px",
            border: "none",
          },
          // Style for week view time slots
          "& .fc-timegrid-event .fc-event-main": {
            padding: "4px 8px",
          },
          // Style for month view events
          "& .fc-daygrid-event-dot": {
            display: "none", // Hide default dot
          },
          // Button styling
          "& .fc-button": {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "4px",
          },
          "& .fc-button-primary": {
            backgroundColor: "#1976d2",
            borderColor: "#1976d2",
          },
          "& .fc-button-primary:hover": {
            backgroundColor: "#1565c0",
            borderColor: "#1565c0",
          },
          "& .fc-button-primary:not(:disabled):active": {
            backgroundColor: "#0d47a1",
            borderColor: "#0d47a1",
          },
          // Toolbar styling
          "& .fc-toolbar-title": {
            fontSize: "1.25rem",
            fontWeight: 500,
          },
          // View button active state
          "& .fc-button-active": {
            backgroundColor: "#e3f2fd",
            color: "#1976d2",
          },
          // Calendar grid styling
          "& .fc-col-header-cell": {
            padding: "8px 4px",
            fontWeight: 500,
          },
          "& .fc-timegrid-slot": {
            height: "2.5em",
          },
        }}
      >
        {/* Show loading overlay only when loading and we have no data yet */}
        {loading && schedules.length === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "today prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          views={{
            timeGridWeek: {
              slotMinTime: "09:00:00",
              slotMaxTime: "18:00:00",
              allDaySlot: false,
            },
            dayGridMonth: {
              allDaySlot: false,
            },
          }}
          events={calendarEvents}
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="600px"
          eventDisplay="block"
          eventTextColor="#fff"
        />
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSchedule ? "Edit Mass Schedule" : "Add Mass Schedule"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              name="date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="time"
              label="Time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="pastor"
              label="Pastor/Speaker"
              value={formData.pastor}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {editingSchedule && (
            <Button
              onClick={() => {
                handleCloseDialog();
                handleDelete(editingSchedule.schedule_id);
              }}
              color="error"
              sx={{ mr: "auto" }}
            >
              Delete
            </Button>
          )}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSchedule ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
