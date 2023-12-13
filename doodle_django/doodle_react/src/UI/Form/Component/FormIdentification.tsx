import React, { useState, FormEvent} from 'react';
import "../CSS/style.css";
import { CalendarBaseComponent } from '../../Calendar/Components/CalendarBase';
import Cookies from "js-cookie";
import axios from 'axios';
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {Container, Tab, Tabs} from "@mui/material";
import {LoginFormComponent} from "./LoginFormComponent";
import {SigninFormComponent} from "./SigninFormComponent";

interface propsInterface {
    startValue: string
}

export const FormComponent = (props: propsInterface) => {

    const [value, setValue] = React.useState(props.startValue);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
  
  return (
            <Container component="main" maxWidth="lg">
                <Box
                    sx={{
                        marginTop: 8,
                    }}
                >
                    <Grid container>
                        <CssBaseline />
                        <Grid
                            item
                            xs={false}
                            sm={4}
                            md={7}
                            sx={{
                                backgroundImage: "url(https://source.unsplash.com/random)",
                                backgroundRepeat: "no-repeat",
                                backgroundColor: (t) =>
                                    t.palette.mode === "light"
                                        ? t.palette.grey[50]
                                        : t.palette.grey[900],
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                        <Grid
                            item
                            xs={12}
                            sm={8}
                            md={5}
                            component={Paper}
                            elevation={6}
                            square
                        >
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                    aria-label="secondary tabs example"
                                >
                                    <Tab value="login" label="Log-in" sx ={{
                                        width: '50%'
                                    }}/>
                                    <Tab value="signin" label="Sign-in" sx ={{
                                        width: '50%'
                                    }}/>
                                </Tabs>
                                {value == 'login' ? <LoginFormComponent/> : <SigninFormComponent/>}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        );
}