import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDmPon15pDhh6C_-bl6p_xWQrLKx1CVFJU",
  authDomain: "project4-kharbsha.firebaseapp.com",
  databaseURL: "https://project4-kharbsha.firebaseio.com",
  projectId: "project4-kharbsha",
  storageBucket: "project4-kharbsha.appspot.com",
  messagingSenderId: "468753433035",
  appId: "1:455668950796:web:4837c8477221e1064b0b29",
  measurementId: "G-VSGFPEFLK4",
};

firebase.initializeApp(firebaseConfig);

export const getPlayerRef = (host, sessionID) => {
  return firebase.database().ref(host + sessionID + "/playersDB");
};

export const getDrawingRef = (host, sessionID) => {
  return firebase.database().ref(host + sessionID + "/drawingDB");
};

export const getTimerRef = (host, sessionID) => {
  return firebase.database().ref(host + sessionID + "/timerDB");
};

export const getChatRef = (host, sessionID) => {
  return firebase.database().ref(host + sessionID + "/chatDB");
};

export const getWordRef = (host, sessionID) => {
  return firebase.database().ref(host + sessionID + "/wordDB");
};

export const getGameRef = (host, sessionID) => {
  return firebase.database().ref(host + sessionID + "/gameDB");
};

export const getSessionRef = (host, sessionID) => {
  return firebase.database().ref(host + sessionID + "/sessionDB");
};
