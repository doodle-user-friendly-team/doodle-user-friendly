import "./App.css";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Creation from "./pages/Creation";
import Manage from "./pages/Manage";


ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById("root")
);
function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          <Route path="/create" element={<Creation />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>{" "}
    </div>
  );
}

export default App;
