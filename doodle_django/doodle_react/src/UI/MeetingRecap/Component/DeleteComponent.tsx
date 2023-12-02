import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../CSS/style.css';

const AlertDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log("non sicuro")
    setOpen(false);
  };

  const handleYes= () => {
    
    console.log("sicuro")
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained" 
        color="error"
        onClick={handleClickOpen}
        className="deleteButton"
      >
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Meeting "}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the meeting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  variant="contained" onClick={handleClose}>Cancel</Button>
          <Button  color="error"variant="contained" onClick={handleYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertDialog;
