import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Configure aqui suas credenciais do Firebase
// Você pode obter isso em: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure Auth persistence and popup behavior
auth.useDeviceLanguage();

// Configure email action settings for password reset
import { ActionCodeSettings } from "firebase/auth";

const actionCodeSettings: ActionCodeSettings = {
  url: window.location.origin + '/agendar', // Redirect to appointment page after password reset
  handleCodeInApp: true,
  // Add dynamic link domain if you have one configured
  // dynamicLinkDomain: 'your-domain.page.link'
};

// Configure auth settings to improve email deliverability
auth.languageCode = 'pt-BR'; // Set language to Portuguese Brazil

// You can use this actionCodeSettings when sending password reset emails
export { actionCodeSettings };

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
