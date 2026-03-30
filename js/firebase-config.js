// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyC17XorU2XCP3_NiSTlB3xdQvFjSJfPKgk",
  authDomain: "bharatcraft-c9c22.firebaseapp.com",
  projectId: "bharatcraft-c9c22",
  storageBucket: "bharatcraft-c9c22.firebasestorage.app",
  messagingSenderId: "689495749501",
  appId: "1:689495749501:web:f2ddbe0b8f389dbd2d5214"
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);

// Export references using compat SDK natively to window mapped securely
window.fbDB = firebase.firestore();
window.fbAuth = firebase.auth();
window.fbStorage = firebase.storage();

// Enable Firestore offline persistence for better UX and PWA support
window.fbDB.enablePersistence({ synchronizeTabs: true })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firebase: Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firebase: The current browser does not support all of the features required to enable persistence.');
    }
  });

console.log('✅ Firebase initialized alongside Custom Compat Config');