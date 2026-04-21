import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddCar from './pages/AddCar';
import CarDetail from './pages/CarDetail';
import MyListings from './pages/MyListings';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-car" element={<AddCar />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/my-listings" element={<MyListings />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
