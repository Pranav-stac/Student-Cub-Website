import React from 'react';
import './Resources.css';
import Sidebar from './Sidebar';
const resources = [
  {
    name: 'FreeCodeCamp',
    url: 'https://www.freecodecamp.org',
    description: 'Learn to code for free with millions of other people around the world.',
  },
  {
    name: 'Codecademy',
    url: 'https://www.codecademy.com',
    description: 'Learn to code interactively, for free.',
  },
  {
    name: 'Coursera',
    url: 'https://www.coursera.org',
    description: 'Online courses from top universities and companies.',
  },
  {
    name: 'Udemy',
    url: 'https://www.udemy.com',
    description: 'Online courses from top instructors.',
  },
  {
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org',
    description: 'Free online courses, lessons, and practice.',
  },
  {
    name: 'W3Schools',
    url: 'https://www.w3schools.com',
    description: 'The world\'s largest web developer site.',
  },
];

const Resources = () => {
  return (
    <div className="resources-container">
     <Sidebar/>
      <h1>Resources</h1>
      <div className="resources-grid">
        {resources.map((resource, index) => (
          <div key={index} className="resource-card">
            <h2>{resource.name}</h2>
            <p>{resource.description}</p>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
              Visit {resource.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;