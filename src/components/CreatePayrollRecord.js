import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreatePayrollRecord.css';
import axios from '../api/axios';

const CreatePayrollRecord = () => {
  const { companyId, employeeId } = useParams();
  const [formData, setFormData] = useState({
    hours_worked: '',
    overtime_hours_worked: '',
    reported_tips: '',
    loan_payment: '',
    insurance_payment: '',
    date: '',
    gross_pay: '',
    bonus: '',
    retirement_payment: '',
    roth_retirement_payment: '',
  });
  const [customColumns, setCustomColumns] = useState([]);
  const [customData, setCustomData] = useState({});
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
    fetchCustomColumns();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/employees/${employeeId}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const fetchCustomColumns = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/custom_columns`);
      setCustomColumns(response.data);
      // Initialize custom data state
      const initialCustomData = response.data.reduce((acc, column) => {
        acc[column.name] = ''; // Set default value as empty string or any default based on column data type
        return acc;
      }, {});
      setCustomData(initialCustomData);
    } catch (error) {
      console.error('Error fetching custom columns:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomInputChange = (event, columnName) => {
    const { value } = event.target;
    setCustomData(prev => ({ ...prev, [columnName]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Merge form data with custom columns data
    const completeFormData = {
      ...formData,
      custom_columns_data: customData,  // Adding custom columns data to be sent as a nested object
    };

    try {
      await axios.post(`/companies/${companyId}/employees/${employeeId}/payroll_records`, completeFormData);
      console.log(completeFormData);
      navigate(`/companies/${companyId}/employees/${employeeId}`);
    } catch (error) {
      console.error('Error creating payroll record:', error);
    }
  };

  return (
    <div className="create-payroll-record">
      <button onClick={() => navigate(`/companies/${companyId}/employees/${employeeId}`)} className="button-back">
        Back to Employee Details
      </button>
      <h1>Create Payroll Record for {employee?.first_name} {employee?.last_name}</h1>
      <form onSubmit={handleSubmit} className="payroll-form">
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
        {employee?.payroll_type === 'salary' && (
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
        <div className="form-group">
          <label>Retirement Payment</label>
          <input
            type="number"
            name="retirement_payment"
            value={formData.retirement_payment}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Roth Retirement Payment</label>
          <input
            type="number"
            name="roth_retirement_payment"
            value={formData.roth_retirement_payment}
            onChange={handleInputChange}
          />
        </div>
        {/* Custom Columns Section */}
        {customColumns.map((column) => (
          <div className="form-group" key={column.id}>
            <label>{column.name}</label>
            {column.data_type === 'decimal' && (
              <input
                type="number"
                name={column.name}
                value={customData[column.name] || ''}
                onChange={(e) => handleCustomInputChange(e, column.name)}
              />
            )}
            {column.data_type === 'string' && (
              <input
                type="text"
                name={column.name}
                value={customData[column.name] || ''}
                onChange={(e) => handleCustomInputChange(e, column.name)}
              />
            )}
            {column.data_type === 'boolean' && (
              <select
                name={column.name}
                value={customData[column.name] || 'false'}
                onChange={(e) => handleCustomInputChange(e, column.name)}
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            )}
          </div>
        ))}
        <button type="submit" className="button-submit">Create Record</button>
      </form>
    </div>
  );
};

export default CreatePayrollRecord;
