// src/components/CreatePayrollRecord.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreatePayrollRecord.css';
import axios from '../api/axios';

const CreatePayrollRecord = () => {
  const { employeeId } = useParams(); // Assuming you're passing employeeId in the route
  const [formData, setFormData] = useState({
    hours_worked: '',
    overtime_hours_worked: '',
    reported_tips: '',
    loan_payment: '',
    insurance_payment: '',
    date: ''
  });
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/employees/${employeeId}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`/employees/${employeeId}/payroll_records`, formData);
      navigate(`/employees/${employeeId}`); // Redirect to employee details or another relevant page
    } catch (error) {
      console.error('Error creating payroll record:', error);
    }
  };

  return (
    <div className="container">
      <button onClick={() => navigate(`/employees/${employeeId}`)} className="button-back">
        Back to Employee Details
      </button>
      <h1 className="form-header">Create Payroll Record for {employee?.first_name} {employee?.last_name}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Hours Worked</label>
          <input
            type="number"
            name="hours_worked"
            value={formData.hours_worked}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Overtime Hours Worked</label>
          <input
            type="number"
            name="overtime_hours_worked"
            value={formData.overtime_hours_worked}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Reported Tips</label>
          <input
            type="number"
            name="reported_tips"
            value={formData.reported_tips}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Loan Payment</label>
          <input
            type="number"
            name="loan_payment"
            value={formData.loan_payment}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Insurance Payment</label>
          <input
            type="number"
            name="insurance_payment"
            value={formData.insurance_payment}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="button">Create Record</button>
      </form>
    </div>
  );
};

export default CreatePayrollRecord;
