import { LocalizationProvider } from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {WelcomePage} from "./UI/WelcomePage/Component/WelcomePage";
import {FormComponent} from "./UI/Form/Component/FormIdentification";
import {MeetingCreation} from "./UI/MeetingCreation/Component/MeetingCreationForm";
import {RecapOrganizer} from "./UI/MeetingRecap/Organizer/Component/RecapOrganizer";
import {DashboardComponent} from "./UI/Dashboard/Component/dashboardComponent";
import Calendar from "./UI/Calendar/Components/Calendar";
import { apiCalendar } from "./Google/Google";

function App() {

 
    
  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="App">
          
            <BrowserRouter>
                <Routes >
                    <Route path="/" element={<WelcomePage />}/>
                    <Route path="/login" element={<FormComponent startValue={"login"} />}/>
                    <Route path="/signin" element={<FormComponent startValue={"signin"} />}/>
                    <Route path='/create-meeting' element={<MeetingCreation />}/>
                    <Route path='/recap-meeting/:link_meeting' element={<RecapOrganizer/>}/>
                    <Route path='/dashboard' element={<DashboardComponent/>}/>
                    <Route path='/schedulePool/:pool_link' element={<Calendar />} />
                </Routes>
            </BrowserRouter>
        </div>
    </LocalizationProvider>
  );
}

export default App;
