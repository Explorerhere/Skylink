import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// import 'firebase/firestore'; // If you're using Firestore
// Add additional services that you want to use

// TODO: Replace the following with your app's Firebase project configuration.
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyArp3DjlKyTLuDb8gR4eJKphoaE8wSSPyQ", // The API key is not part of the service account, you need to get it from your Firebase project settings
  authDomain: "skylinker-3ccd0.firebaseapp.com", // Replace with your project's authDomain
  databaseURL: "https://skylinker-3ccd0-default-rtdb.firebaseio.com", // Directly from your provided JSON
  projectId: "skylinker-3ccd0", // Directly from your provided JSON
  storageBucket: "skylinker-3ccd0.appspot.com", // Replace with your project's storageBucket
  messagingSenderId: "106072554696434152313", // Directly from your provided JSON
  appId: "YOUR_APP_ID_HERE", // The appId is not part of the service account, you need to get it from your Firebase project settings
  // MeasurementId is optional and applies only if you've set up Google Analytics in your Firebase project
  measurementId: "YOUR_MEASUREMENT_ID_HERE"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export default database;
