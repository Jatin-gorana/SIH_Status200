import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import Mentor from './pages/Mentor';
import Mentee from './pages/Mentee';
import LoginSignUp from './pages/LoginSignUp';
import Book from './pages/Book';
import Profile from './pages/Profile';
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import Help from './pages/Help'
import { auth } from './firebase/firebase';
import { Navigate } from 'react-router-dom';
import Footer from './pages/Footer';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mentee" element={<Mentor />} />
          <Route path="/mentor" element={<Mentee />} />
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/help" element={<Help />} />
          
        </Routes>
        <Footer/>
      </div>
    </Router>
    
  );
}

export default App;