// src/components/BatchPayrollEntry.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './BatchPayrollEntry.css'; // Make sure this import path is correct

function BatchPayrollEntry() {
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/employees');
      const employeesWithPayroll = response.data.map(emp => ({
        ...emp,
        hours_worked: '',
        overtime_hours_worked: '',
        reported_tips: '',
        loan_payment: '',
        insurance_payment: ''
      }));
      setEmployees(employeesWithPayroll);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;
    setEmployees(updatedEmployees);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = employees.map(emp => ({
        employee_id: emp.id,
        date: date,
        hours_worked: emp.hours_worked,
        overtime_hours_worked: emp.overtime_hours_worked,
        reported_tips: emp.reported_tips,
        loan_payment: emp.loan_payment,
        insurance_payment: emp.insurance_payment
      }));
  
      const response = await axios.post(`/employees/batch/payroll_records`, { payroll_records: payload });
  
      navigate('/batch-payroll-records-display', { state: { records: response.data } });
    } catch (error) {
      console.error('Error creating batch payroll records:', error);
    }
  };

  return (
    <div className="container">
      <button className="button-back" onClick={() => navigate(`/employees`)}>Back</button>
      <h1>Batch Payroll Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Date of Payroll:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field"/>
        </div>
        <table>
          <thead>
            <tr className="table-header">
              <th>First Name</th>
              <th>Last Name</th>
              <th>Hours Worked</th>
              <th>Overtime Hours</th>
              <th>Reported Tips</th>
              <th>Loan Payment</th>
              <th>Insurance Payment</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id} className="table-row">
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td><input type="number" value={emp.hours_worked} onChange={(e) => handleChange(index, 'hours_worked', e.target.value)} className="input-field" /></td>
                <td><input type="number" value={emp.overtime_hours_worked} onChange={(e) => handleChange(index, 'overtime_hours_worked', e.target.value)} className="input-field" /></td>
                <td><input type="number" value={emp.reported_tips} onChange={(e) => handleChange(index, 'reported_tips', e.target.value)} className="input-field" /></td>
                <td><input type="number" value={emp.loan_payment} onChange={(e) => handleChange(index, 'loan_payment', e.target.value)} className="input-field" /></td>
                <td><input type="number" value={emp.insurance_payment} onChange={(e) => handleChange(index, 'insurance_payment', e.target.value)} className="input-field" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="button">Generate Payroll Records</button>
      </form>
    </div>
  );
}

export default BatchPayrollEntry;
