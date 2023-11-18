import React, { Component } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import "../CSS/style.css";

interface ModifyProposedTimeSlotProps{
    onClose: () => void
    formData: {
        name: string;
        surname: string;
        email: string;
    };
    timeSlot: {
        start_time: string
        end_time: string
        id: string
    }
}


interface ModifyProposedTimeSlotState {
    open: boolean
}


export class ModifyProposedTimeSlot extends React.Component<ModifyProposedTimeSlotProps, ModifyProposedTimeSlotState> {


  constructor(props: ModifyProposedTimeSlotProps) {
    super(props);
    this.state= {
        ...props,
        open: true,
    }

}



  handleModify = () => {
    console.log('Modify button clicked');
  };

  
  render() {

    return (

        <Dialog open={this.state.open} onClose={this.props.onClose} maxWidth="xs">
            <DialogTitle> Modify Proposed TimeSlot </DialogTitle>
            <DialogContent>
               <h3> Proposed TimeSlot </h3>
                <TextField
                    id="outlined-read-only-input"
                    label="From"
                    value={this.props.timeSlot.start_time}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <br/>
                <br/>
                <TextField
                    id="outlined-read-only-input"
                    label="To"
                    value={this.props.timeSlot.end_time}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={this.props.onClose}>
                    Close
                </Button>
                {/*occorre correggere questo controllo, non funziona esattamente come dovrebbe
                dobbiamo controllare se chi ha creato il timeslot è la persona che si è identificato nel form iniziale */}
                {this.props.formData.name !== "Martina" && (
                    <Button variant="contained" color="primary" onClick={this.handleModify}>
                        Modify
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
  }
}

