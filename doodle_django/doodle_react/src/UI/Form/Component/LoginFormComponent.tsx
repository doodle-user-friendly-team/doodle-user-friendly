import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import React, {FormEvent} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {Alert, Box, IconButton, Typography} from "@mui/material";
import { RecoverPasswordComponent } from "./RecoverPasswordFormComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const LoginFormComponent = () => {
    const [isRecovering, setIsRecovering] = React.useState(false);
    const [errorString, setErrorString] = React.useState('');
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const data = new FormData(e.currentTarget!);

        const csrfToken = Cookies.get('csrftoken');

        const headers = {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json' // Specifica il tipo di contenuto
        };

        const queryString = `?email=${data.get('email')}&password=${data.get('password')}`;
        axios.get(`http://localhost:8000/api/v1/authenticate/${queryString}`,
            {headers}).then((response) => {
            window.location.assign("/dashboard")
        }).catch((error) => {
            error.response.data['message'] && setErrorString(error.response.data['message']);
        });
    };

    return (
        !isRecovering ?
        <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
        >
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            {errorString !== '' && <Alert severity="error">{errorString}</Alert>}
            <Button color='secondary' size="small" onClick={() => setIsRecovering(true)}>Forgot your password?</Button>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Log In
            </Button>

        </Box>
        : <Box>
            <IconButton  onClick={() => setIsRecovering(false)}>
                <ArrowBackIcon />
            </IconButton>
            <RecoverPasswordComponent /> 
        </Box>
        );
}