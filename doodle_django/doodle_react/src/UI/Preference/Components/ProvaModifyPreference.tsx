import React from "react";
import { MofifyPreferenceForm } from "./ModifyPreferenceForm";
import { useState } from "react";
import { Snackbar } from "@mui/material";

export function Richiamo() {
    //<ContainerTopThree />
    const [form,showForm] = useState(false);
    const [type,setType] = useState("Available");
    const [saved,showSaved] = useState(false);
  
    
    const handleSave = (preference: string) => {
      console.log("-> "+preference);
      setType(preference);
      showForm(false);
      showSaved(true);
    }
  
    const clickForm = () => {
      showForm(true);
      showSaved(false);
    }
    /*
    return (
      <ContainerTopThree />
    )
      */
    return (
      <div>
        <button onClick={clickForm}>Prova</button>
        <h1>{type}</h1>
        {form && <MofifyPreferenceForm 
          id={1}
          user={1}
          time_slot={1}
          selectedPreference={type} 
          onSave={handleSave} 
          onClose={() => showForm(false)} 
          start="10:00 AM"
          end="12:00 PM"
          date="2023-11-11"
        />}
      </div>
      //      {saved&&<CustomSnackbar onClose={()=>showSaved(false)} open={true} />}
  
    );
  }