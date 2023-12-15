import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {TopBarComponent} from "./TopBarComponent";
import axios from "axios";
import { Grid } from '@mui/material';
import Cookies from "js-cookie";

interface MeetingInterface {
    id: number;
    name: string;
    description: string;
    location: string;
    duration: number;
    period_start_date: string;
    period_end_date: string;
    organizer_link: string;
}

interface SchedulePool {
    id: number;
    voting_start_date: Date;
    voting_deadline: Date;
    meeting: MeetingInterface;
    pool_link: string;
}   

let my_meetings: MeetingInterface[] = [];
let others_meetings: SchedulePool[] = [];

export function DashboardComponent() {
    
    const [updateMeetings, setupdateMeetings] = React.useState(false);
    
    const token = Cookies.get('token');
    
    if (!updateMeetings) {
        
        axios.get('http://localhost:8000/api/v1/meetings/', {headers: { 'authorization': `Token ${token}`}}).then((response) => {
            
            my_meetings = [];
            
            response.data.forEach((meeting: MeetingInterface) => {
                my_meetings.push(meeting);
            });
            
            console.log(my_meetings);

            axios.get('http://localhost:8000/api/v1/schedulepool/', {headers: { 'authorization': `Token ${token}`}}).then((response) => {
                others_meetings = [];
                
                response.data.forEach((meeting: SchedulePool) => {
                    others_meetings.push(meeting);
                });
                
                setupdateMeetings(true)
            })
        })
    }

    return (
        <>
            <TopBarComponent/>
            
            <Paper elevation={3} sx={{ p: 2, width: 300, height: 300, position: 'fixed', marginTop: '5%', marginLeft: '2%'}}>
                <Typography variant="h6" component="h2">
                    Planning
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Manage your planning
                </Typography>
                <Button variant="contained" onClick={() => window.location.assign("/create-meeting")}>Create meeting</Button>
            </Paper>
            
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                sx = {{paddingTop: "5%", paddingLeft: "25%"}}>
                <>
                    <Paper elevation={3} sx={{ p: 2, width: "40%", height: "auto"}}>
                        <Typography variant="h6" component="h2" sx={{textAlign: "center", marginBottom: "25px", marginTop: "10px"}}>
                            Your Meetings
                        </Typography>
                        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {
                            my_meetings.map((meeting: MeetingInterface) => {
                                
                                return (
                                    <Grid item  xs={6}>
                                        <Paper elevation={3} sx={{height: 150, textAlign: "center"}}>
                                            <Typography variant="h6" component="h2">
                                                {meeting.name}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                {meeting.description}
                                            </Typography>
                                            <Button variant="contained" 
                                                    onClick={() => window.location.assign("/recap-meeting/" + meeting.organizer_link)}
                                                    sx={{top: 45}}>
                                                Recap
                                            </Button>
                                        </Paper>
                                    </Grid>
                                );
                            })
                        }
                        </Grid>
                    </Paper>


                    <Paper elevation={3} sx={{ p: 2, width: "40%", height: "auto"}}>
                        <Typography variant="h6" component="h2" sx={{textAlign: "center", marginBottom: "25px", marginTop: "10px"}}>
                            Meetings to vote
                        </Typography>
                        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {
                                others_meetings.map((meeting: SchedulePool) => {

                                    return (
                                        <Grid item key={meeting.pool_link} xs={6}>
                                            <Paper elevation={3} sx={{height: 150, textAlign: "center"}}>
                                                <Typography variant="h6" component="h2">
                                                    {meeting.meeting.name}
                                                </Typography>
                                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                    {meeting.meeting.description}
                                                </Typography>
                                                <Button variant="contained" onClick={() => window.location.assign("/schedulePool/" + meeting.pool_link)}sx={{top: 45}}>
                                                    Recap
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    );
                                })
                            }
                        </Grid>
                    </Paper>
                </>
                
                
                
            </Stack>
        </>
    );
}