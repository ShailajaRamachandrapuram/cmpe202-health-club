import React, { useState } from 'react';
import './App.css';
import 'react-calendar/dist/Calendar.css';
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {

  const [currentLocation, setCurrentLocation] = useState<number>(1);

  return (
    <BrowserRouter>
      <Navigation setCurrentLocation={setCurrentLocation}/>
      <Routes>
        <Route path="/" index element={<Homepage location={currentLocation} />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/admin" element={<Admin />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
