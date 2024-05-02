// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHNXJC6JbCg1UhX1dUzvR0MpgxRLIh1H0",
  authDomain: "task-1b27b.firebaseapp.com",
  projectId: "task-1b27b",
  storageBucket: "task-1b27b.appspot.com",
  messagingSenderId: "295582526472",
  appId: "1:295582526472:web:794d5e8ec514600574f5bd"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const firestore = firebase.firestore();
const auth = firebase.auth();
export { auth,firestore};