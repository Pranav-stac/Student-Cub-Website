import React from 'react';
import './Home.css';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import News from './News';

const eventsData = [
  { title: 'Meeting with team', start: new Date() },
  { title: 'Project deadline', start: new Date(Date.now() + 86400000) }
];

const Home = ({ progress }) => {
  return (
    <div className="home">
      <Sidebar className="sidebar" />
      <div className="main-content">
        <div className="header">
          <div className="image-section">
            <img src="../coding-club-steam.png" alt="Header Image" className="header-image" />
          </div>
          <div className="reminders-section">
            <h2>Reminders</h2>
            <ul>
              {eventsData.length > 0 ? (
                eventsData.map((event, index) => (
                  <li key={index} className="reminder-item">
                    <p>{event.title}</p>
                    <p>{new Date(event.start).toLocaleString()}</p>
                  </li>
                ))
              ) : (
                <p>No events available</p>
              )}
            </ul>
          </div>
        </div>
        <div className="dashboard-section">
          <Dashboard progress={progress} />
        </div>
       
      </div>
      <div className="news-section">
        <News />
      </div>
    </div>
  );
};

export default Home;