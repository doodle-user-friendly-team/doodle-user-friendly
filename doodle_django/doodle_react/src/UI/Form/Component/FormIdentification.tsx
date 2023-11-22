import React, { useState, FormEvent} from 'react';
import "../CSS/style.css";
import { CalendarBaseComponent } from '../../Calendar/Components/CalendarBase';
import { Alert, Button } from '@mui/material';
import Cookies from "js-cookie";
import axios from 'axios';


export const FormComponent = () => {
  const [formData, setFormData] = useState({
    name:'',
    surname:'',
    email:''

  });

  const [isFormVisible, setFormVisible] = useState(true);
  const [isCalendarVisible, setCalendarVisible] = useState(true);
  const [isLabelVisible, setLabelVisible] = useState(false);
  //aggiunta per utente non registrato
  const [isAlertVisible, setAlertVisible] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.name && formData.surname && formData.email) {

      const csrfToken = Cookies.get('csrftoken');

      const headers = {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json' // Specifica il tipo di contenuto
      };

      const queryString = `?email=${formData.email}`;
      axios.get(`http://localhost:8000/authenticate/${queryString}`,
          {headers}).then((response) => {
          console.log('Dati del modulo:', formData);
          setFormVisible(false)
          setLabelVisible(true);

          Cookies.set('name', formData.name);
          Cookies.set('surname', formData.surname);
          Cookies.set('email', formData.email);
          window.location.assign("/")
      }).catch((error) => {
        console.error('Errore nell\'autenticazione dell\'utente');
        console.error('Errore nella risposta del server:', error);
        setAlertVisible(true)
      });
    }
  };
  
  const onCloseAlert = (): void => {
    setAlertVisible(false);
  };
  
  const handleCreateAccount = async () => {
      const csrfToken = Cookies.get('csrftoken');

      const headers = {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json' // Specifica il tipo di contenuto
      };

      axios.post('http://localhost:8000/register/', {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
      }, {headers}).then((response) => {
          console.log('Utente registrato con successo');

          console.log('Dati del modulo:', formData);
          setFormVisible(false)
          setLabelVisible(true);
          Cookies.set('name', formData.name);
          Cookies.set('surname', formData.surname);
          Cookies.set('email', formData.email);
          window.location.assign("/")
        }).catch((error) => {
            console.error('Errore nella risposta del server:', error);
        });
    };

  return (
      <div className="container">


        {isFormVisible && (
            <div className="form-popup">
              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label htmlFor="uname">
                    <b>Name</b>
                  </label>
                  <input type="text"
                         name="name"
                         placeholder="Enter your name"
                         value= {formData.name}
                         onChange={handleChange} required/>


                </div>


                <label htmlFor="username">
                  <b>Surname</b>
                </label>
                <input
                    type="text"
                    name="surname"
                    placeholder="Enter your surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                />

                <br />
                <label htmlFor="email">
                  <b>Email</b>
                </label>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <br />
                <button type="submit" > Send </button>
              </form>
            </div>
        )}

        {/* aggiunta per utente non registrato */}
        {isAlertVisible && isFormVisible && (
            <div className="alert-container">
              <div className="alert-box">
                <Alert variant="filled" severity="error">
                  <h3> User not found </h3>
                </Alert>
                <Button variant="contained" color="success" onClick={()=> handleCreateAccount()}>
                  Create new account
                </Button>
                <Button variant="outlined" color="error" onClick={() => onCloseAlert()}>
                  Close
                </Button>
              </div>
            </div>
        )}
      </div>
  )
}