# Authentication and Firebase Setup

This file explains how to configure authentication and Firebase for the appointment app.

## 1. Install dependencies

Run the following command in the project:

```bash
npm install firebase react-firebase-hooks
```

## 2. Configure Firebase

1. Open Firebase Console: https://console.firebase.google.com/
2. Create a new project, for example `barbershop-agendamentos`
3. Go to **Authentication** in the project menu
4. Under **Sign-in method**, enable the **Google** provider
5. Save the changes

## 3. Create Firestore database

1. Open **Firestore Database** in the Firebase console
2. Click **Create database**
3. Choose test mode for development
4. Select a location and finish

## 4. Add credentials to the project

Create a `.env.local` file from the template:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 5. Restart the development server

After adding `.env.local`, restart the app:

```bash
npm run dev
```

## 6. Authentication structure in the app

The project includes:

- `src/lib/firebase.ts` — initializes Firebase Auth and Firestore
- `src/contexts/AuthContext.tsx` — provides authentication context
- `src/components/AuthModal.tsx` — login/signup modal
- `src/services/appointmentsService.ts` — saves appointments to Firestore
- `src/pages/AppointmentPage.tsx` — appointment flow with authentication

## 7. Important notes

- Do not commit `.env.local`
- In production, configure Firestore security rules
- Make sure the credentials in `.env.local` are correct

## 8. Recommended next steps

- Add authentication for the admin panel
- Implement Firestore security rules
- Add email confirmation or notifications
