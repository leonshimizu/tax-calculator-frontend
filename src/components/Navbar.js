// src/components/Navbar.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const { companyId } = useParams(); // Get the companyId from the URL params

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">PayrollApp</Link>
      </div>
      <div className="navbar-menu">
        <Link to={`/companies/${companyId}/employees`} className="navbar-link" >Employees</Link>
        <Link to={`/companies/${companyId}/batch-payroll-records-display`} className="navbar-link" >Batch Payroll Records</Link>
        <Link to={`/companies/${companyId}/employees/upload`} className="navbar-link" >Upload Employees</Link>
        <Link to={`/companies/${companyId}/payroll_records/upload`} className="navbar-link" >Upload Payroll Records</Link> {/* New button to navigate to PayrollFileUpload */}
        <Link to={`/companies/${companyId}/custom_columns`} className="navbar-link" >Manage Custom Columns</Link>
      </div>
    </nav>
  );
}

export default Navbar;
