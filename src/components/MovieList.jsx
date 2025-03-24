import React, { useEffect } from "react";
import MovieActionButton from "./MovieActionButton";
import {useLocation} from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import MovieNote from "./MovieNote";


export default function MovieList ({ movies, onMovieSelect, setMoviesFirebase}) {
    const location = useLocation();
    const { currentUser} = useAuth();

    useEffect(() => {

    }, [movies]) 

    return (
        <ul className="movie-list">
            {movies.map((movie) => (
                <li
                    key={movie.id}
                    className="movie-item"
                    onClick={ () => onMovieSelect(movie)}
                >
                    {/* If movie.image exists, it means the movie was displayed from Firestore → Use movie.image.
                        If there is no poster in API, show a placeholder image */}
                    <img className="movie-poster"
                        src={
                            movie.image ? 
                            movie.image : movie.poster_path ? 
                            `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://i.postimg.cc/W3DSz9Fq/no-poster-available.png' // fallback placeholder
                        } 
                        alt={'Movie poster of ' + movie.title} 
                    />
                    
                    <p className="movie-title">{movie.title}</p>

                    <p className="movie-year">{movie.release_date && movie.release_date.substring(0, 4)}</p>

                    {/* Show "Rewatching" label and rating if the movie is being rewatched and rated */}
                    { movie.rewatching && (
                        <>
                            <span className="rewatching-label">Rewatching</span>
                            {movie.rating && (<div className="movie-rating">{movie.rating} ★</div>)}
                            {movie.note && (<p className="movie-note">My note: {movie.note}</p>)}
                        </>
                    )}

                    <MovieActionButton  movie={movie} movies={movies} setMoviesFirebase={setMoviesFirebase} />              {/*changes depending on where the movie list is displayed*/} 
                    
                    {/* User can put rating to movies in his "watched" list */}
                    {location.pathname.includes("watched") && (
                        <>
                            {/* Star Rating Component */}
                            <StarRating movie={movie} userId={currentUser.uid} />
                            {/* Note option */}
                            <MovieNote movie={movie} userId={currentUser.uid} />
                        </>
                    )}
                </li>
            ))}
        </ul>
    )
}

// Map out the movie to <li> elements, and display the movie title. (and other stuffs like poster, etc)