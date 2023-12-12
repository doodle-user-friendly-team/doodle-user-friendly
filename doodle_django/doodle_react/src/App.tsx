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
import {RecapOrganizer} from "./UI/MeetingRecap/Organizer/Component/RecapOrganizer";
import Calendar from './UI/Calendar/Components/Calendar';

import React from "react";
import { FormComponent } from "./UI/Form/Component/FormIdentification";
import logo from "./logo.svg";
import "./App.css";
import { PlanningPanelComponent } from "./UI/PlanningPanel/Component/PlanningPanel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import Calendar from "./UI/Calendar/Components/Calendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
//{Cookies.get('email') === undefined && <FormComponent />}
//{Cookies.get('email') !== undefined && <PlanningPanelComponent />}
function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes >
                <Route path={"/"} element={<WelcomePage />}/>
                    <Route path="/login" element={<FormComponent startValue={"login"} />}/>
                    <Route path="/signin" element={<FormComponent startValue={"signin"} />}/>
                    <Route path='/create-meeting' element={<MeetingCreation />}/>
                    <Route path='/recap-meeting/:link_meeting' element={<RecapOrganizer/>}/>
                    <Route path='/dashboard' element={<DashboardComponent/>}/>
                    <Route path={'/schedulePool/:pool_link'} element={<Calendar />} />
            </Routes>
        </BrowserRouter>.
                        
    </div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <Router>
          <Routes>
            {Cookies.get("email") === undefined ? (
              <Route path="/" element={<FormComponent />} />
            ) : (
              <>
                <Route path="/login" element={<FormComponent />} />
                <Route path="/" element={<PlanningPanelComponent />} />
                <Route
                  path={"/schedulePool/:pool_link"}
                  element={<Calendar />}
                />
              </>
            )}
          </Routes>
        </Router>
      </div>
    </LocalizationProvider>
  );
}

export default App;
