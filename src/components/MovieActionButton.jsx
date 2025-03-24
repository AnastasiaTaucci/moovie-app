import React from "react";
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import {  collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate, useLocation} from 'react-router-dom';

export default function MovieActionButton({ movie, movies, setMoviesFirebase, closeCard }) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    //builds the query constraints dynamically
    function getMovieQuery(movieRef, movie) {
        
        const constraints = [where("title", "==", movie.title)];
        // Only add release_date condition if it exists
        if (movie.release_date) {
            constraints.push(where("release_date", "==", movie.release_date));
        }

        return query(movieRef, ...constraints);
    }


    // Function to handle the button click, check if logged in, 
    // add movie to list, check if movie already exists, prevent duplicates
    const addMovie = async (e, listType) => {
        e.stopPropagation();             // Prevents clicking the <li>

        if (!currentUser) {
            navigate('login', { state: { from: location } });
            return;
        }

        // Reference to the list collection of current user
        const movieRef = collection(db, "users", currentUser.uid, listType); 
        // create a query 'q' to that reference, where the title is equal to the movie.title, with the same year
        const q = getMovieQuery(movieRef, movie);
    

        const image = movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : 'https://i.postimg.cc/W3DSz9Fq/no-poster-available.png';

        try {
            const querySnapshot = await getDocs(q); // send the query to see if the movie already exists

            // If the movie is found, prevent adding a duplicate
            if (!querySnapshot.empty) {
                alert(`"${movie.title}" is already in ${listType}!`);
                return;
            }

            await addDoc(movieRef, {            // Firestore uses collections → documents → subcollections.
                title: movie.title,             // add the movie title to the document
                image: image,                   // add the movie image
                overview: movie.overview,       // add the movie details
                ...(movie.release_date && { release_date: movie.release_date }), // Only adds if it exists. The spread operator (...) expands an object only if the condition is met.
                ...(listType === "watched" && {rating: "Not rated yet", note: null}),        // adds rating option in the "watched" list
                addedAt: new Date(),            // add the date the movie was added
            })
            alert(`${movie.title} added to ${listType}!`);
        } catch (error) {
            console.error(`Error adding to ${listType}: ${error}`);
        }
    }

    const removeMovie = async (e, listType, movieId) => {
        e.stopPropagation();             // Prevents clicking the <li>

        try {

            // Delete the movie from Firestore
            await deleteDoc(doc(db, "users", currentUser.uid, listType, movieId));

            // Update state by removing the deleted movie from the UI
                //This creates a new array that excludes the movie we just deleted.
                //It keeps all movies except the one with id === movieId.
            setMoviesFirebase(movies.filter(movieInList => movieInList.id !== movieId));
            closeCard();
        } catch (error) {
            console.error('Error deleting movie from the list', error);
        }
    }

    const moveToWatchlist = async (e, movie) => {
        e.stopPropagation();             // Prevents clicking the <li>

        // Query Firestore to check if the movie already exists in the "watchlist"
        const watchlistCollection = collection(db, "users", currentUser.uid, "watchlist");          //This targets the specific collection in Firestore where the user's watched movies are stored.
        const q = getMovieQuery(watchlistCollection, movie);                    //query() is used to search Firestore.
        const querySnapshot = await getDocs(q);                                                         //getDocs(q) runs the query and returns documents that match the query

        if (!querySnapshot.empty) {
            alert("This movie is already in your Watchlist!");
            return;
        }

        // Add the movie to the "watchlist" and mark as "rewatching"
        try {
            await addDoc(collection(db, "users", currentUser.uid, "watchlist"), {
            title: movie.title,
            image: movie.image,
            overview: movie.overview,
            ...(movie.release_date && { release_date: movie.release_date }), // Only adds if it exists. The spread operator (...) expands an object only if the condition is met.
            ...(typeof movie.rating === "number" && {rating: movie.rating}), // will transfer rating into "to watch" list only for movies with rating
            ...(movie.note && {note: movie.note}),                           // will transfer note into "to watch" list only for movies with notes
            addedAt: new Date(),
            rewatching: true, // Mark as rewatching
            });

            alert("Movie added to the watchlist!")
        } catch(error) {
            console.error("Error moving to watchlist", error);
        }
    };

    async function moveToWatched(e, movie){
        e.stopPropagation();             // Prevents clicking the <li>

        // Query Firestore to check if the movie already exists in the "watched" list
        const watchedCollection = collection(db, "users", currentUser.uid, "watched");          //This targets the specific collection in Firestore where the user's watched movies are stored.
        const q = getMovieQuery(watchedCollection, movie);                  //query() is used to search Firestore.
        const querySnapshot = await getDocs(q);                                                     //getDocs(q) runs the query and returns documents that match the query

        // if the movie is already in the watchlist, we just delete it without moving to watched
        if (!querySnapshot.empty) {
            await removeMovie(e, "watchlist", movie.id);
            return;
        }

        // Add the movie to the "watched" list if it is not already there
        try {
            await addDoc(collection(db, "users", currentUser.uid, "watched"), {
                title: movie.title,
                image: movie.image,
                overview: movie.overview,
                ...(movie.release_date && { release_date: movie.release_date }), // Only adds if it exists. The spread operator (...) expands an object only if the condition is met.
                ...(movie.rating ? {rating: movie.rating} : {rating: "Not rated yet"}),        // adds rating option in the "watched" list
                ...(movie.note && {note: movie.note}),                           // will transfer note into "to watch" list only for movies with notes
                addedAt: new Date(),
            });
            alert("Movie moved to watched!");
            await removeMovie(e, "watchlist", movie.id);
        } catch(error) {
            console.error("Error moving to watched", error);
        }
    }

    return (
        <>
            {location.pathname === "/" && (
                <>  
                    <button className='movie-button-1' onClick={ (e) => addMovie(e, "watchlist")}>
                        Watchlist
                    </button>
                    <button className='movie-button-2' onClick={ (e) => addMovie(e, "watched")}>
                        Watched
                    </button>
                </> 
            )}
            {location.pathname.includes("watchlist") && (
                <>  
                    <button className='movie-button-1' onClick={ (e) => moveToWatched(e, movie)}>
                        Watched
                    </button>
                    <button className='movie-button-2' onClick={ (e) => removeMovie(e, "watchlist", movie.id)}>
                        Remove
                    </button>
                </> 
            )}
            {location.pathname.includes("watched") && (
                <>  
                    <button className='movie-button-1' onClick={ (e) => moveToWatchlist(e, movie)}>
                        Rewatch
                    </button>
                    <button className='movie-button-2' onClick={ (e) => removeMovie(e, "watched", movie.id)}>
                        Remove
                    </button>
                </> 
            )}
        </>
    )
}
