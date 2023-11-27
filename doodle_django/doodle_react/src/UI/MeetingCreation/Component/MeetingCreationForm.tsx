import React, { ChangeEvent, FormEvent } from 'react';
import {Button, CssBaseline, TextField, Box, Typography, Container, Alert, AlertTitle} from '@mui/material'

import '../CSS/style.css'

import { createTheme, ThemeProvider } from '@mui/material/styles';


// fare npm install @mui/x-date-pickers
// fare npm install date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



const customTheme= createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
})

interface MeetingFormState {
  name: string;
  surname: string;
  email: string;
  meetingTitle: string;
  meetingDescription: string;
  meetingPlace: string;
  timeValue: string;
}

interface MeetingDateRange {
  dateStart: Date | null;
  dateEnd: Date | null;
}

interface AlertState {
  showSuccessAlert: boolean;
  showWarningAlert: boolean;
  showErrorAlert: boolean;
}

export class MeetingCreation extends React.Component<{}, MeetingFormState & AlertState & MeetingDateRange> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: '',
      surname: '',
      email: '',
      meetingTitle: '',
      meetingDescription: '',
      meetingPlace: '',
      timeValue: '',
      dateStart: null,
      dateEnd: null,
      showSuccessAlert: false,
      showWarningAlert: false,
      showErrorAlert: false,
    };
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.setState({
      showWarningAlert: false,
      showErrorAlert: false,
    })

    console.log({
      name: this.state.name,
      surname: this.state.surname,
      email: this.state.email,
      meetingTitle: this.state.meetingTitle,
      meetingDescription: this.state.meetingDescription,
      meetingPlace: this.state.meetingPlace,
      timeValue: this.state.timeValue,
      dateStart: this.state.dateStart,
      dateEnd: this.state.dateEnd
    });

    if (!this.state.name || !this.state.surname || !this.state.email || !this.state.meetingTitle || !this.state.meetingDescription || !this.state.timeValue || !this.state.dateStart || !this.state.dateEnd) {
      // Se i campi obbligatori non sono compilati, mostra un messaggio di errore
      console.error('Campi obbligatori non compilati');
      this.setState({
        showWarningAlert: true
      }, () => {
        // Scrolla fino alla visualizzazione dell'Alert
        if (this.alertRef.current) {
          this.alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
    else if(!this.validateEmail(this.state.email)){
      this.setState({
        showErrorAlert: true
      }, () => {
        // Scrolla fino alla visualizzazione dell'Alert
        if (this.alertRef.current) {
          this.alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
    else {
      this.setState({
        showSuccessAlert: true
      }, () => {
        // Scrolla fino alla visualizzazione dell'Alert
        if (this.alertRef.current) {
          this.alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };

  handleInputChange = (fieldName: keyof MeetingFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ [fieldName]: event.target.value } as Pick<MeetingFormState, keyof MeetingFormState>);
  };

  validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ timeValue: event.target.value });
  };

  handleDateStartChange = (date: Date | null) => {
    this.setState({ dateStart: date });
  };
  
  handleDateEndChange = (date: Date | null) => {
    this.setState({ dateEnd: date });
  };
  
  alertRef = React.createRef<HTMLDivElement>();

  render() {
    return (
      <ThemeProvider theme={customTheme}>
        <Box className="background-image" />
        <Container component="main" maxWidth="xs">
          <CssBaseline />

          {this.state.showSuccessAlert && (
            <Alert severity="success" className='successAlert' ref={this.alertRef}>
              <AlertTitle>Success</AlertTitle>
              Meeting created successfully — <strong> check it out! </strong>
            </Alert>
          )}

          {this.state.showWarningAlert && (
            <Alert severity="warning" className= 'warningAlert' ref={this.alertRef}>
              <AlertTitle>Warning</AlertTitle>
              Fill in the required fields before proceeding.
            </Alert>
          )}

          {this.state.showErrorAlert && (
            <Alert severity="error" className= 'errorAlert' ref={this.alertRef}>
              <AlertTitle>Error</AlertTitle>
              The entered email is invalid, please enter another one.
            </Alert>
          )}


          <Box className= "container">
            <Typography component="h1" variant="h4" className='title' gutterBottom>
              Create New Meeting
            </Typography>
            
            <Box component="form" onSubmit={this.handleSubmit} noValidate className='form'>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                onChange={this.handleInputChange('name')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="surname"
                label="Surname"
                id="surname"
                autoComplete="surname"
                onChange={this.handleInputChange('surname')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={this.handleInputChange('email')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="meetingTitle"
                label="Meeting Title"
                name="meetingTitle"
                autoComplete="meetingTitle"
                onChange={this.handleInputChange('meetingTitle')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="meetingDescription"
                label="Meeting Description"
                name="meetingDescription"
                autoComplete="meetingDescription"
                onChange={this.handleInputChange('meetingDescription')}
              />
              <TextField
                margin="normal"
                fullWidth
                id="meetingPlace"
                label="Meeting Place"
                name="meetingPlace"
                autoComplete="meetingPlace"
                onChange={this.handleInputChange('meetingPlace')}
              />

              
              <TextField
                margin="normal"
                label="Meeting duration"
                type="time"
                value={this.state.timeValue}
                onChange={this.handleTimeChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />


              <Typography variant="body2" align='left' marginTop={2} gutterBottom>
                Date Range To Vote
              </Typography>
              <Box className= 'datePickerContainer'>
                
                <div className="datePickerWrapperStart">

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker format="dd/MM/yyyy" value= {this.state.dateStart} onChange={(date) => this.handleDateStartChange(date)}/>
                  </LocalizationProvider>
                </div>

                <Typography variant="body2" gutterBottom>
                    -
                </Typography>

                <div className='datePickerWrapperEnd'>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker format="dd/MM/yyyy" value= {this.state.dateEnd} onChange={(date) => this.handleDateEndChange(date)}/>
                  </LocalizationProvider>
                </div>

              </Box>


              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="submitButton"
              >
                Create
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}
