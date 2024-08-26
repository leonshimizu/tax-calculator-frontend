import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [companyId, setCompanyId] = useState(null);
  const [company, setCompany] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to handle menu toggle

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const id = pathParts.includes('companies') ? pathParts[pathParts.indexOf('companies') + 1] : null;
    setCompanyId(id);

    if (id) {
      fetchCompanyData(id);
    }
  }, [location]);

  const fetchCompanyData = async (id) => {
    try {
      const response = await axios.get(`/companies/${id}`);
      setCompany(response.data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Employees button on the left */}
        {companyId && (
          <Link to={`/companies/${companyId}/employees`} className={`navbar-link ${location.pathname.includes('/employees') ? 'active' : ''}`}>
            Employees
          </Link>
        )}

        {/* Centered company name */}
        <div className="navbar-center">
          {company ? (
            <Link to="/" className="navbar-logo">
              {company.name}
            </Link>
          ) : (
            <Link to="/" className="navbar-logo">PayrollApp</Link>
          )}
        </div>

        {/* Menu toggle button for mobile */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>

        {/* Options dropdown on the right */}
        <div className={`navbar-options ${menuOpen ? 'active' : ''}`}>
          {companyId ? (
            <div className="dropdown">
              <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                Options
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to={`/companies/${companyId}/employees/batch`} className="dropdown-item">
                    Batch Payroll Entry
                  </Link>
                  <Link to={`/companies/${companyId}/batch-payroll-records-display`} className="dropdown-item">
                    View Payroll Records by Date
                  </Link>
                  <Link to={`/companies/${companyId}/employees/upload`} className="dropdown-item">
                    Upload Employees
                  </Link>
                  <Link to={`/companies/${companyId}/payroll_records/upload`} className="dropdown-item">
                    Upload Payroll Records
                  </Link>
                  <Link to={`/companies/${companyId}/custom_columns`} className="dropdown-item">
                    Manage Custom Columns
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="navbar-message">Please select a company to access these options</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
