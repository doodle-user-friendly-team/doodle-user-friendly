import React, { Component, MouseEvent } from 'react';
import '../CSS/style.css';
import { Button ,ButtonGroup } from '@mui/material';

interface WelcomePageState {
}



class WelcomePage extends Component<{}, WelcomePageState> {
  
  


  render() {
    return (
      <div id="second-element">
        <video autoPlay loop muted id='video'>
          <source src='/videos/videos.mp4' type='video/mp4' />
        </video>
       

      <div id="title">
        Doodle
      </div>
      <div>
        <h3>Simplify your meetings with our platform!</h3>
      </div>

      {/* <Button id="loginButton" >
        Login
      </Button> */}

      </div>
    );
  }
}

export default WelcomePage;
