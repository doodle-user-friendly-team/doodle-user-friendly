import React from 'react';
import { FormComponent } from './UI/Form/Component/FormIdentification';
import logo from './logo.svg';
import './App.css';
import {PlanningPanelComponent} from "./UI/PlanningPanel/Component/PlanningPanel";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Cookies from 'js-cookie';
import Calendar from './UI/Calendar/Components/Calendar';
//{Cookies.get('email') === undefined && <FormComponent />}
//{Cookies.get('email') !== undefined && <PlanningPanelComponent />}
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            {
                Cookies.get('email') === undefined ?
                    <Route path='/' element={<FormComponent />} />
                :
                    <>
                        <Route path='/login' element={<FormComponent />}/>
                        <Route path='/' element={<PlanningPanelComponent />} />
                        <Route path='/meeting' element={<Calendar currentDate={new Date(Date.now())} startDate={new Date("2023-11-30")} />} />
                    </>
            }
        </Routes>
      </Router>
    </div>
  );
}

export default App;
