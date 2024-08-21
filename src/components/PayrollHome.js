// src/components/PayrollHome.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './PayrollHome.css';

const PayrollHome = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState('');
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

  const handleCreateCompany = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/companies', { name: newCompanyName });
      setCompanies([...companies, response.data]); // Add the new company to the list
      setNewCompanyName(''); // Clear the input field
    } catch (error) {
      console.error('Error creating company:', error);
    }
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
      <br />
      <form onSubmit={handleCreateCompany} className="create-company-form">
        <input
          type="text"
          placeholder="Enter new company name"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          required
          className="create-company-input"
        />
        <button type="submit" className="create-company-button">Create Company</button>
      </form>
    </div>
  );
};

export default PayrollHome;
