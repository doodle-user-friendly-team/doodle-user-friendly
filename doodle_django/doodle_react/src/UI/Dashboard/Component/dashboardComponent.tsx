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

export function DashboardComponent() {

    return (
        <>
            <TopBarComponent/>
            <Stack
                direction="column"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                sx = {{paddingTop: "5%", paddingLeft: "2em"}}
            >
                
                <Paper elevation={3} sx={{ p: 2, width: 300, height: 300}}>
                    <Typography variant="h6" component="h2">
                        Planning
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Manage your planning
                    </Typography>
                    <Button variant="contained" onClick={() => window.location.assign("/create-meeting")}>Create meeting</Button>
                </Paper>
                
            </Stack>
        </>
    );
}