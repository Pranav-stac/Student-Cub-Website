import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Changed useHistory to useNavigate
import './SignUp.css';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
// const storage = getStorage(app);
const db = getFirestore(app);

const SignUp = () => {
  const navigate = useNavigate(); // Changed history to navigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeYear, setCollegeYear] = useState('first');
  // const [profilePicture, setProfilePicture] = useState(null);
  const [role, setRole] = useState('member');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user.uid);

      // // Upload profile picture
      // const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
      // await uploadBytes(profilePicRef, profilePicture);
      // const profilePicURL = await getDownloadURL(profilePicRef);
      // console.log('Profile picture uploaded:', profilePicURL);

      // Save additional user info
      await setDoc(doc(db, 'users', user.uid), {
        email,
        collegeYear,
        // profilePicture: profilePicURL,
        role,
      });
      console.log('User data saved to Firestore');
      navigate('/signin'); // Changed history.push to navigate
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  // const handleProfilePictureChange = (e) => {
  //   setProfilePicture(e.target.files[0]);
  // };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          College Year:
          <select
            value={collegeYear}
            onChange={(e) => setCollegeYear(e.target.value)}
            required
          >
            <option value="first">First Year</option>
            <option value="second">Second Year</option>
            <option value="third">Third Year</option>
            <option value="fourth">Fourth Year</option>
          </select>
        </label>
        {/* <label>
          Profile Picture:
          <input
            type="file"
            onChange={handleProfilePictureChange}
            required
          />
        </label> */}
        <label>
          Role in Club:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="member">Member</option>
            <option value="core">Core</option>
            <option value="head">Head</option>
          </select>
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;