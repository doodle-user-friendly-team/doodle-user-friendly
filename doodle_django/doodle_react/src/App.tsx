import React from 'react';
import { FormComponent } from './UI/Form/Component/FormIdentification';
import logo from './logo.svg';
import './App.css';
import {PlanningPanelComponent} from "./UI/PlanningPanel/Component/PlanningPanel";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Cookies from 'js-cookie';
//{Cookies.get('email') === undefined && <FormComponent />}
//{Cookies.get('email') !== undefined && <PlanningPanelComponent />}
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<FormComponent />} />
          <Route path='/' element={<PlanningPanelComponent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
