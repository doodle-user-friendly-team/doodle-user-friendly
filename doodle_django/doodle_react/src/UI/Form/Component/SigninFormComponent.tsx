import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import React, {FormEvent} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {Alert, Box } from "@mui/material";


import GoogleButton from 'react-google-button'
import { handleAuthClick } from "../../../Google/Google";

export function SigninFormComponent () {
    
    const [errorString, setErrorString] = React.useState('');
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const data = new FormData(e.currentTarget!);
        
        const csrfToken = Cookies.get('csrftoken');

        const headers = {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',// Specifica il tipo di contenuto
            "Authorization": "Token " + Cookies.get('token')
        };

        axios.post('http://localhost:8000/api/v1/auth/registration/', {
            username:  data.get('username') + '_' + data.get('lastname'),
            email: data.get('email'),
            password1: data.get('password'),
            password2: data.get('password')
        }, {headers}).then((response) => {
            
            window.location.assign("/dashboard")
        }).catch((error) => {
           //get the first error and display it
            
            error.response.data['username'] && setErrorString('Username: ' + error.response.data['username'][0]);
            error.response.data['email'] && setErrorString( 'Email: ' + error.response.data['email'][0]);
            error.response.data['password1'] && setErrorString( 'Password: ' + error.response.data['password1'][0]);
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
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="lastname"
                label="Lastname"
                name="lastname"
                autoComplete="lastname"
                autoFocus
            />
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
                Sign up
            </Button>

            

        </Box>
    );
}