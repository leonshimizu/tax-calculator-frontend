// src/components/BatchPayrollEntry.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import './BatchPayrollEntry.css';

function BatchPayrollEntry() {
  const { companyId } = useParams();
  const [hourlyEmployees, setHourlyEmployees] = useState([]);
  const [salaryEmployees, setSalaryEmployees] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, [companyId]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/employees`);
      const hourly = response.data.filter(emp => emp.payroll_type === 'hourly').map(emp => ({
        ...emp,
        hours_worked: '',
        overtime_hours_worked: '',
        reported_tips: '',
        loan_payment: '',
        insurance_payment: '',
      }));
      const salary = response.data.filter(emp => emp.payroll_type === 'salary').map(emp => ({
        ...emp,
        gross_pay: '',
        bonus: '',
        loan_payment: '',
        insurance_payment: '',
      }));
      setHourlyEmployees(hourly);
      setSalaryEmployees(salary);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleHourlyChange = (index, field, value) => {
    const updatedEmployees = [...hourlyEmployees];
    updatedEmployees[index][field] = value;
    setHourlyEmployees(updatedEmployees);
  };

  const handleSalaryChange = (index, field, value) => {
    const updatedEmployees = [...salaryEmployees];
    updatedEmployees[index][field] = value;
    setSalaryEmployees(updatedEmployees);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const hourlyPayload = hourlyEmployees.map(emp => ({
        employee_id: emp.id,
        date: date,
        hours_worked: emp.hours_worked,
        overtime_hours_worked: emp.overtime_hours_worked,
        reported_tips: emp.reported_tips,
        loan_payment: emp.loan_payment,
        insurance_payment: emp.insurance_payment,
      }));

      const salaryPayload = salaryEmployees.map(emp => ({
        employee_id: emp.id,
        date: date,
        gross_pay: emp.gross_pay,
        bonus: emp.bonus,
        loan_payment: emp.loan_payment,
        insurance_payment: emp.insurance_payment,
      }));

      const response = await axios.post(`/companies/${companyId}/employees/batch/payroll_records`, {
        payroll_records: [...hourlyPayload, ...salaryPayload],
      });

      navigate(`/companies/${companyId}/batch-payroll-records-display`, { state: { records: response.data } });
    } catch (error) {
      console.error('Error creating batch payroll records:', error);
    }
  };

  return (
    <div className="container">
      <button className="button-back" onClick={() => navigate(`/companies/${companyId}/employees`)}>Back</button>
      <h1>Batch Payroll Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Date of Payroll:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
        </div>

        <h2>Hourly Employees</h2>
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
            {hourlyEmployees.map((emp, index) => (
              <tr key={emp.id} className="table-row">
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>
                  <input type="number" value={emp.hours_worked} onChange={(e) => handleHourlyChange(index, 'hours_worked', e.target.value)} className="input-field" />
                </td>
                <td>
                  <input type="number" value={emp.overtime_hours_worked} onChange={(e) => handleHourlyChange(index, 'overtime_hours_worked', e.target.value)} className="input-field" />
                </td>
                <td>
                  <input type="number" value={emp.reported_tips} onChange={(e) => handleHourlyChange(index, 'reported_tips', e.target.value)} className="input-field" />
                </td>
                <td>
                  <input type="number" value={emp.loan_payment} onChange={(e) => handleHourlyChange(index, 'loan_payment', e.target.value)} className="input-field" />
                </td>
                <td>
                  <input type="number" value={emp.insurance_payment} onChange={(e) => handleHourlyChange(index, 'insurance_payment', e.target.value)} className="input-field" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Salary Employees</h2>
        <table>
          <thead>
            <tr className="table-header">
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gross Pay</th>
              <th>Bonus</th>
              <th>Loan Payment</th>
              <th>Insurance Payment</th>
            </tr>
          </thead>
          <tbody>
            {salaryEmployees.map((emp, index) => (
              <tr key={emp.id} className="table-row">
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>
                  <input type="number" value={emp.gross_pay} onChange={(e) => handleSalaryChange(index, 'gross_pay', e.target.value)} className="input-field" />
                </td>
                <td>
                  <input type="number" value={emp.bonus} onChange={(e) => handleSalaryChange(index, 'bonus', e.target.value)} className="input-field" />
                </td>
                <td>
                  <input type="number" value={emp.loan_payment} onChange={(e) => handleSalaryChange(index, 'loan_payment', e.target.value)} className="input-field" />
                </td>
                <td>
                  <input type="number" value={emp.insurance_payment} onChange={(e) => handleSalaryChange(index, 'insurance_payment', e.target.value)} className="input-field" />
                </td>
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
