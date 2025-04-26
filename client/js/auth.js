// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBJrftwU-HT6UkeUkQVZekXccOQebi2Fd8",
  authDomain: "skillsswap-df801.firebaseapp.com",
  projectId: "skillsswap-df801",
  storageBucket: "skillsswap-df801.firebasestorage.app",
  messagingSenderId: "638710357631",
  appId: "1:638710357631:web:2b0dc4a9b779eae47ae94a",
  measurementId: "G-1C3983Z2N1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Email/Password Signin
window.signin = function() {
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('Signed in:', userCredential.user);
      // Redirect or whatever you want here
      window.location.href = 'index.html';

    })
    .catch((error) => {
      console.error('Signin error:', error.message);
      alert(error.message);
    });
}

// Google Signin
window.googleSignin = function() {
  const provider = new GoogleAuthProvider();
  
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log('Google sign-in successful:', result.user);
      alert('Signed in with Google!');
      // Redirect or whatever you want here
    })
    .catch((error) => {
      console.error('Google signin error:', error.message);
      alert(error.message);
    });
}