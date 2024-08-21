// src/components/BatchPayrollRecordsDisplay.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function BatchPayrollRecordsDisplay() {
  const [records, setRecords] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`/payroll_records?date=${searchDate}`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching payroll records:', error);
    }
  };

  const handleDateChange = (event) => {
    setSearchDate(event.target.value);
  };

  const handleSearch = () => {
    fetchRecords();
  };

  return (
    <div>
      <input
        type="date"
        value={searchDate}
        onChange={handleDateChange}
      />
      <button onClick={handleSearch}>Search</button>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Hours Worked</th>
            <th>Overtime Hours</th>
            <th>Reported Tips</th>
            <th>Gross Pay</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.employee.name}</td>
              <td>{record.date}</td>
              <td>{record.hours_worked}</td>
              <td>{record.overtime_hours}</td>
              <td>{record.reported_tips}</td>
              <td>{record.gross_pay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BatchPayrollRecordsDisplay;
