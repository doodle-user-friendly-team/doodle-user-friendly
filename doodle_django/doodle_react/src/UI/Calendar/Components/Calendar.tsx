import { CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";
import EditIcon from "@mui/icons-material/Edit";
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
import { AppointmentModel, ViewState } from "@devexpress/dx-react-scheduler";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PreferenceTSUser,
  PreferencesListDialog,
} from "./PreferencesListDialog";

//DATA INTERFACES
interface SchedulePool {
  voting_start_date: Date;
  voting_deadline: Date;
  time_slots: TimeSlot[];
  meeting: MeetingStartDate;
}
interface MeetingStartDate {
  period_start_date: Date;
}
interface TimeSlot {
  id: number;
  start_time: Date;
  end_time: Date;
  user: User;
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

  //url parameter of the schedule pool to render
  const { pool_link } = useParams();

  //util function to count number of users's preferences in a specific timeslot, grouped by availability
  function countAvailability(ts_id: number): PreferencesCount {
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

  const Header: React.ComponentType<AppointmentTooltip.HeaderProps> = ({
    appointmentData,
    ...reactProps
  }) => (
    <AppointmentTooltip.Header
      {...reactProps}
      w
      appointmentData={appointmentData}
    >
      <Grid2 justifyContent={"flex-end"} alignItems={"center"}>
        <IconButton sx={{ width: "auto", height: "auto" }}>
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
    return (
      <AppointmentTooltip.Content
        {...reactProps}
        appointmentData={appointmentData}
      >
        <Grid2 container flexDirection={"column"} sx={{ padding: "15px" }}>
          <Grid2 container flexDirection={"row"}>
            <FiberManualRecordIcon color="success" />
            <Typography>{availability.available} available</Typography>
          </Grid2>
          <Grid2 container flexDirection={"row"}>
            <FiberManualRecordIcon color="warning" />
            <Typography>{availability.maybe} mostly available</Typography>
          </Grid2>
          <Grid2 container flexDirection={"row"}>
            <FiberManualRecordIcon color="error" />
            <Typography>{availability.unavailable} unavailable</Typography>
          </Grid2>
        </Grid2>
      </AppointmentTooltip.Content>
    );
  };

  useEffect(() => {
    setIsPoolLoading(true);
    axios
      .get("http://localhost:8000/schedulePools/" + pool_link)
      .then((response) => response.data)
      .then((sp: SchedulePool[]) => {
        setPool(sp[0]);
        console.log(sp[0]);
        axios
          .get("http://localhost:8000/votes/")
          .then((response) => response.data)
          .then((votes: Preference[]) => {
            console.log(votes);
            let schedulepool_votes = votes.filter((v) =>
              sp[0].time_slots.some((t) => t.id === v.time_slot)
            );
            console.log(schedulepool_votes);
            setVotes(schedulepool_votes);
            setAreVotesLoading(false);
          });
        setIsPoolLoading(false);
      });
  }, []);

  if (isPoolLoading && areVotesLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Paper>
        <Scheduler data={mapTimeSlots(pool!.time_slots)}>
          <Toolbar />
          <ViewState defaultCurrentDate={pool!.meeting.period_start_date} />
          <WeekView startDayHour={6} endDayHour={23} />
          <TodayButton />
          <DateNavigator />
          <Appointments />
          <AppointmentTooltip
            showCloseButton
            headerComponent={Header}
            contentComponent={Content}
          />
        </Scheduler>
      </Paper>
      <PreferencesListDialog open={dialogOpen} tsId={dialogTimeslot} onClose={() => setDialogOpen(false)}/>
    </div>
  );
}
