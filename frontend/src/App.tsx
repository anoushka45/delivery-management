import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Partners from './pages/Partners';
import Orders from './pages/Orders';
import Assignments from './pages/Assignments';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/assignments" element={<Assignments />} />
    </Routes>
  </Router>
);

export default App;
