
import { ContainerTimeSlots } from "./ViewTimeSlots";
import { MeetingRecap } from "./MeetingRecap";
import {useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Paper, Box, CircularProgress } from '@mui/material';




//---------------------PROPS---------------------

// PROP per ContainerTimeSlots
interface TimeSlot{
    id: number;
    start_time: string;
    end_time: string;
    user: string; // nome della persona
}
interface Meeting{
    start_meeting:string;
    end_meeting: string
    timeslots: TimeSlot[]
}


// PROP per MeetingRecap
interface MeetingState {
    meetingTitle: string;
    meetingDescription: string;
    meetingPlace: string;
    meetingDate: string;
    timeValue: string;
    isDeleteDialogOpen: boolean;
}

// PROP Richiesta HTTP
interface MeetingResponse{
    id: number;
    name: string;
    description: string;
    location: string;
    duration: number;
    period_start_date: string;
    period_end_date: string;
    organizer_link: string;
    user: UserResponse;
    schedule_pool: SchedulePoolResponse[];
}
interface UserResponse{
    id: number;
    name: string;
    surname: string;
    email: string;
}
interface SchedulePoolResponse{
    id: number;
    voting_start_date: string;
    voting_deadline: string;
    pool_link: string;
    meeting: number
    time_slots: TimeSlotResponse[];
}
interface TimeSlotResponse{
    id: number;
    start_time: string;
    end_time: string;
    user: NameUserResponse; // nome della persona
    schedule_pool: number;
}
interface NameUserResponse{
    name: string;
    surname: string;
}

//---------------------FINE-PROPS---------------------

//---------------------FUNZIONI---------------------

function convertMeetingResponseToMeeting(meetingResponse: MeetingResponse): Meeting {
    // Riduci la schedule_pool a un array di TimeSlot
    const timeslots: TimeSlot[] = meetingResponse.schedule_pool.reduce(
        (acc: TimeSlot[], pool: SchedulePoolResponse) => {
            // Mappa i time slots nella pool a TimeSlot dell'array
            const poolTimeSlots: TimeSlot[] = pool.time_slots.map(
                (timeSlot: TimeSlotResponse) => ({
                    id: timeSlot.id,
                    start_time: timeSlot.start_time,
                    end_time: timeSlot.end_time,
                    user: `${timeSlot.user.name} ${timeSlot.user.surname}`
                })
            );
            // Aggiungi gli elementi della pool all'array accumulatore
            return [...acc, ...poolTimeSlots];
        },
        []
    );
    // Costruisci l'oggetto Meeting
    return {
        start_meeting: meetingResponse.period_start_date,
        end_meeting: meetingResponse.period_end_date,
        timeslots: timeslots
    };
}

function convertMeetingResponseToMeetingState(meetingResponse: MeetingResponse): MeetingState {
    return {
        meetingTitle: meetingResponse.name,
        meetingDescription: meetingResponse.description,
        meetingPlace: meetingResponse.location,
        meetingDate: "In fase di votazione",
        timeValue: meetingResponse.duration.toString(),
        isDeleteDialogOpen: false // Imposta un valore predefinito per isDeleteDialogOpen
    };
}



//---------------------FINE-FUNZIONI---------------------

export function RecapOrganizer() {
    const [meetingData, setMeetingData] = useState<Meeting | null>(null);
    const [meetingStateData, setMeetingStateData] = useState<MeetingState | null>(null);
    const [loading, setLoading] = useState(true);

    const {link_meeting} = useParams();


    useEffect(() => {

        if (!link_meeting) {
            return ;
        }

        const fetchData = async () => {
        try {
            const response = await axios.get<MeetingResponse>(`http://localhost:8000/api/v1/meetings/${link_meeting}`);

            const transformedMeeting = convertMeetingResponseToMeeting(response.data);
            const transformedMeetingState = convertMeetingResponseToMeetingState(response.data);

            setMeetingData(transformedMeeting);
            setMeetingStateData(transformedMeetingState);
            setLoading(false);
        } catch (error) {
            console.error('Errore nella richiesta HTTP:', error);
        }
        };

        fetchData();
    }, [link_meeting]);

    
    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            {loading && <CircularProgress />}
            {meetingStateData && !loading && (
               
                <MeetingRecap {...meetingStateData} />
            )}
            {meetingData && !loading && (
                <Paper elevation={3} style={{ padding: 16, backgroundColor: '#f5f5f5', width: '80%' }}>
                <ContainerTimeSlots {...meetingData} />
                </Paper>
            )}
        </Box>
    );
}