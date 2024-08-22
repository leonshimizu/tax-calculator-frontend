import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreatePayrollRecord.css';
import axios from '../api/axios';

const CreatePayrollRecord = () => {
  const { companyId, employeeId } = useParams(); // Get companyId and employeeId from the URL params
  const [formData, setFormData] = useState({
    hours_worked: '',
    overtime_hours_worked: '',
    reported_tips: '',
    loan_payment: '',
    insurance_payment: '',
    date: '',
    gross_pay: '', // Add gross_pay for salaried employees
    bonus: '', // Add bonus for salaried employees
  });
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/employees/${employeeId}`);
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
      await axios.post(`/companies/${companyId}/employees/${employeeId}/payroll_records`, formData);
      navigate(`/companies/${companyId}/employees/${employeeId}`); // Redirect to employee details page
    } catch (error) {
      console.error('Error creating payroll record:', error);
    }
  };

  return (
    <div className="container">
      <button onClick={() => navigate(`/companies/${companyId}/employees/${employeeId}`)} className="button-back">
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
        {employee?.payroll_type === 'hourly' && (
          <>
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
          </>
        )}
        {employee?.payroll_type === 'salaried' && (
          <>
            <div className="form-group">
              <label>Gross Pay</label>
              <input
                type="number"
                name="gross_pay"
                value={formData.gross_pay}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Bonus</label>
              <input
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
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
