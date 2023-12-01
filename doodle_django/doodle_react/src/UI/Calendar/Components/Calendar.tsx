import { Paper } from "@mui/material";
import { WeekView, Appointments, Scheduler, DateNavigator, Toolbar, AppointmentTooltip} from "@devexpress/dx-react-scheduler-material-ui"
import { AppointmentModel, ViewState } from "@devexpress/dx-react-scheduler";

interface calendarProps
{
    currentDate: Date,
    startDate: Date,
    // updateNewData:  (val: string) => void
}

export default function Calendar(props: calendarProps) {
    function getStartDate() : Date {
        if (props.currentDate >= props.startDate ) {
            return props.currentDate
        }
        return props.startDate
    }

    const timeslots : AppointmentModel[] = [
        {
            startDate: new Date("2023-12-01T12:00:00"),
            endDate: new Date("2023-12-01T12:30:00")
        }
    ]

    return (
        <Paper>
            <Scheduler data={timeslots} > 
                <ViewState defaultCurrentDate={getStartDate()}/>
                <WeekView startDayHour={6} endDayHour={23}/>
                <Toolbar />
                <DateNavigator />
                <Appointments />
                <AppointmentTooltip /> 
            </Scheduler>
        </Paper>
    );
}