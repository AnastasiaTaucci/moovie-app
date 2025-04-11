import { useAuth } from '../context/AuthContext';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';// Layout Component
import { useState } from 'react';
import MusicPlayer from "../components/MusicPlayer";



export default function Layout() {
    const { currentUser, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();                     // get the current route
    const [menuOpen, setMenuOpen] = useState(false);    // state to toggle the nav menu when click on

    async function handleLogout() {
        try {
            await logout();
            navigate('/');                  // redirect to the (main) search page after Logout
        } catch (error) {
            console.error("Failed to log out", + error);
        }   
    }

    // check if we are on the Login page
    const isLoginPage = location.pathname === "/login";


    return (
        <>
            <video className="video-bg" autoPlay loop muted>
                <source src="/background-vid.mp4" type="video/mp4" />              
            </video>

            <header>
                {/* Logo and site name */}

                {/* logo */}
                <div className="movie-track-header-container">
                    <a href="/">
                        <img
                            src="/site-logo.png"
                            alt="Movie Track Logo"
                            className="movie-track-logo"
                        />
                    </a>

                    {/* site name */}
                    <h1>
                        <a href="/">Moovie Track</a>
                    </h1>
                </div>

                {/* Navigation */}
                <nav>
                    {/* this button is hidden, only display after breakpoint */}
                    <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>

                    {/* ul will add a class of "show-menu" when the menu is open, changing the display of <li> */}
                    <ul className={`nav-list ${menuOpen ? "show-menu" : ""}`}>
                        {isLoginPage ? ( // if on login page, show only search link to come back
                            <li><Link to="/" onClick={() => setMenuOpen(false)}>Search</Link></li>
                        ) : (
                            <>
                                {currentUser ? (
                                    <>
                                        <li className="user-display">
                                            Hello, <span>{currentUser.email.split("@")[0]}</span>
                                        </li>
                                        <li>
                                            <Link 
                                                to="/" 
                                                className={location.pathname === "/" ? "active" : ""}
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Search
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                to={`/watchlist/${currentUser.email}`} 
                                                className={location.pathname.startsWith(`/watchlist`) ? "active" : ""}
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Watchlist
                                            </Link>
                                        </li>           {/* create personalized path depending on user email */}
                                        <li>
                                            <Link 
                                                to={`/watched/${currentUser.email}`} 
                                                className={location.pathname.startsWith(`/watched`) ? "active" : ""}
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Watched
                                            </Link>
                                        </li>
                                        <li>
                                            <button 
                                                onClick={ () => {
                                                    handleLogout();
                                                    setMenuOpen(false)
                                                }} 
                                                aria-label="Logout from your account"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li><Link to="/login">Login</Link></li>              // the only navigation option users sees when not logged in
                                )}
                            </>
                        )}
                    </ul>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer role="contentinfo">
                <p>Built by two movie lovers, for movie lovers! &copy; 2025 Moovie Track.</p>
            </footer>   
            <MusicPlayer src="/bg-music.mp3" />        
        </>
    )
}