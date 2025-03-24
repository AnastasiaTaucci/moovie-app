import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const MovieNote = ({ movie, userId }) => {
    const [note, setNote] = useState(movie.note || "");                         // Use existing note if available
    const [isSaved, setIsSaved] = useState(true);                               // Track if note is saved
    const maxChars = 200;

    const handleChange = (e) => {
        setNote(e.target.value);                                                // value of the textarea input
        setIsSaved(false);                                                      // Mark as unsaved whenever user types
    };

    const handleSaveNote = async () => {
        try {
            // Update note in "watched"
            const movieRef = doc(db, "users", userId, "watched" , movie.id);      // Reference to the movie document in Firestore
            await setDoc(movieRef, { note: note }, { merge: true });            // Update the 'note' field

            // Check if the same movie exists in "watchlist"
            // Query the watchlist for a movie with same title and release_date
                const watchlistRef = collection(db, "users", userId, "watchlist");                          //  the reference to the user’s watchlist collection.
                const q = query(watchlistRef,                                                               // creates a search query to find a movie in your "watchlist" collection
                    where ("title", "==", movie.title),                                                     // only look at movies with the same title
                    ...(movie.release_date ? [where("release_date", "==", movie.release_date)] : [])        // This means: "Also filter by release date only if it exists."
                    );
                    const querySnapshot = await getDocs(q);
                // const movieRefWatchlist = doc(db, "users", userId, "watchlist", movie.id);
                // const querySnapshot = await getDoc(movieRefWatchlist);
                if (!querySnapshot.empty) {
                    await setDoc(querySnapshot.docs[0].ref, { note: note }, { merge: true });         // querySnapshot.docs: this is an array of all matching Firestore documents. the document reference — tells Firestore exactly which doc to update.
                }

            setIsSaved(true);                                                   // Mark as saved after updating Firebase
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    return (
        <div className="movie-note" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="movie-note">My Note:</label>
            <textarea
                id="movie-note"
                value={note}
                onChange={handleChange}
                placeholder="My thought on the movie..."
                rows="2"
                cols="30"
                maxLength={200}
            />

            <div style={{ fontSize: "0.9em", color: note.length >= maxChars ? "red" : "gray" }}>
                {note.length} / {maxChars} characters
            </div>

            {/* if isSaved is true, the button will be disabled */}
            <button onClick={handleSaveNote} disabled={isSaved}>
                {isSaved ? "Saved" : "Save Note"}
            </button>
        </div>
    );
};

export default MovieNote;


// Note:
// When movie card is first ongamepadconnected, isSaaed is true, so the button will be disabled
// When user types, isSaved becomes false, and the button is enabled
// When user clicks the button, handleSaveNote is called, which updates the note in Firestore
// After updating Firestore, isSaved becomes true, and the button is disabled again