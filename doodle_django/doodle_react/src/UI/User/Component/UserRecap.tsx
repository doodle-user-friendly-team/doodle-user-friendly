// ProfileBox.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import "../CSS/style.css";
import axios from 'axios';

interface FormData {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
}

function ProfileBox() {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [new_password1, setPassword1] = useState('');
  const [new_password2, setPassword2] = useState('');

  useEffect(() => {
    console.log(formData);

    axios.get<FormData>(`http://localhost:8000/api/v1/users/1`)
      .then(response => setFormData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  const handleButtonClick = () => {
    console.log('Button clicked!');
    setOpenDialog(true);
    
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    
    setOldPassword('');
    setPassword1('');
    setPassword2('');
  };

  const handleChangePassword = async () => {
    console.log("new_password1:", new_password1);
    console.log("new_password2:", new_password2);

    if (new_password1 !== new_password2) {
      alert("Error: Le nuove password non corrispondono");
      return;
    }
    //lunghezza più di 8, un carattere speciale e almeno un numeros
    if (new_password1.length < 8 || !/\d/.test(new_password1) || !/[A-Za-z]/.test(new_password1)) {
      alert("Error: La password non rispetta i requisiti di complessità.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/password/change/', {
        old_password: oldPassword,
        new_password1: new_password1,
        new_password2: new_password2,
      });

      console.log(response.data);
    
      setOldPassword('');
     
      setPassword1('');
    setPassword2('');
      handleCloseDialog();
      alert("Password changed successfully!");
    } catch (error: any) {

      if (error.response?.status === 400) {
        console.error("Error: Incorrect old password");
      } else {
        console.error("Error:", (error.response?.data as any) || error.message);
      }
    }
  };

  return (
    <Box className="container">
      <Card className="card">
        <p></p>
        <p></p>
        <Typography variant="h5" component="div">
          Profile Details
        </Typography>
        <CardMedia
          image="images/creationMeeting.jpeg"  
          className="circle"
        />
        <CardContent>
          <Typography variant="h6" component="div">
            {`${formData.name} ${formData.surname}`}
          </Typography>

          <DialogContent>
            <Box className="dataBox" sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box className="labelStyleLeft">
                <Typography variant="h6">
                  <p className='p'>Name</p>
                </Typography>
                <Typography variant="h6">
                  <p className='p'>Surname</p>
                </Typography>
                <Typography variant="h6">
                  <p className='p'>Email</p>
                </Typography>
                <Typography variant="h6">
                  <p className='p'>Password</p>
                </Typography>
              </Box>

              <Box className="labelStyleRight">
                <Typography variant="h6">
                  <p className='p'>{formData.name}</p>
                </Typography>
                <Typography variant="h6">
                  <p className='p'>{formData.surname}</p>
                </Typography>
                <Typography variant="h6">
                  <p className='p'>{formData.email}</p>
                </Typography>

                <Typography variant="h6" >
                <p className='p'>{showPassword ? formData.password : '••••••••'}</p>
                </Typography>
              </Box>

              <Box className="labelStyleBotton">
                <Button
                  variant="text"
                  color="secondary"
                  onClick={handleButtonClick}
                >
                  <EditIcon fontSize="small" className="icon" />
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog} >
        <DialogTitle>Edit your password</DialogTitle>
     
        <DialogActions>
        <Box>
        <TextField
              margin="normal"
              required
              fullWidth
              name="old_password"
              label="Old Password"
              type="password"
              id="old_password"
              autoComplete="current-password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="new_password"
              label="New Password"
              type="password"
              id="new_password"
              autoComplete="new-password"
             onChange={(e) => setPassword1(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm_password"
              label="Confirm Password"
              type="password"
              id="confirm_password"
              autoComplete="new-password"
              onChange={(e) => setPassword2(e.target.value)}
            />
            <p></p>
    
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Cancel
          </Button>
          
          <Button onClick={handleChangePassword} variant="contained" color="success">
            Save
          </Button>

          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfileBox;
