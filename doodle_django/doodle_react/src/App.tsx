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
