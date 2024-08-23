import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PayrollApp
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/companies" className="navbar-link">
              Companies
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/employees" className="navbar-link">
              Employees
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/payroll" className="navbar-link">
              Payroll
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/reports" className="navbar-link">
              Reports
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
