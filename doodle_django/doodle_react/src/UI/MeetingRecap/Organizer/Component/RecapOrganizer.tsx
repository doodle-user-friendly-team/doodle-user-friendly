
import { ContainerTimeSlots } from "./ViewTimeSlots";
import {useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Paper, Box, CircularProgress } from '@mui/material';
import {TopBarComponent} from "../../../Dashboard/Component/TopBarComponent";
import * as React from "react";
import { ContainerTitle } from "./ViewMeeting";
import Backdrop from '@mui/material/Backdrop';



//---------------------PROPS---------------------

// PROP per ContainerTimeSlots
interface TimeSlot{
    id: number;
    start_time: string;
    end_time: string;
    user: string; // nome della persona
    count_available: number;
    count_unavailable: number;
    count_maybe: number;
}
interface Meeting{
    start_meeting:string;
    end_meeting: string
    timeslots: TimeSlot[]
}

// PROP per ContainerTitle
interface ContainerTitleProps {
    id: number; //meeting_id
    title: string;
    description: string; 
    location: string;
    date: string; //data decisa dal creatore, default: "In fase di votazione"
    duration: number; //durata meeting
    period_start_date: string; //data inizio periodo 
    period_end_date: string; //data fine periodo 
    voting_deadline: string; //data fine votazione
    organizer_link: string; //pool_link
    link: string; //meeting_link
    user: number; //user_id
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
    final_date: string;
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
    count_available: number;
    count_unavailable: number;
    count_maybe: number;
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
                    user: `${timeSlot.user.name} ${timeSlot.user.surname}`,
                    count_available: timeSlot.count_available,
                    count_unavailable: timeSlot.count_unavailable,
                    count_maybe: timeSlot.count_maybe
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





function extractContainerTitleProps(meeting: MeetingResponse): ContainerTitleProps {
    const pool = meeting.schedule_pool[0]; // Assuming there's only one schedule pool
  
    return {
        id: meeting.id,
        title: meeting.name,
        description: meeting.description,
        location: meeting.location,
        date: pool.final_date,
        voting_deadline: pool.voting_deadline,
        duration:  meeting.duration,
        period_start_date: meeting.period_start_date,
        period_end_date: meeting.period_end_date,
        organizer_link: meeting.organizer_link,
        user: meeting.user.id,
        link: pool.pool_link,
    };
}



//---------------------FINE-FUNZIONI---------------------

export function RecapOrganizer() {
    const [meetingData, setMeetingData] = useState<Meeting | null>(null);
    const [meetingInfo, setMeetingInfo] = useState<ContainerTitleProps | null>(null);
    const [loading, setLoading] = useState(true);

    const {link_meeting} = useParams();

    //script che se è in loading fa una richiesta ogni 5 secondi se no visualizza subito i dati
    useEffect(() => {
        let fetchDataTimeout:any;
      
        const fetchDataNow = async () => {
            const data = await fetchData();
            // Verifica se hai ricevuto i dati
            if (data) {
                // Se hai ricevuto i dati, cancella l'intervallo
                clearInterval(fetchDataTimeout);
            }
        };
      
        fetchDataNow(); // Esegui subito al montaggio del componente
      
        // Imposta un intervallo che chiama fetchData ogni 5 secondi solo se i dati non sono stati ricevuti
        fetchDataTimeout = setInterval(() => {
          fetchDataNow();
        }, 5000);
      
        return () => {
          clearInterval(fetchDataTimeout);
        };
      }, []);


    const fetchData = async () => {
        if (!link_meeting) {
            return false;
        }
        try {
            const response = await axios.get<MeetingResponse>(`http://localhost:8000/api/v1/meetings/details/${link_meeting}`);
            const transformedMeeting = convertMeetingResponseToMeeting(response.data);
            const transformedMeetingData = extractContainerTitleProps(response.data);

            setMeetingData(transformedMeeting);
            setMeetingInfo(transformedMeetingData);
            setLoading(false);
            return true;
        } catch (error) {
            console.error('Errore nella richiesta HTTP:', error);
            return false
        }
    };


    
    return (
        <>
            <TopBarComponent />
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{ marginTop: '0.5em', padding: '2.5em', paddingBottom: '0'}}
                >
                    {loading && 
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme:any) => theme.zIndex.drawer + 1 }}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    }
                    {meetingInfo && !loading && (
                    <Paper elevation={3} style={{ padding: 8, backgroundColor: '#f5f5f5', marginTop: '2em', width:'100%' }}>
                        <Box textAlign="center">
                        <ContainerTitle  {...meetingInfo} />
                        </Box>
                    </Paper>
                    )}
                    {meetingData && !loading && (
                    <Paper elevation={3} style={{ padding: 8, backgroundColor: '#f5f5f5', margin: '2em' , width: '100%'}}>
                        <Box textAlign="center">
                        <ContainerTimeSlots {...meetingData} />
                        </Box>
                    </Paper>
                    )}
                </Box>
        </>
    );

}