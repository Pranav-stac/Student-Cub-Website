import React, { useEffect, useRef, useState } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, doc, addDoc, getDocs, onSnapshot, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDCZZ-v6lMKjkFIcDQiYesTo0UVPePc6Ak",
  authDomain: "webathon-7d314.firebaseapp.com",
  projectId: "webathon-7d314",
  storageBucket: "webathon-7d314.appspot.com",
  messagingSenderId: "968553592912",
  appId: "1:968553592912:web:f087b807da65c24147b955",
  measurementId: "G-EZGFRYSZ35"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Define whiteboardData outside of useEffect
const whiteboardDoc = doc(collection(firestore, 'whiteboard'), 'session');
const whiteboardData = collection(whiteboardDoc, 'data');

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [erasing, setErasing] = useState(false);
  const userId = 'user123'; // Replace with actual user ID logic
  const userColor = getRandomColor();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    setContext(ctx);

    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.strokeStyle = '#000000'; // Default stroke color
    ctx.lineWidth = 2;

    // Sync drawing data from Firestore
    const unsubscribe = onSnapshot(whiteboardData, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          ctx.strokeStyle = data.erasing ? '#FFFFFF' : data.color; // Use the color from Firestore
          if (data.type === 'start') {
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
          } else if (data.type === 'draw') {
            if (data.erasing) {
              ctx.clearRect(data.x - 5, data.y - 5, 10, 10);
            } else {
              ctx.lineTo(data.x, data.y);
              ctx.stroke();
            }
          } else if (data.type === 'end') {
            ctx.closePath();
          }
          // Display who is drawing
          if (data.user) {
            console.log(`User ${data.user} is drawing`);
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const handleMouseDown = async (e) => {
    setDrawing(true);
    context.strokeStyle = erasing ? '#FFFFFF' : userColor; // Use user color
    context.beginPath();
    context.moveTo(e.clientX, e.clientY);
    await addDoc(whiteboardData, { x: e.clientX, y: e.clientY, type: 'start', user: userId, erasing, color: userColor });
  };

  const handleMouseMove = async (e) => {
    if (!drawing) return;
    if (erasing) {
      context.clearRect(e.clientX - 5, e.clientY - 5, 10, 10);
    } else {
      context.lineTo(e.clientX, e.clientY);
      context.stroke();
    }
    await addDoc(whiteboardData, { x: e.clientX, y: e.clientY, type: 'draw', user: userId, erasing, color: userColor });
  };

  const handleMouseUp = async (e) => {
    setDrawing(false);
    context.closePath();
    await addDoc(whiteboardData, { type: 'end', user: userId, erasing, color: userColor });
  };

  const handleClear = async () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const snapshot = await getDocs(whiteboardData);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    await addDoc(whiteboardData, { type: 'clear' });
  };

  const handleEraser = () => {
    setErasing(!erasing);
    context.strokeStyle = erasing ? '#FFFFFF' : userColor; // Change stroke color to white when erasing
  };

  const handleChangeBackgroundColor = () => {
    const newColor = getRandomColor();
    canvasRef.current.style.backgroundColor = newColor;
    console.log(`Whiteboard background color changed to ${newColor}`);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
      <button id="clearButton" onClick={handleClear}>Clear</button>
      <button id="eraserButton" onClick={handleEraser}>Eraser</button>
      <button id="changeBackgroundColorButton" onClick={handleChangeBackgroundColor}>Change Background Color</button>
    </div>
  );
};

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default Whiteboard;