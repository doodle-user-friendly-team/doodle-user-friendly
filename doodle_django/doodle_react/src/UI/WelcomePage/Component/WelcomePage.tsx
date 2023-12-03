import React, {Component, MouseEvent, useRef, useState} from 'react';
import '../CSS/style.css';


import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LoginIcon from '@mui/icons-material/Login';
import Fab from '@mui/material/Fab';
import Paper from "@mui/material/Paper";
import {FormComponent} from "../../Form/Component/FormIdentification";
import {PlanningPanelComponent} from "../../PlanningPanel/Component/PlanningPanel";
import {Box, Divider} from "@mui/material";

export const WelcomePage = () => {
    
      const ref = useRef<HTMLDivElement>(null);
      const [formValue, setFormValue]  = useState("signin");
      const handleClick = (val: string) => {
          ref.current?.scrollIntoView({behavior: 'smooth'});
      };
      
    return (
        <>
      <div id="second-element">
        <Fab color="primary" aria-label="login" sx={{position: 'absolute', top: '5%', left: '90%', padding: '3em'}}
        onClick={() => window.location.assign("/login")}>
          <LoginIcon />
        </Fab>
        <Fab color="primary" aria-label="scrolldown" sx={
          {position: 'absolute', top: '80%', left: '50%', padding: '2em', backgroundColor: 'transparent',
          animationName: 'bounce', animationDuration: '8s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out',
          animationPlayState: 'running'}
        }>
          <ArrowDownwardIcon onClick={() => handleClick("signin")} />
        </Fab>
        <video autoPlay loop muted id='video'>
          <source src='/videos/videos.mp4' type='video/mp4' />
        </video>
       

      <div id="title">
        Doodle
      </div>
      <div>
        <h3>Simplify your meetings with our platform!</h3>
      </div>

      </div>
            <Box
                sx={{
                    display: 'flex',
                    width: 'max',
                    
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    '& svg': {
                        m: 1.5,
                    },
                    '& hr': {
                        mx: 0.5,
                    },
                    
                    paddingTop: '5%',
                }}
                ref={ref}
            >
                <h2>Create an account to access and make your meetings!</h2>
               
                <Divider orientation="vertical" sx={{color: 'transparent'}} />
                <FormComponent startValue={formValue} />
            </Box>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
                Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
                pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. </p>



            <Divider sx={{paddingTop: "2%", paddingBottom: "2%"}}>
                OR
            </Divider>


          <Paper elevation={0} sx = {{padding: '10%'}}>
              You can just try the platform without login!
              <PlanningPanelComponent />
          </Paper>

          <footer style={{backgroundColor: "gray", paddingBottom: "10%"}}>
              hello footer
          </footer>
      </>
    );
}
