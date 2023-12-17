import { Box, Button, IconButton, TextField, Typography } from "@mui/material"
import axios from "axios";
import { error } from "console";
import Cookies from "js-cookie";
import React, { FormEvent } from "react"

export const RecoverPasswordComponent = () => {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) :Promise<void> => {
        e.preventDefault();

        const email = new FormData(e.currentTarget);

        const csrfToken = Cookies.get('csrftoken');

        const headers = {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
        };

        const queryString = `?email=${email.get('email')}`;
        console.log(queryString);
        axios.post('localhost:8000/api/v1/auth/resetpwd/' + queryString, {headers}).then((response) => {
            console.log("success")
        }).catch(() => {
            console.log("error");
        });
    }
    return (
        <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
        >
        <Typography variant="subtitle2">
            Insert your email address to receive a one-time recovery link for resetting your password:
        </Typography>
        <TextField
            margin = 'normal'
            required
            fullWidth
            id="email"
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
        />
        <Button type="submit" fullWidth variant="contained" sx ={{mt: 3, mb: 2}}>
            Send recovery e-mail
        </Button>
        </Box>
    )
}
