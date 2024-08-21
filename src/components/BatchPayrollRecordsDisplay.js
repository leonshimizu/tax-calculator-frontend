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
              <th>Date</th>
              <th>Hours Worked</th>
              <th>Overtime Hours</th>
              <th>Reported Tips</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const employeeName = record?.employee?.name || 'Unknown Employee';
              return (
                <tr key={index}>
                  <td>{employeeName}</td>
                  <td>{record.date || 'N/A'}</td>
                  <td>{record.hours_worked || 'N/A'}</td>
                  <td>{record.overtime_hours_worked || 'N/A'}</td>
                  <td>{record.reported_tips || 'N/A'}</td>
                  <td>{record.gross_pay || 'N/A'}</td>
                  <td>{record.net_pay || 'N/A'}</td>
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
