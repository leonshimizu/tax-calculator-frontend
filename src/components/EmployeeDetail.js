import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [payrollRecords, setPayrollRecords] = useState([]);

  useEffect(() => {
    fetchEmployee();
    fetchPayrollRecords();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/employees/${id}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const fetchPayrollRecords = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/employees/${id}/payroll_records`);
      setPayrollRecords(response.data);
    } catch (error) {
      console.error('Error fetching payroll records:', error);
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="employee-detail">
      <button className="button-back" onClick={() => navigate(`/employees`)}>Back</button>
      <h1>{employee.name}'s Details</h1>
      <p>Position: {employee.position}</p>
      <p>Pay Rate: ${Number(employee.pay_rate).toFixed(2)}</p>
      <p>Retirement Rate: {employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</p>
      <p>Filing Status: {employee.filing_status}</p>

      <h2>Payroll Records</h2>
      <button className="button button-create" onClick={() => navigate(`/employees/${employee.id}/payroll_records/new`)}>
        Create New Payroll Record
      </button>
      <table className="details-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Hours Worked</th>
            <th>Gross Pay</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrollRecords.map(record => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.hours_worked}</td>
              <td>${Number(record.gross_pay).toFixed(2)}</td>
              <td>
                <button className="button-payroll" onClick={() => navigate(`/employees/${employee.id}/payroll_records/${record.id}`)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetail;
