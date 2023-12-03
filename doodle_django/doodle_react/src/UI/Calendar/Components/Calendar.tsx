import { CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";
import EditIcon from '@mui/icons-material/Edit';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { WeekView, Appointments, Scheduler, DateNavigator, Toolbar, AppointmentTooltip, TodayButton} from "@devexpress/dx-react-scheduler-material-ui"
import { AppointmentModel, ViewState } from "@devexpress/dx-react-scheduler";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface SchedulePool
{
    voting_start_date: Date,
    voting_deadline: Date,
    time_slots: TimeSlot[]
    meeting: MeetingStartDate
}
interface MeetingStartDate{
    period_start_date: Date
}
interface TimeSlot
{
    id: number,
    start_time: Date,
    end_time: Date,
    user: User,
    preferences: Preference[]
}

interface User
{
    name: string,
    surname: string,
}
interface Preference
{
    user_id: number,
    pref: string
}
interface PreferencesCount
{
    available: number,
    maybe: number,
    unavailable: number
}

export default function Calendar() {
    
    const [isPoolLoading, setIsPoolLoading] = useState<boolean>(true);
    const [pool, setPool] = useState<SchedulePool>();
    
    // [
    //     {
    //         startDate: new Date("2023-12-04T12:00:00"),
    //         endDate: new Date("2023-12-04T12:30:00")
    //     },
    //     {
    //         startDate: new Date("2023-12-04T10:00:00"),
    //         endDate: new Date("2023-12-04T10:30:00")
    //     },
    //     {
    //         startDate: new Date("2023-12-03T12:00:00"),
    //         endDate: new Date("2023-12-03T12:30:00")
    //     },
    //     {
    //         startDate: new Date("2023-12-02T08:00:00"),
    //         endDate: new Date("2023-12-02T08:30:00")
    //     }
    // ]
    
    const Header : React.ComponentType<AppointmentTooltip.HeaderProps> = ({appointmentData, ...reactProps}) => (
        <AppointmentTooltip.Header {...reactProps} appointmentData={appointmentData}>
            <Grid2 justifyContent={'flex-end'}>
                <IconButton sx={{width: 'auto', height: 'auto'}}>
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => {console.log("test")} } sx={{width: 'auto', height: 'auto'}}>
                    <ListIcon />
                </IconButton>
            </Grid2>
        </AppointmentTooltip.Header>
    )
    
    const {pool_link} = useParams();
    function getTimeSlots() {
        axios.get("http://localhost:8000/schedulePools/" + pool_link).then(response => response.data).then((sp: SchedulePool[]) => {
            sp.forEach(i => {
                setPool(i);
                console.log(pool)
                setIsPoolLoading(false);
            })
        });
    }

    function mapTimeSlots(tss: TimeSlot[]) : AppointmentModel[] {
        return tss.map(ts => (
            {
                id: ts.id,
                startDate: ts.start_time,
                endDate: ts.end_time
            }
        ))   

    }
    
    const Content : React.ComponentType<AppointmentTooltip.ContentProps> = ({appointmentData, ...reactProps}) => (
        <AppointmentTooltip.Content {...reactProps} appointmentData={appointmentData}>
            <Grid2 container flexDirection={"column"} sx={{padding: '15px'}}>
                <Grid2 container flexDirection={"row"} >
                    <FiberManualRecordIcon color='success'/>
                    <Typography>2 available</Typography>
                </Grid2>
                <Grid2 container flexDirection={"row"} >
                    <FiberManualRecordIcon color='warning'/>
                    <Typography>2 mostly available</Typography>
                </Grid2>
                <Grid2 container flexDirection={"row"} >
                    <FiberManualRecordIcon color='error' />
                    <Typography>2 unavailable</Typography>
                </Grid2>
            </Grid2>
        </AppointmentTooltip.Content>     
    )
    useEffect(() =>{
        setIsPoolLoading(true)
        getTimeSlots();
    }, []);
    
    if (isPoolLoading) {
        return <CircularProgress />
    }
      
    return (
        <Paper>
            <Scheduler data={mapTimeSlots(pool!.time_slots)} > 
            <Toolbar />
            <ViewState defaultCurrentDate={pool!.meeting.period_start_date}/>
            <WeekView startDayHour={6} endDayHour={23}/>
            <TodayButton />
            <DateNavigator />
            <Appointments />
            <AppointmentTooltip showCloseButton
                headerComponent={Header}
                contentComponent={Content}
                /> 
            </Scheduler>
        </Paper>
    );
}