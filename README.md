# Moovie Track  

## Overview  
Moovie Track is a movie-tracking web application built with React, Vite, Firebase, and The Movie Database (TMDB) API.
The app allows users to browse movies without logging in. Registered users can save movies to their watchlist, mark movies as watched, add ratings, and write personal notes.  

## Live Demo

Try the app here: (https://moovietrack.netlify.app/)  
*(No login required to browse — but sign up to unlock full features!)*

---

### Features  
- Search movies using The Movie Database (TMDB) API
- Browse movie information without logging in
- Sign up and log in with Firebase Authentication
- Save movies to a personal watchlist
- Mark movies as watched
- Add ratings and personal notes
- Store user-specific data using Firestore
- Protect saved data so each user can access only their own movies
- Deployed with Netlify

## Tech Stack

- React
- Vite
- Firebase Authentication
- Firestore
- TMDB API
- Netlify
- HTML
- CSS
- JavaScript

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
   ```js
         VITE_FIREBASE_API_KEY=your_api_key
         VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
         VITE_FIREBASE_PROJECT_ID=your_project_id
         VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
         VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
         VITE_FIREBASE_APP_ID=your_app_id
   ```
   Make Sure: - no quotes around the values, no extra spaces, and the file is named exactly .env

## Firestore Security (Production-Ready)

The deployed version uses secure Firestore rules — only logged-in users can access their own data.
If you're setting up your own Firebase project, replace the default Firestore rules with:
```js
     rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{userId}/{document=**} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      } 
```

### Documentation & API References  

- **[Firebase Documentation](https://firebase.google.com/docs/reference/node)**  
- **[TMDB API Documentation](https://developer.themoviedb.org/docs)**  
