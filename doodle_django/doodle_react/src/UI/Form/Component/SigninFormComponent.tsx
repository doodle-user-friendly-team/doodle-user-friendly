import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import React, {FormEvent} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Box } from "@mui/material";
const CryptoJS = require("crypto-js");

export function SigninFormComponent () {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const data = new FormData(e.currentTarget!);
        
        const csrfToken = Cookies.get('csrftoken');

        const headers = {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json' // Specifica il tipo di contenuto
        };

        axios.post('http://localhost:8000/register/', {
            username: data.get('username'),
            lastname: data.get('lastname'),
            email: data.get('email'),
            password: CryptoJS.SHA3(data.get('password'))
        }, {headers}).then((response) => {
            
            window.location.assign("/")
        }).catch((error) => {
            console.error('Errore nella risposta del server:', error);
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
                name="Username"
                autoComplete="username"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="lastname"
                label="Lastname"
                name="Lastname"
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
            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            />
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