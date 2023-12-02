// App.tsx
import React from 'react';
import './App.css';
import ScrollPage from './UI/WelcomePage/Component/ScrolPage';
import { MeetingRecap } from './UI/MeetingRecap/Component/MeetingRecap';
import Cookies from 'js-cookie';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            {
                Cookies.get('email') === undefined ?
                    <>
                        <Route path='/' element={<FormComponent />} />
                    </>
                :
                    <>
                        <Route path='/login' element={<FormComponent />}/>
                        <Route path='/' element={<PlanningPanelComponent />} />
                    </>
            }
        </Routes>
      </Router>
    </div>
    <MeetingRecap/>
  );
}

export default App;
