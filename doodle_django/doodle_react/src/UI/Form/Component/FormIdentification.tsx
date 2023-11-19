import React, { useState, FormEvent} from 'react';
import "../CSS/style.css";
import { CalendarBaseComponent } from '../../Calendar/Components/CalendarBase';
import { Alert, Button } from '@mui/material';


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

      try {
        const queryString = `?email=${formData.email}`;
        const response = await fetch(`http://localhost:8000/authenticate/${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
          // Autenticazione riuscita, puoi reindirizzare l'utente alla tua pagina principale o fare altre operazioni necessarie.
          console.log('Dati del modulo:', formData);
          setFormVisible(false)
          setLabelVisible(true);
        } else {
            console.error('Errore nell\'autenticazione dell\'utente');
            console.error('Errore nella risposta del server:', await response.text());
            setAlertVisible(true)
        }
      } catch (error) {
        console.error('Errore:', error);
      }


    } else {
      alert('Must provide an email');
    }
}



  const onCloseAlert = (): void => {
    setAlertVisible(false);
  };


  
  const handleCreateAccount = async () => {
    try {
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
        }),
      });

      if (response.ok) {
        console.log('Utente registrato con successo');

        console.log('Dati del modulo:', formData);
        setFormVisible(false)
        setLabelVisible(true);
      
      } else {
        console.error('Errore durante la registrazione dell\'utente');
        console.error('Errore nella risposta del server:', await response.text());
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Errore:', error);
    }
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
                <button type="submit"> Send </button>
              </form>
            </div>
          )}

          {/* aggiunta per utente non registrato */}
          {isAlertVisible && isFormVisible && (
            <div className="alert-container">
              <div className="alert-box">
                <Alert variant="filled" severity="error">
                  <h3> Utente non presente nel sistema! </h3>
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



          {isCalendarVisible && (
            <div>
            <CalendarBaseComponent currentName= {formData.name} currentSurname={formData.surname} currentEmail={formData.email} isLableVisible={isLabelVisible}  />
            
              </div>
          )}

      

    </div>
  
  )

  
}
