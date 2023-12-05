// App.tsx
import React from 'react';
import './App.css';
import Cookies from 'js-cookie';
import {WelcomePage} from "./UI/WelcomePage/Component/WelcomePage";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import {Switch} from "@mui/material";
import {LoginFormComponent} from "./UI/Form/Component/LoginFormComponent";
import {SigninFormComponent} from "./UI/Form/Component/SigninFormComponent";
import {PlanningPanelComponent} from "./UI/PlanningPanel/Component/PlanningPanel";
import {FormComponent} from "./UI/Form/Component/FormIdentification";
import {MeetingCreation} from "./UI/MeetingCreation/Component/MeetingCreationForm";
import {DashboardComponent} from "./UI/Dashboard/Component/dashboardComponent";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes >
                <Route path={"/"} element={<WelcomePage />}/>
                    <Route path="/login" element={<FormComponent startValue={"login"} />}/>
                    <Route path="/signin" element={<FormComponent startValue={"signin"} />}/>
                    <Route path='/create-meeting' element={<MeetingCreation />}/>
                    <Route path='/recap-meeting/:id' element={<MeetingRecap/>}/>
                    <Route path='/pool-meeting/:id' element={<h1>qua ci va il component del pool meeting</h1>}/>
                    <Route path='/dashboard' element={<DashboardComponent/>}/>
                    
            </Routes>
        </BrowserRouter>.
    </div>
  );
}

export default App;
