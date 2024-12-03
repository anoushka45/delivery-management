import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="layout">
    <header className="navbar">
      <h1 className="logo">Delivery Dashboard</h1>
      <nav className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/partners">Partners</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/assignments">Assignments</Link>
      </nav>
    </header>
    <main className="content">{children}</main>
  </div>
);

export default Layout;
