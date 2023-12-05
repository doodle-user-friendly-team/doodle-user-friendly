import * as React from 'react';
import {CssBaseline, Box, Typography, Container, ButtonGroup } from '@mui/material';
import '../CSS/style.css';
import { createTheme, styled, Theme, ThemeProvider } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Place from '@mui/icons-material/Place';
import AlertDialog from './DeleteComponent';
import ModifyDialog from './ModifyComponent';


const customTheme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const CustomTableCell = styled('div')(({ theme }: { theme: Theme }) => ({
  borderBottom: 'none',
  color: theme.palette.text.secondary,
  fontSize: '20px',
  float: 'left',
}));

const CustomIcon = styled('div')(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '24px',
  float: 'left',
  marginRight: '8px',
}));

interface MeetingState {
  meetingTitle: string;
  meetingDescription: string;
  meetingPlace: string;
  meetingDate: string;
  timeValue: string;
  isDeleteDialogOpen: boolean;
}

export class MeetingRecap extends React.Component<MeetingState, MeetingState> {

  constructor(props: MeetingState) {
    super(props);
    
    
    this.state = {
      meetingTitle: props.meetingTitle,
      meetingDescription: props.meetingDescription,
      meetingPlace: props.meetingPlace,
      meetingDate: props.meetingDate,
      timeValue: props.timeValue,
      isDeleteDialogOpen: props.isDeleteDialogOpen,
    
    };
  } 

  handleModify(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault(); 
    console.log('modify');
  }
  

  alertRef = React.createRef<HTMLDivElement>();

  render() {
    return (
      <ThemeProvider theme={customTheme}>
        <Box className="background-image" />
        <Container component="main" maxWidth="xs">
          <CssBaseline />

          <Box className="container">
            <Typography component="h1" variant="h4" className="title" gutterBottom>
              Recap Meeting
            </Typography>

            <Box component="form" noValidate className="form">
            <div className="info">
                {/* questo titolo deve essere preso dal db */}
                <h2 className="titleMeeting">{this.state.meetingTitle}</h2>

                <CustomTableCell>
                  <CustomIcon>
                    <DescriptionIcon />
                  </CustomIcon>
                  {this.state.meetingDescription}
                </CustomTableCell>
              <br/>
                <CustomTableCell>
                  <CustomIcon>
                    <CalendarMonthIcon />
                  </CustomIcon>
                     {this.state.meetingDate}
                </CustomTableCell>
                <br/>

                <CustomTableCell>
                  <CustomIcon>
                    <AccessTimeIcon />
                  </CustomIcon>
                  {this.state.timeValue}
                </CustomTableCell>
                <br/>

                <CustomTableCell>
                  <CustomIcon>
                    <Place />
                  </CustomIcon>
                   {/* questo luogo deve essere preso dal db */}
                  {this.state.meetingPlace}
                </CustomTableCell>
              </div>

              <ButtonGroup className='buttonGroup'  >
                <ModifyDialog/>
                <AlertDialog/>                      
              </ButtonGroup>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
  
}
