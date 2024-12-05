import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="layout">
      <header className="navbar">
        <h1 className="logo">Dashboard</h1>
        <div className="menu-icon" onClick={toggleMenu}>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </div>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/">Dashboard</Link>
          <Link to="/partners">Partners</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/assignments">Assignments</Link>
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
