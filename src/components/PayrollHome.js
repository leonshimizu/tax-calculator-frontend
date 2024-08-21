// src/components/PayrollHome.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './PayrollHome.css';

const PayrollHome = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleCompanySelect = (companyId) => {
    navigate(`/companies/${companyId}/employees`);
  };

  return (
    <div className="payroll-home-container">
      <h1>Select a Company</h1>
      <div className="company-list">
        {companies.map((company) => (
          <div key={company.id} className="company-card" onClick={() => handleCompanySelect(company.id)}>
            <h2>{company.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayrollHome;
