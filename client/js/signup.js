// signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR-KEY",
  authDomain: "YOUR-DOMAIN",
  projectId: "YOUR-ID",
  storageBucket: "YOUR-BUCKET",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const bio = document.getElementById('bio').value.trim();
  const skills = {
    HTML: document.getElementById('htmlSkill').checked ? "1" : "0",
    CSS: document.getElementById('cssSkill').checked ? "1" : "0",
    JavaScript: document.getElementById('jsSkill').checked ? "1" : "0"
  };

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      bio: bio,
      skills: skills,
      goals: [],
      followers: [],
      following: [],
      connection_requests: [],
      connections: [],
      created_at: serverTimestamp()
    });

    alert("Signup successful!");
    window.location.href = "home.html"; // or your dashboard page
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
