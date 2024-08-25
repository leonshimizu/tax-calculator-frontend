import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [companyId, setCompanyId] = useState(null);
  const [company, setCompany] = useState(null);

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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {company ? (
          <Link to={`/`} className="navbar-logo">
            {company.name}
          </Link>
        ) : (
          <Link to="/" className="navbar-logo">PayrollApp</Link>
        )}
      </div>
      <div className="navbar-menu">
        {companyId ? (
          <>
            <Link to={`/companies/${companyId}/employees`} className={`navbar-link ${location.pathname.includes('/employees') ? 'active' : ''}`}>
              Employees
            </Link>
            <Link to={`/companies/${companyId}/batch-payroll-records-display`} className={`navbar-link ${location.pathname.includes('/batch-payroll-records-display') ? 'active' : ''}`}>
              Batch Payroll Records
            </Link>
            <Link to={`/companies/${companyId}/employees/upload`} className={`navbar-link ${location.pathname.includes('/employees/upload') ? 'active' : ''}`}>
              Upload Employees
            </Link>
            <Link to={`/companies/${companyId}/payroll_records/upload`} className={`navbar-link ${location.pathname.includes('/payroll_records/upload') ? 'active' : ''}`}>
              Upload Payroll Records
            </Link>
            <Link to={`/companies/${companyId}/custom_columns`} className={`navbar-link ${location.pathname.includes('/custom_columns') ? 'active' : ''}`}>
              Manage Custom Columns
            </Link>
          </>
        ) : (
          <p>Please select a company to access these options</p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
