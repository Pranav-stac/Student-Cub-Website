import React, { useState } from 'react';
import './SignIn.css';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Moved useNavigate inside the component

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('uid', user.uid); // Store uid in local storage
      console.log('User signed in successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Sign in Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-footer">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember my preference</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="submit-button">Sign In</button>
        </form>
        <p className="signup-text">
          Don't have an account? <a href="/signup" className="signup-link">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;