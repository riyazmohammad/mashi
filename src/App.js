import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import UploadImage from './components/UploadImage';
import Layout from './components/Layout';
import CustomerList from './components/CustomerList';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/upload/:partner" element={<UploadImage />} />
            <Route path="/customers" element={<CustomerList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;