
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button , ListItemIcon} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import axios from 'axios';


interface ModifyPreferenceProps {
    id : number;
    user : number;
    time_slot : number;
    selectedPreference: string;
    onSave: (preference: string) => void;
    onClose: () => void;
    start: string;
    end: string;
    date: string;
}



export function MofifyPreferenceForm ({id,user,time_slot, selectedPreference, onSave, onClose, start, end, date }:ModifyPreferenceProps){

  const [selectedButton, setSelectedButton] = useState(selectedPreference);

  const handleUpdatePreference = () => { // decidere se farlo asincrono o meno (async + await)
    const preference = selectedPreference;
    axios.put('http://localhost:8000/api/update_preference/', {
        id,
        preference,
        user,
        time_slot
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log('Successo:', response.data);
        } else {
          console.error('Errore durante la richiesta al backend:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Errore nell\'invio dei dati:', error.message);
      });
  };


  const handleChange = (event: SelectChangeEvent) => {
    setSelectedButton(event.target.value as string);
  };

  const handleSave = () => {
    // save the preference and close the dialog (database)
    console.log(selectedButton);
    handleUpdatePreference();

    onSave(selectedButton);
    onClose();
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Modifica Preferenza</DialogTitle>
      <DialogContent>
      <Typography variant="body2">
        Date: {date}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
         Start time: {start}, End time: {end}
        </Typography>
      <Select
          labelId="simple-select-label"
          id="simple-select"
          value={selectedButton}
          //label="Preference"
          onChange={handleChange}
          sx={{ minWidth: 300}}
        >
            <MenuItem value={"Available"} sx={{ }}>
                <ListItemIcon>
                    <DoneIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <Typography variant="inherit">Available</Typography>
            </MenuItem>
            <MenuItem value={"Maybe available"}>
                <ListItemIcon>
                <QuestionMarkIcon fontSize="small" color="warning" />
                </ListItemIcon>
                <Typography variant="inherit">Maybe available</Typography>
            </MenuItem>
            <MenuItem value={"Unavailable"}>
                <ListItemIcon>
                    <CloseIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography variant="inherit">Unavailable</Typography>
            </MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Annulla
        </Button>
        <Button onClick={handleSave} color="primary" autoFocus>
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

