import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton , ListItemIcon} from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';


interface CreatePreferenceFormProps {
    onSave: (preference: string) => void;
    onClose: () => void;
    start: string;
    end: string;
}

export function CreatePreferenceForm ({ onSave, onClose, start, end }:CreatePreferenceFormProps){
    const [selectedButton, setSelectedButton] = useState("");


    const handleChange = (event: SelectChangeEvent) => {
        setSelectedButton(event.target.value as string);
    };

    const handleSave = () => {
        // save the preference and close the dialog (database)
        onSave(selectedButton);
        onClose();
    };
    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Aggiungi preferenza</DialogTitle>
            <DialogContent>

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

