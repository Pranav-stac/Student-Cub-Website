import React from 'react';
import './Dashboard.css';

const Dashboard = ({ progress }) => {
  const getProgressClass = (percentage) => {
    if (percentage < 33) return 'low';
    if (percentage < 66) return 'medium';
    return 'high';
  };

  return (
    <div className="dashboard">
      <div className="progress-section">
        <h1>Course Progress</h1>
        <div className="course-progress-container">
          {Object.keys(progress).map(course => (
            <div key={course} className="course-progress">
              <div className="progress-bar">
                <div className={`progress ${getProgressClass(progress[course])}`} style={{ width: `${progress[course]}%` }}>
                  {progress[course].toFixed(2)}%
                </div>
              </div>
              <h3>{course}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;