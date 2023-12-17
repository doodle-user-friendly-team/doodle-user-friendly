import {
  AppBar,
  Toolbar as MuiToolbar,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  WeekView,
  Appointments,
  Scheduler,
  DateNavigator,
  Toolbar,
  AppointmentTooltip,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import {
  AppointmentModel,
  ViewState,
} from "@devexpress/dx-react-scheduler";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NewTimeslotDialog, PreferencesListDialog } from "./UserRecapDialog";
import { MofifyPreferenceForm } from "../../Preference/Components/ModifyPreferenceForm";

//DATA INTERFACES
export interface SchedulePool {
  id: number;
  voting_start_date: Date;
  voting_deadline: Date;
  time_slots: DetailedTimeSlot[];
  meeting: Meeting;
}
interface Meeting {
  period_start_date: Date;
  duration: number;
}
interface TimeSlot {
  id: number;
  start_time: Date;
  end_time: Date;
  user: User;
}

interface DetailedTimeSlot {
  id: number;
  start_time: Date;
  end_time: Date;
  user: User;
  preferences: Preference[];
}

interface User {
  id: number;
  name: string;
  surname: string;
}
export interface Preference {
  id: number;
  preference: string;
  time_slot: number;
  user: number;
}
interface PreferencesCount {
  available: number;
  maybe: number;
  unavailable: number;
}

//Taken from AndreaYpmY
interface ModifyPreferenceProps {
  id: number;
  user: number;
  time_slot: number;
  selectedPreference: string;
  onClose: () => void;
  start: string;
  end: string;
  date: string;
}

//BASE COMPONENT
export default function Calendar() {
  //used to wait on rendering component until data has been loaded
  const [isPoolLoading, setIsPoolLoading] = useState<boolean>(true);
  const [areVotesLoading, setAreVotesLoading] = useState<boolean>(true);

  //stateful variables for timeslots and votes
  const [pool, setPool] = useState<SchedulePool>();
  const [votes, setVotes] = useState<Preference[]>();

  //stateful variables for Dialog of list of preferences on a specific timeslot
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogTimeslot, setDialogTimeslot] = useState<number>(1);

  const [modifyDialogOpen, setModifyDialogOpen] = useState<boolean>(false);
  const [modifyDialogProps, setModifyDialogProps] =
    useState<ModifyPreferenceProps>({
      id: 0,
      user: 1,
      time_slot: 1,
      selectedPreference: "Available",
      onClose: () => setModifyDialogOpen(false),
      start: Date.now().toString(),
      end: Date.now().toString(),
      date: Date.now().toString(),
    });

  const [newTimeslotOpen, setNewTimeslotOpen] = useState<boolean>(false);

  //url parameter of the schedule pool to render
  const { pool_link } = useParams();

  //util function to count number of users's preferences in a specific timeslot, grouped by availability
  function countAvailability(ts_id: number): PreferencesCount {
    if (!votes) {
      console.log("No votes")
      return { available: 0, maybe: 0, unavailable: 0 };
    }
    return {
      available: votes!.filter(
        (v) => v.time_slot === ts_id && v.preference === "Available"
      ).length,
      maybe: votes!.filter(
        (v) => v.time_slot === ts_id && v.preference === "Maybe available"
      ).length,
      unavailable: votes!.filter(
        (v) => v.time_slot === ts_id && v.preference === "Unavailable"
      ).length,
    };
  }

  //util function to map timeslots data to AppointmentModel for Tooltip rendering
  function mapTimeSlots(tss: TimeSlot[]): AppointmentModel[] {
    return tss.map((ts) => ({
      id: ts.id,
      startDate: ts.start_time,
      endDate: ts.end_time,
    }));
  }

  function getUserProposed(ts_id: number): User {
    return pool!.time_slots.find((ts) => ts.id === ts_id)!.user;
  }

  function modifyPreference(ts_id: number) {
    const preference = votes!.find(
      (v) => v.time_slot === ts_id && v.user === 1
    );
    const ts = pool!.time_slots.find((ts) => ts.id === ts_id);
    setModifyDialogProps({
      id: preference!.id, //TODO: get preference based on current user,
      user: 1, //TODO: get current user,
      time_slot: ts_id,
      selectedPreference: preference!.preference,
      onClose: () => setModifyDialogOpen(false),
      start: ts!.start_time.toString(),
      end: ts!.end_time.toString(),
      date: ts!.start_time.toString(),
    });
    setModifyDialogOpen(true);
  }

  const Header: React.ComponentType<AppointmentTooltip.HeaderProps> = ({
    appointmentData,
    ...reactProps
  }) => (
    <AppointmentTooltip.Header
      {...reactProps}
      appointmentData={appointmentData}
    >
      <Grid2 justifyContent={"flex-end"} alignItems={"center"}>
        <IconButton
          onClick={() => modifyPreference(Number(appointmentData!.id!))}
          sx={{ width: "auto", height: "auto" }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setDialogTimeslot(Number(appointmentData!.id!));
            setDialogOpen(true);
          }}
          sx={{ width: "auto", height: "auto" }}
        >
          <ListIcon />
        </IconButton>
      </Grid2>
    </AppointmentTooltip.Header>
  );

  const Content: React.ComponentType<AppointmentTooltip.ContentProps> = ({
    appointmentData,
    ...reactProps
  }) => {
    let availability: PreferencesCount = countAvailability(
      Number(appointmentData!.id!)
    );
    let user: User = getUserProposed(Number(appointmentData!.id!));
    return (
      <AppointmentTooltip.Content
        {...reactProps}
        appointmentData={appointmentData}
      >
        <Grid2 container flexDirection={"row"} sx={{ padding: "15px" }}>
          <PersonIcon color="secondary" />
          <Typography>
            Proposed by {user.name} {user.surname}
          </Typography>
        </Grid2>
        <Grid2 container flexDirection={"column"} sx={{ padding: "15px" }}>
          <Grid2 container flexDirection={"row"} sx={{ paddingY: "3px" }}>
            <FiberManualRecordIcon color="success" />
            <Typography>{availability.available} available</Typography>
          </Grid2>
          <Grid2 container flexDirection={"row"} sx={{ paddingY: "3px" }}>
            <FiberManualRecordIcon color="warning" />
            <Typography>{availability.maybe} mostly available</Typography>
          </Grid2>
          <Grid2 container flexDirection={"row"} sx={{ paddingY: "3px" }}>
            <FiberManualRecordIcon color="error" />
            <Typography>{availability.unavailable} unavailable</Typography>
          </Grid2>
        </Grid2>
      </AppointmentTooltip.Content>
    );
  };

  const Appointment: React.ComponentType<Appointments.AppointmentProps> = ({
    data,
    children,
    ...restProps
  }) => {
    let availability : PreferencesCount = countAvailability(Number(data.id!));
    return (
    <Appointments.Appointment data={data} {...restProps}>
      {children}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 5}}>
        <DoneIcon />
        <Typography variant="body1">
          {availability.available}
       </Typography>
       <QuestionMarkIcon />
        <Typography variant="body1">
          {availability.maybe}
       </Typography>
       <CloseIcon />
        <Typography variant="body1">
          {availability.unavailable}
       </Typography>
      </div>
    </Appointments.Appointment>
  )};

  useEffect(() => {
    setIsPoolLoading(true);

    axios.get("http://localhost:8000/api/v1/schedule_pool/" + pool_link).then
    ((response) => {
      console.log(response.data);
      setPool(response.data[0]);

      let scp: SchedulePool = response.data[0];
      var votes: Preference[] = [];
      scp.time_slots.forEach((ts: DetailedTimeSlot) => {
        ts.preferences.forEach((p) => {
          votes.push(p);
        });
      });
        setVotes(votes);
        setAreVotesLoading(false);
        setIsPoolLoading(false);
    });
  }, []);

  if (isPoolLoading && areVotesLoading) {
    return <CircularProgress />;
  }
  return (
    <Box>
      <Box sx={{ display: "block" }}>
        <AppBar position="sticky">
          <MuiToolbar>
            <Button color="inherit" onClick={() => setNewTimeslotOpen(true)}>
              New Timeslot
            </Button>
          </MuiToolbar>
        </AppBar>
        <Scheduler data={mapTimeSlots(pool!.time_slots)}>
          <ViewState defaultCurrentDate={pool!.meeting.period_start_date} />
          <WeekView startDayHour={6} endDayHour={23} />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments appointmentComponent={Appointment} />
          <AppointmentTooltip
            showCloseButton
            headerComponent={Header}
            contentComponent={Content}
          />
        </Scheduler>
        <PreferencesListDialog
          open={dialogOpen}
          tsId={dialogTimeslot}
          onClose={() => setDialogOpen(false)}
        />
        <NewTimeslotDialog
          open={newTimeslotOpen}
          schedulePoolId={pool!.id}
          onClose={() => setNewTimeslotOpen(false)}
          meetingDuration={pool!.meeting.duration}
        />
        {modifyDialogOpen ? (
          <MofifyPreferenceForm {...modifyDialogProps} />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
