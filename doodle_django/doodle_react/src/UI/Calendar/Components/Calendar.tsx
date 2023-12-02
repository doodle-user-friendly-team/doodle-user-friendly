import { AppBar, IconButton, Paper, Typography } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import EditIcon from '@mui/icons-material/Edit';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { WeekView, Appointments, Scheduler, DateNavigator, Toolbar, AppointmentTooltip, TodayButton} from "@devexpress/dx-react-scheduler-material-ui"
import { AppointmentModel, ViewState } from "@devexpress/dx-react-scheduler";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

interface CalendarProps
{
    currentDate: Date,
    startDate: Date,
}

interface PreferencesCount
{
    available: number,
    maybe: number,
    unavailable: number
}

export default function Calendar(props: Readonly<CalendarProps>) {
    function getStartDate() : Date {
        if (props.currentDate >= props.startDate ) {
            return props.currentDate
        }
        return props.startDate
    }

    const AppointmentList = () => (
        <Paper elevation={5}>
            <Typography fontSize={"large"}>Prova</Typography>
        </Paper>
    )

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

    const count: number = 2;

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
    
    const timeslots : AppointmentModel[] = [
        {
            startDate: new Date("2023-12-04T12:00:00"),
            endDate: new Date("2023-12-04T12:30:00"),
            prefs: {available: 2, maybe: 5, unavailable: 3}
        },
        {
            startDate: new Date("2023-12-04T10:00:00"),
            endDate: new Date("2023-12-04T10:30:00")
        },
        {
            startDate: new Date("2023-12-03T12:00:00"),
            endDate: new Date("2023-12-03T12:30:00")
        },
        {
            startDate: new Date("2023-12-02T08:00:00"),
            endDate: new Date("2023-12-02T08:30:00")
        }
    ]
    
    return (
        <Paper>
            <Scheduler data={timeslots} > 
                <Toolbar />
                <ViewState defaultCurrentDate={getStartDate()}/>
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