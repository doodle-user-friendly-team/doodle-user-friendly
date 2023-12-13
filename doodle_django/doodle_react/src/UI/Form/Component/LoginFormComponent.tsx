import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import React, {FormEvent} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {Alert, Box} from "@mui/material";

export const LoginFormComponent = () => {
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
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Log In
            </Button>

        </Box>
        );
}