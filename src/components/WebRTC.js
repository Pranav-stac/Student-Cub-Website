import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, addDoc } from 'firebase/firestore';
import Whiteboard from './whiteboard'; 
import Modal from 'react-modal'; 


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
const firestore = getFirestore(app);

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const WebRTC = () => {
  const [pc, setPc] = useState(new RTCPeerConnection(servers));
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false); // State to manage Whiteboard modal
  const webcamVideo = useRef(null);
  const remoteVideo = useRef(null);
  const callInput = useRef(null);
  const callButton = useRef(null);
  const answerButton = useRef(null);
  const hangupButton = useRef(null);
  const webcamButton = useRef(null);

  useEffect(() => {
    const setupPeerConnection = () => {
      const newPc = new RTCPeerConnection(servers);
      newPc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      newPc.onconnectionstatechange = () => {
        if (newPc.connectionState === 'disconnected' || newPc.connectionState === 'failed') {
          hangup();
        }
      };

      newPc.oniceconnectionstatechange = () => {
        if (newPc.iceConnectionState === 'disconnected' || newPc.iceConnectionState === 'failed') {
          hangup();
        }
      };

      newPc.onicegatheringstatechange = () => {
        console.log(`ICE gathering state change: ${newPc.iceGatheringState}`);
      };

      newPc.onsignalingstatechange = () => {
        console.log(`Signaling state change: ${newPc.signalingState}`);
      };

      setPc(newPc);
    };

    setupPeerConnection();

    const urlParams = new URLSearchParams(window.location.search);
    const meetingId = urlParams.get('meetingId');
    if (meetingId) {
      callInput.current.value = meetingId;
      answerButton.current.disabled = false;
    }

    return () => {
      pc.close();
    };
  }, [remoteStream]);

  const startWebcam = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser");
      }

      if (pc.signalingState === 'closed') {
        setPc(new RTCPeerConnection(servers));
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
      webcamVideo.current.srcObject = stream;
      remoteVideo.current.srcObject = remoteStream;
      callButton.current.disabled = false;
      answerButton.current.disabled = false;
      console.log("Webcam started successfully");
    } catch (error) {
      console.error("Error accessing webcam: ", error);
    }
  };

  const createOffer = async () => {
    try {
      const callDoc = doc(collection(firestore, 'calls')); // Correct usage of collection
      const offerCandidates = collection(callDoc, 'offerCandidates');
      const answerCandidates = collection(callDoc, 'answerCandidates');

      callInput.current.value = callDoc.id;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(offerCandidates, event.candidate.toJSON()).catch(error => console.error("Error adding offer candidate: ", error));
        }
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDoc, { offer });

      console.log("Offer created and set:", offer);

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription).catch(error => console.error("Error setting remote description: ", error));
          console.log("Answer received and set:", data.answer);
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate).catch(error => console.error("Error adding ICE candidate: ", error));
            console.log("Answer candidate added:", change.doc.data());
          }
        });
      });

      hangupButton.current.disabled = false;
    } catch (error) {
      console.error("Error creating offer: ", error);
    }
  };

  const answerCall = async () => {
    try {
      const callId = callInput.current.value;
      console.log("Answering call with ID:", callId);
      const callDoc = doc(firestore, 'calls', callId);
      const answerCandidates = collection(callDoc, 'answerCandidates');
      const offerCandidates = collection(callDoc, 'offerCandidates');

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(answerCandidates, event.candidate.toJSON()).catch(error => console.error("Error adding answer candidate: ", error));
          console.log("Answer candidate added:", event.candidate.toJSON());
        }
      };

      const callData = (await getDoc(callDoc)).data();
      if (!callData) {
        console.error("No call data found for ID:", callId);
        return;
      }
      const offerDescription = callData.offer;
      await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
      console.log("Offer received and set:", offerDescription);

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await setDoc(callDoc, { answer }, { merge: true });
      console.log("Answer created and set:", answer);

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate).catch(error => console.error("Error adding offer candidate: ", error));
            console.log("Offer candidate added:", change.doc.data());
          }
        });
      });
    } catch (error) {
      console.error("Error answering call: ", error);
    }
  };

  const hangup = () => {
    pc.close();
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    remoteStream.getTracks().forEach(track => track.stop());
    callButton.current.disabled = true;
    answerButton.current.disabled = true;
    webcamButton.current.disabled = false;
    hangupButton.current.disabled = true;
  };

  // Add connection state change listeners
  useEffect(() => {
    pc.onconnectionstatechange = () => {
      console.log(`Connection state change: ${pc.connectionState}`);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        hangup();
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state change: ${pc.iceConnectionState}`);
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        hangup();
      }
    };

    pc.onicegatheringstatechange = () => {
      console.log(`ICE gathering state change: ${pc.iceGatheringState}`);
    };

    pc.onsignalingstatechange = () => {
      console.log(`Signaling state change: ${pc.signalingState}`);
    };
  }, [pc]);

  return (
    <div className="webrtc-container">
      <div className="video-container">
        <video ref={webcamVideo} autoPlay playsInline className="video-frame"></video>
        <video ref={remoteVideo} autoPlay playsInline className="video-frame"></video>
      </div>
      <div className="controls">
        <input ref={callInput} placeholder="Enter call ID" className="call-input" />
        <button ref={webcamButton} onClick={startWebcam} className="control-button">Start Webcam</button>
        <button ref={callButton} onClick={createOffer} className="control-button">Create Call</button>
        <button ref={answerButton} onClick={answerCall} className="control-button">Answer</button>
        <button ref={hangupButton} onClick={hangup} className="control-button" disabled>Hang Up</button>
        <button onClick={() => setIsWhiteboardOpen(true)} className="control-button">Open Whiteboard</button>
      </div>
      <Modal
        isOpen={isWhiteboardOpen}
        onRequestClose={() => setIsWhiteboardOpen(false)}
        contentLabel="Whiteboard"
        className="whiteboard-modal-bottom"
        overlayClassName="whiteboard-overlay-bottom"
      >
        <Whiteboard />
        <button onClick={() => setIsWhiteboardOpen(false)} className="control-button">Close Whiteboard</button>
      </Modal>
    </div>
  );
};

export default WebRTC;