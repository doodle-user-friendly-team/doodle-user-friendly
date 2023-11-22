import React, { Component, ChangeEvent } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import '../CSS/style.css';
import Cookies from 'js-cookie';

interface TimeSlotInfo {
  id: string;
  start_time: string;
  end_time: string;
  user: string;
}

interface ModifyProposedTimeSlotProps {
  onDialogClose: () => void;
  formData: {
    name: string;
    surname: string;
    email: string;
  };
  timeSlot: TimeSlotInfo;
  updateTimeslot: (updatedTimeslot: TimeSlotInfo) => void;
}

// Modifica questa parte per ottenere l'oggetto SchedulePool corrispondente
interface ModifiedTimeSlot {
  start_time: string;
  end_time: string;
  schedule_pool: number;
  user: string;
}



interface ModifyProposedTimeSlotState {
  open: boolean;
  modifiedStartTime: string;
  modifiedEndTime: string;
  modifiedSchedulePool: string;
  modifiedUser: string;
  schedulePoolOptions: string[];
  userOptions: string[];
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
}

export class ModifyProposedTimeSlot extends Component<ModifyProposedTimeSlotProps, ModifyProposedTimeSlotState> {
  constructor(props: ModifyProposedTimeSlotProps) {
    super(props);
    
    console.log('props:', props)

    this.state = {
      open: true,
      modifiedStartTime: props.timeSlot.start_time,
      modifiedEndTime: props.timeSlot.end_time,
      modifiedSchedulePool: '1',
      modifiedUser: '1',
      schedulePoolOptions: [],
      userOptions: [],
      user: {
        id: '',
        name: '',
        surname: '',
        email: '',
      },
    };
  }

  componentDidMount(): void {
    this.getUserForTimeSlot();
  }

  getUserForTimeSlot = () => {
    const { timeSlot } = this.props;
    console.log('timeSlot:', timeSlot)

    const csrfToken = Cookies.get('csrftoken');

    const headers = {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json' // Specifica il tipo di contenuto
    };
    
    axios
      .get(`http://localhost:8000/users/${timeSlot.user}`, { headers })
      .then((response: AxiosResponse) => {
        console.log('rispostaApi:', response.data);
        this.setState({
          user: response.data,
        });
      })
      .catch((error: AxiosError) => {
        console.error('Errore durante la richiesta utente:', error);
      });
    
  };

  
  handleModify = (): void => {
    const { modifiedStartTime, modifiedEndTime, modifiedSchedulePool, modifiedUser } = this.state;
    const { timeSlot } = this.props;
    const { id } = timeSlot;
  
    const sanitizedId = Math.max(1, parseInt(id, 10)).toString();
  
    // Modifica questa parte per ottenere l'oggetto SchedulePool corrispondente
    const modifiedTimeSlot = {
      start_time: modifiedStartTime,
      end_time: modifiedEndTime,
      schedule_pool: modifiedSchedulePool,
      user: modifiedUser , // Modifica questa parte per inviare un oggetto invece di una stringa
    };
    
    console.log('Modified Schedule Pool:', modifiedSchedulePool);
    const updateUrl = `http://localhost:8000/timeslots/${sanitizedId}`;
    const csrfToken = Cookies.get('csrftoken');

    const headers = {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json' // Specifica il tipo di contenuto
    };
  
    axios
      .put<ModifiedTimeSlot>(updateUrl, modifiedTimeSlot)
      .then((response: AxiosResponse<ModifiedTimeSlot>) => {
        console.log('Modifica avvenuta con successo:', response.data);
        this.props.onDialogClose();
        this.props.updateTimeslot({
          id: timeSlot.id,
          start_time: response.data.start_time,
          end_time: response.data.end_time,
          user: response.data.user,
        });
      })
      .catch((error: AxiosError) => {
        console.error('Error during modification:', error);
  
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received. Request:', error.request);
        } else {
          console.error('Error setting up the request:', error.message);
        }
      });
  };

  handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [name === 'From' ? 'modifiedStartTime' : 'modifiedEndTime']: value,
    }));
  };

  handleSelectChange = (optionType: 'schedulePool' | 'user', value: string): void => {
    this.setState((prevState) => ({
      ...prevState,
      [optionType === 'schedulePool' ? 'modifiedSchedulePool' : 'modifiedUser']: value,
    }));
  };

  render() {
    const { modifiedStartTime, modifiedEndTime } = this.state;
    

    return (
      <Dialog open={this.state.open} onClose={this.props.onDialogClose} maxWidth="xs">
        <DialogTitle> Modify Proposed TimeSlot </DialogTitle>
        <DialogContent>
          <h3> Proposed TimeSlot </h3>
          <TextField
            id="outlined-read-only-input"
            label="From"
            value={modifiedStartTime}
            onChange={this.handleInputChange}
            name="From"
          />
          <br />
          <br />
          <TextField
            id="outlined-read-only-input"
            label="To"
            value={modifiedEndTime}
            onChange={this.handleInputChange}
            name="To"
          />
          <br />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={this.props.onDialogClose}>
            Close
          </Button>
          { this.state.user.email === Cookies.get('email') && (
            
            <Button variant="contained" color="primary" onClick={this.handleModify}>
              Modify
            </Button>

          )}
        </DialogActions>
      </Dialog>
    );
  }
}
