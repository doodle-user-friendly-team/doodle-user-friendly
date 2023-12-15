import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiberManualRecord } from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import Cookies from "js-cookie";

interface PreferencesListDialogProps {
  open: boolean;
  tsId: number;
  onClose: () => void;
}

interface NewTimeslotDialogProps {
  open: boolean;
  schedulePoolId: number;
  onClose: () => void;
}

interface PreferenceTSUser {
  id: number;
  preference: string;
  user: User;
}

interface User {
  id: number;
  name: string;
  surname: string;
}

export function NewTimeslotDialog(props: NewTimeslotDialogProps) {
  const { open, schedulePoolId, onClose } = props;

  const placeholderDate = dayjs(Date.now()).set("second", 0);
  const [dateValue, setDateValue] = useState<Dayjs | null>(placeholderDate);
  const [startTime, setStartTime] = useState<Dayjs | null>(placeholderDate);
  const [endTime, setEndTime] = useState<Dayjs | null>(placeholderDate);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);

  const handleClose = () => onClose();
  const handleSubmit = () => {
    const startDate = dateValue!
      .set("hour", startTime!.hour())
      .set("minute", startTime!.minute())
      .format("YYYY-MM-DDTHH:mm:ss[Z]");
    const endDate = dateValue!
      .set("hour", endTime!.hour())
      .set("minute", endTime!.minute())
      .format("YYYY-MM-DDTHH:mm:ss[Z]");
    console.log({ startDate, endDate });

    const csrfToken = Cookies.get("csrfToken");

    const headers = {
      "X-CSRFToken": csrfToken,
      "Content-Type": "application/json",
      "Authorization": "Token " + Cookies.get("token")
    };

    const postData = {
      start_time: startDate,
      end_time: endDate,
      schedule_pool: schedulePoolId
    };

    axios
      .post("http://localhost:8000/api/v1/timeslots/", postData, { headers })
      .then(() => setSnackOpen(true))
      .catch((error) => {
        console.error("Error on server response", error);
      });
  };

  return (
    <Box>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Timeslot</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Specify the date and time you want to propose for this meeting
        </DialogContentText>
        <Stack sx={{ paddingY: "10px" }} spacing={3} direction={"row"}>
          <DatePicker
            value={dateValue}
            onChange={(newValue) => setDateValue(newValue)}
            label="Date of meeting"
          />
          <TimePicker
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            label="Start Time"
          />
          <Typography variant="h3"> - </Typography>
          <TimePicker
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            label="End Time"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
    <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
          message="Timeslot successfully added"
        />
    </Box>
  );
}

export function PreferencesListDialog(props: PreferencesListDialogProps) {
  const { open, tsId, onClose } = props;
  const [prefList, setPrefList] = useState<PreferenceTSUser[]>();
  const [isPrefListLoading, setIsPrefListLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/votes/?id=" + tsId)
      .then((response) => response.data)
      .then((p) => {
        setPrefList(p);
        console.log(p);
        setIsPrefListLoading(false);
      });
  }, []);

  return isPrefListLoading ? (
    <Dialog open={open} onClose={onClose}>
      <CircularProgress />
    </Dialog>
  ) : (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{tsId}</DialogTitle>
      <DialogContent>
        <List>
          {prefList!.map((p) => (
            <ListItem key={p.id}>
              <ListItemIcon>
                <FiberManualRecord
                  color={
                    p.preference == "Available"
                      ? "success"
                      : p.preference == "Maybe Available"
                      ? "warning"
                      : "error"
                  }
                />
              </ListItemIcon>
              <ListItemText primary={p.user.name + " " + p.user.surname} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
