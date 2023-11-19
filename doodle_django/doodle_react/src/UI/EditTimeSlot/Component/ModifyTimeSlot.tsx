import React, { ChangeEvent } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import '../CSS/style.css';

interface TimeSlotInfo {
  id: string;
  start_time: string;
  end_time: string;
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

interface ModifiedTimeSlot {
  start_time: string;
  end_time: string;
  schedule_pool: string;
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
}

export const ModifyProposedTimeSlot: React.FC<ModifyProposedTimeSlotProps> = (props) => {
  const { timeSlot, updateTimeslot } = props;

  const [state, setState] = React.useState<ModifyProposedTimeSlotState>({
    open: true,
    modifiedStartTime: timeSlot.start_time,
    modifiedEndTime: timeSlot.end_time,
    modifiedSchedulePool: '1',
    modifiedUser: '1',
    schedulePoolOptions: [], // Inizializzato vuoto
    userOptions: [], // Inizializzato vuoto
  });

  const handleModify = (): void => {
    const { modifiedStartTime, modifiedEndTime, modifiedSchedulePool, modifiedUser } = state;
    const { id } = timeSlot;

    const sanitizedId = Math.max(1, parseInt(id, 10)).toString();

    const modifiedTimeSlot = {
      start_time: modifiedStartTime,
      end_time: modifiedEndTime,
      schedule_pool: modifiedSchedulePool,
      user: modifiedUser,
    };

    const updateUrl = `http://localhost:8000/timeslots/${sanitizedId}/`;

    axios
      .put<ModifiedTimeSlot>(updateUrl, modifiedTimeSlot)
      .then((response: AxiosResponse<ModifiedTimeSlot>) => {
        console.log('Modifica avvenuta con successo:', response.data);
        props.onDialogClose();
        updateTimeslot({
          id: timeSlot.id,
          start_time: response.data.start_time,
          end_time: response.data.end_time,
        });
      })
      .catch((error: AxiosError) => {
        console.error('Errore durante la modifica:', error);
        // Resto del tuo codice per gestire gli errori rimane invariato
      });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name === 'From' ? 'modifiedStartTime' : 'modifiedEndTime']: value,
    }));
  };

  const handleSelectChange = (optionType: 'schedulePool' | 'user', value: string): void => {
    setState((prevState) => ({
      ...prevState,
      [optionType === 'schedulePool' ? 'modifiedSchedulePool' : 'modifiedUser']: value,
    }));
  };

  const { modifiedStartTime, modifiedEndTime } = state;

  return (
    <Dialog open={state.open} onClose={props.onDialogClose} maxWidth="xs">
      <DialogTitle> Modify Proposed TimeSlot </DialogTitle>
      <DialogContent>
        <h3> Proposed TimeSlot </h3>
        <TextField
          id="outlined-read-only-input"
          label="From"
          value={modifiedStartTime}
          onChange={handleInputChange}
          name="From"
        />
        <br />
        <br />
        <TextField
          id="outlined-read-only-input"
          label="To"
          value={modifiedEndTime}
          onChange={handleInputChange}
          name="To"
        />
      
        <br />
      
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={props.onDialogClose}>
          Close
        </Button>
   
          <Button variant="contained" color="primary" onClick={handleModify}>
            Modify
          </Button>
        
      </DialogActions>
    </Dialog>
  );
};
