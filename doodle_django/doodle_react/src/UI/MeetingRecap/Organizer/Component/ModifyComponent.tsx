import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

interface ModifyDialogProps {
}

const ModifyDialog: React.FC<ModifyDialogProps> = (props) => {
    const [open, setOpen] = useState(false);
    const [place, setPlace] = useState<string>("place"); // Questo valore lo devo prendere dal db
    const [description, setDescription] = useState<string>("description"); // Questo valore lo devo prendere dal db
    const [title, setTitle] = useState<string>("title"); // Questo valore lo prende dal db

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        console.log("NON SALVA NUOVI DATI DB");
        setOpen(false);
    };

    const handleYes = () => {
        console.log("SALVA NUOVI DATI DB");

        // Chiama la funzione per salvare i dati nel database
        saveDataToDatabase({
            title,
            description,
            place,
        });

        setOpen(false);
    };

    const handlePlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlace(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    //salva nel db
    const saveDataToDatabase = async (data: { title: string; description: string; place: string }) => {
        try {
            
            const response = await fetch('http://localhost:8000/api/v1/meetings/qt0vIlJDqH', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Dati salvati con successo nel database');
            } else {
                console.error('Impossibile salvare i dati nel database');
            }
        } catch (error) {
            console.error('Errore nel salvataggio dei dati nel database:', error);
        }
    };

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen} className="submitButton">
                Modify
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Modify Meeting"}</DialogTitle>
                <TextField
                    id="outlined-read-only-input"
                    label="Title"
                    value={title}
                    onChange={handleTitleChange}
                    style={{ width: '80%', marginBottom: '8px', margin: 'auto' }}
                />
                <br />
                <TextField
                    id="outlined-read-only-input"
                    label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    style={{ width: '80%', marginBottom: '8px', margin: 'auto' }}
                />
                <br />
                <TextField
                    id="outlined-read-only-input"
                    label="Place"
                    value={place}
                    onChange={handlePlaceChange}
                    style={{ width: '80%', marginBottom: '8px', margin: 'auto' }}
                />
                <br />
                <DialogActions>
                    <Button color="error" variant="contained" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleYes} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModifyDialog;