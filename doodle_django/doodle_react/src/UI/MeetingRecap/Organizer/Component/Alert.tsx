import React, {useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

interface AlertProps {
    onClose: () => void;
}

export function SuccessSave({ onClose }: AlertProps) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Meeting saved successfully!
                </Alert>
            </Snackbar>
        </div>
    );
}

export function SuccessDelete() {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Meeting deleted successfully!
                </Alert>
            </Snackbar>
        </div>
    );
}

export function FailedSave({onClose}: AlertProps) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    Error while saving the meeting!
                </Alert>
            </Snackbar>
        </div>
    );
}

export function FailedDelete() {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    Error while deleting the meeting!
                </Alert>
            </Snackbar>
        </div>
    );
}

