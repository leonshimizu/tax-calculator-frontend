// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/employees">Home</Link></li>
        <li><Link to="/employees/new">Create Employee</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
