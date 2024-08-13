import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import MyCourses from './components/MyCourses';
import Forum from './components/Forum';
import Calendar from './components/Calendar';
import Assignment from './components/Assignment';
import Resources from './components/Resources';
import WebRTC from './components/WebRTC';
function App() {
  const [progress, setProgress] = useState({});

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home progress={progress} />} />
          <Route path="/mycourses" element={<MyCourses setProgress={setProgress} />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/webrtc" element={<WebRTC />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;