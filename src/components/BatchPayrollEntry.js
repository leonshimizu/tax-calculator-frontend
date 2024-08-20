import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './BatchPayrollEntry.css'; // Assuming you have a CSS file for styling

function BatchPayrollEntry() {
  const [employees, setEmployees] = useState([]);
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
        insurance_payment: '',
        date: ''  // Placeholder for date input
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
    for (const emp of employees) {
      const payload = {
        hours_worked: emp.hours_worked,
        overtime_hours_worked: emp.overtime_hours_worked,
        reported_tips: emp.reported_tips,
        loan_payment: emp.loan_payment,
        insurance_payment: emp.insurance_payment,
        date: emp.date  // Using the input date from the form
      };
      await axios.post(`/employees/${emp.id}/payroll_records`, payload);
    }
    navigate('/'); // Redirect or show a success message
  };

  return (
    <div className="container">
      <h1>Batch Payroll Entry</h1>
      <form onSubmit={handleSubmit}>
        <table className="details-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Hours Worked</th>
              <th>Overtime Hours</th>
              <th>Reported Tips</th>
              <th>Loan Payment</th>
              <th>Insurance Payment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td><input type="number" value={emp.hours_worked} onChange={(e) => handleChange(index, 'hours_worked', e.target.value)} /></td>
                <td><input type="number" value={emp.overtime_hours_worked} onChange={(e) => handleChange(index, 'overtime_hours_worked', e.target.value)} /></td>
                <td><input type="number" value={emp.reported_tips} onChange={(e) => handleChange(index, 'reported_tips', e.target.value)} /></td>
                <td><input type="number" value={emp.loan_payment} onChange={(e) => handleChange(index, 'loan_payment', e.target.value)} /></td>
                <td><input type="number" value={emp.insurance_payment} onChange={(e) => handleChange(index, 'insurance_payment', e.target.value)} /></td>
                <td><input type="date" value={emp.date} onChange={(e) => handleChange(index, 'date', e.target.value)} /></td>
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
