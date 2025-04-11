# Moovie Track  

## Overview  
Moovie Track is a simple movie tracking app that allows users to search, save, add notes, and rate movies. The app is built using **React** ,**Firebase** and **Vite**.  

## Live Demo

Try the app here: (https://moovietrack.netlify.app/)  
*(No login required to browse — but sign up to unlock full features!)*

---

### Features  
- Search movies using **The Movie Database (TMDB) API**.  
- Support for **Firebase Authentication** (email sign-in).  
- Save user data, including watchlist, ratings, and notes, using **Firestore Database**.
- Built with **React** + **Vite** for fast loading 

## Getting Started  

### Prerequisites  
- Ensure you have **Node.js** installed on your system. You can download it from [nodejs.org](https://nodejs.org/).  

### Installation  

1. Clone the repository:  
   ```bash
   git clone https://github.com/AnastasiaTaucci/moovie-app.git
   cd moovie-app
2. Install dependencies:
    ```bash
    npm install
3. Start the development server:
    ```bash
    npm run dev

### IMPORTANT!

For security reasons, **Firebase credentials are not included** in this repository.
To run the app locally, you must **set up your own Firebase project** and add your config to a .env file.

## Firebase Setup

If you want to run the app on your own computer:
 - Go to the **Firebase Console**
 - Create a new Firebase project
 - Enable **Authentication** (Email/Password) and **Cloud Firestore** (Firestore starts in test mode when you first enable it.
      Be sure to switch to production rules before deploying. See below)
 - In **Project Settings**, create a **Web App** and copy your Firebase config
 - Create a file named .env in the root of your project folder and add the following:
         VITE_FIREBASE_API_KEY=your_api_key
         VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
         VITE_FIREBASE_PROJECT_ID=your_project_id
         VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
         VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
         VITE_FIREBASE_APP_ID=your_app_id
   Make Sure: - no quotes around the values, no extra spaces, and the file is named exactly .env

## Firestore Security (Production-Ready)

The deployed version uses secure Firestore rules — only logged-in users can access their own data.
If you're setting up your own Firebase project, replace the default Firestore rules with:
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{userId}/{document=**} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }

### Documentation & API References  

- **[Firebase Documentation](https://firebase.google.com/docs/reference/node)**  
- **[TMDB API Documentation](https://developer.themoviedb.org/docs)**  
