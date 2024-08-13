import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';
import Sidebar from './Sidebar';

const firebaseConfig = {
  apiKey: "AIzaSyBVoYCSrsa132IEVFFti0gWGsGOKPf4jQE",
  authDomain: "videomeet-3f145.firebaseapp.com",
  databaseURL: "https://videomeet-3f145-default-rtdb.firebaseio.com",
  projectId: "videomeet-3f145",
  storageBucket: "videomeet-3f145.appspot.com",
  messagingSenderId: "909819166073",
  appId: "1:909819166073:web:f3868e68ad0b2e04d343a8",
  measurementId: "G-Q7KN0HYDP8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [userRole, setUserRole] = useState('user'); // Default role is 'user'

  useEffect(() => {
    const fetchUserRole = async (uid) => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRole(user.uid);
      }
    });

    const loadMeetings = async () => {
      const querySnapshot = await getDocs(collection(db, 'meetings'));
      const events = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          title: data.title,
          start: data.dateTime,
          extendedProps: {
            meetingId: data.meetingId
          }
        };
      });
      setEvents(events);
    };

    loadMeetings();

    return () => unsubscribe();
  }, []);

  const handleEventClick = (info) => {
    const meetingId = info.event.extendedProps.meetingId;
    const title = info.event.title;
    const dateTime = new Date(info.event.start).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    setMeetingInfo({ title, dateTime, meetingId });
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    const title = e.target.meetTitle.value;
    const date = e.target.meetDate.value;
    const time = e.target.meetTime.value;
    const dateTime = new Date(`${date}T${time}`);
    const meetingId = Math.random().toString(36).substr(2, 9).toUpperCase();

    await addDoc(collection(db, 'meetings'), {
      meetingId,
      title,
      date,
      time,
      dateTime: dateTime.toISOString(),
      createdAt: serverTimestamp()
    });

    alert(`Meeting "${title}" scheduled for ${dateTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })}\nMeeting ID: ${meetingId}`);

    setEvents([...events, {
      title,
      start: dateTime.toISOString(),
      extendedProps: { meetingId }
    }]);
  };

  return (
    <div className="container">
      <Sidebar/>
      <h2>Schedule your Meet</h2>
      <div className="button-group">
        {userRole === 'admin' && (
          <button className="btn btn-primary" onClick={() => document.getElementById('scheduleForm').style.display = 'block'}>
            <i className="fas fa-calendar-plus"></i> Schedule a Meet
          </button>
        )}
        <button className="btn btn-success" onClick={() => {
          const meetingId = prompt("Enter the Meeting ID:");
          if (meetingId) {
            window.location.href = `webrtc?meetingId=${meetingId}`;
          }
        }}>
          <i className="fas fa-video"></i> Join a Meet
        </button>
      </div>
      {meetingInfo && (
        <div id="meetingInfo">
          <h3>Scheduled Meeting</h3>
          <p id="meetingTitle">Title: {meetingInfo.title}</p>
          <p id="meetingDateTime">Date and Time: {meetingInfo.dateTime}</p>
          <p id="meetingId">Meeting ID: {meetingInfo.meetingId}</p>
        </div>
      )}
      <form id="scheduleForm" style={{ display: 'none' }} onSubmit={handleScheduleMeeting}>
        <input type="text" id="meetTitle" placeholder="Meeting Title" required />
        <input type="date" id="meetDate" required />
        <input type="time" id="meetTime" required />
        <button type="submit" className="btn btn-primary">Schedule Meeting</button>
      </form>
      <div id="calendar" className="calendar-wide">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
};

export default Calendar;