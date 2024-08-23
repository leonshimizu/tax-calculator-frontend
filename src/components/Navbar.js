// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ companyName }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {companyName || 'PayrollApp'}
        </Link>
        <div className="navbar-menu">
          <Link to="/companies" className="navbar-link">Companies</Link>
          <Link to="/employees" className="navbar-link">Employees</Link>
          <Link to="/payroll" className="navbar-link">Payroll</Link>
          <Link to="/reports" className="navbar-link">Reports</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
