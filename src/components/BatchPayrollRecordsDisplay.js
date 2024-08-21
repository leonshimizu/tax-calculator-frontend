// src/components/BatchPayrollRecordsDisplay.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './BatchPayrollRecordsDisplay.css';

function BatchPayrollRecordsDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [records, setRecords] = useState(location.state?.records || []);
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (searchDate) {
      setLoading(true);
      try {
        const response = await axios.get(`/payroll_records?date=${searchDate}`);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (searchDate) {
      handleSearch();
    }
  }, [searchDate]);

  return (
    <div className="container">
      <h1>Batch Payroll Records</h1>
      
      <div className="search-container">
        <label htmlFor="searchDate">Search by Date:</label>
        <input
          type="date"
          id="searchDate"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button onClick={handleSearch} className="button-search">
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : records.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Filing Status</th>
              <th>Position</th>
              <th>Pay Rate</th>
              <th>Retirement Rate</th>
              <th>Date</th>
              <th>Hours Worked</th>
              <th>Overtime Hours</th>
              <th>Reported Tips</th>
              <th>Loan Payment</th>
              <th>Insurance Payment</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>
              <th>Withholding Tax</th>
              <th>Social Security Tax</th>
              <th>Medicare Tax</th>
              <th>Retirement Payment</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const employee = record.employee || {};
              return (
                <tr key={index}>
                  <td>{employee.name || 'Unknown Employee'}</td>
                  <td>{employee.filing_status || 'N/A'}</td>
                  <td>{employee.position || 'N/A'}</td>
                  <td>{parseFloat(employee.pay_rate).toFixed(2) || 'N/A'}</td>
                  <td>{employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</td>
                  <td>{record.date || 'N/A'}</td>
                  <td>{parseFloat(record.hours_worked).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.overtime_hours_worked).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.reported_tips).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.loan_payment).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.insurance_payment).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.gross_pay).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.net_pay).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.withholding_tax).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.social_security_tax).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.medicare_tax).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.retirement_payment).toFixed(2) || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No records available for the selected date.</p>
      )}

      <button className="button-back" onClick={() => navigate(`/employees`)}>Back</button>
    </div>
  );
}

export default BatchPayrollRecordsDisplay;
