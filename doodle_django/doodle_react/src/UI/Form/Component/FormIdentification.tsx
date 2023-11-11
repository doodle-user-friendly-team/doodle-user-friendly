import React, { useState, FormEvent} from 'react';
import "../CSS/style.css";
import { CalendarBaseComponent } from '../../Calendar/Components/CalendarBase';


export const FormComponent = () => {
  const [formData, setFormData] = useState({
    name:'',
    surname:'',
    email:''

  });
  
  const [isFormVisible, setFormVisible] = useState(true);
  const [isCalendarVisible, setCalendarVisible] = useState(true);
  const [isLabelVisible, setLabelVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (formData.name && formData.surname && formData.email) {
      console.log('Dati del modulo:', formData);
      setFormVisible(false)
      setCalendarVisible(true);
    } else {
      alert('Must complet all fields');
    }
  }

  const handleShowLabel = () => {
    setLabelVisible(true);
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
                  <b>Username</b>
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
                <button type="submit" onClick={handleShowLabel}> Send </button>
              </form>
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