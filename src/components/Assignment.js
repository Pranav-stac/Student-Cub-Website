import React from 'react';
import './Assignment.css';
import Sidebar from './Sidebar';
const Assignment = () => {
  return (
    <div className="assignments">
      <Sidebar/>
      <h1>Assignments</h1>
      <div className="semesters">
        <button className="semester active">Semester 01</button>
        <button className="semester">Semester 02</button>
        <button className="semester">Semester 03</button>
        <button className="semester">Semester 04</button>
      </div>
      <table className="assignments-table">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Subject</th>
            <th>Issue Date</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>03</td>
            <td>CRP</td>
            <td>03/02/2023</td>
            <td>03/05/2023</td>
            <td>Submitted</td>
          </tr>
          <tr>
            <td>01</td>
            <td>Programming</td>
            <td>03/09/2023</td>
            <td>03/09/2023</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>01</td>
            <td>Database</td>
            <td>03/01/2024</td>
            <td>03/10/2026</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>01</td>
            <td>Networking</td>
            <td>02/05/2023</td>
            <td>03/11/2023</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>02</td>
            <td>Security</td>
            <td>02/08/2022</td>
            <td>03/10/2023</td>
            <td>Late Submission</td>
          </tr>
        </tbody>
      </table>
      <div className="pagination">
        <button>Previous</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default Assignment;