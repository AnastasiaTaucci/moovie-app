import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

const StarRating = ({ movie, userId }) => {
    const [rating, setRating] = useState(movie.rating || 0);    // If movie.rating exists in user db, use it, otherwise use 0

    const handleRatingChange = async (e) => {
        e.stopPropagation();                                    // Prevents triggering click events of parent elements
        const newRating = Number(e.target.value);               // convert value gotten from event from slider to number type
        setRating(newRating);

        try {
            const movieRefWatched = doc(db, "users", userId, "watched", movie.id);
            await setDoc(movieRefWatched, { rating: newRating }, { merge: true });

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
                await setDoc(querySnapshot.docs[0].ref, { rating: newRating }, { merge: true });         // querySnapshot.docs: this is an array of all matching Firestore documents. the document reference — tells Firestore exactly which doc to update.
            }
        } catch (error) {
            console.error("Error updating rating:", error);
        }
    };

    return (
        <div className="movie-rating" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="rating-slider">Your Rating:</label>
            <div className="slider">
                <input 
                    type="range"
                    id="rating-slider" 
                    min="0" 
                    max="5" 
                    step="0.5" 
                    value={rating === "Not rated yet" ? 0 : rating} 
                    onChange={handleRatingChange}
                    aria-labelledby="rating-label"
                />
                <span>★ {rating}</span>
            </div>

        </div>
    );
};

export default StarRating;


// -----------  How this works: ---------------
//
// When a new movie is added to the watchedList,
// If movie.rating is undefined, it defaults to 0 
// When the user moves the slider, onChange event fires, trigger handleRatingChange
//
// handleRatingChange extracts the new rating from the slider via newRating = e.target.value, and converts it into a number
// setRating updates the rating state with newRating
//
// updateDoc with new rating
// { merge: true } ensures only the rating field is modified
//
// Next time the component renders, movie.rating now exists in Firestore
// useState(movie.rating || 0) uses the rating from Firestore,
// <span>{rating} ★</span> displays the saved rating.