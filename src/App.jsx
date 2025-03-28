import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import Search from './pages/Search';
import Watched from './pages/Watched';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Search />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register/>} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>            
              {/*  User Routes with URL Parameters */}
              <Route path="watchlist/:userEmail"  element={<Watchlist/> }/>
              <Route path="watched/:userEmail" element={<Watched/>} />
            </Route>            
          </Route>          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
