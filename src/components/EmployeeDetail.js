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
      <button className="button-back" onClick={() => navigate(-1)}>Back</button>
      <h1>{employee.name}'s Details</h1>
      <p>Position: {employee.position}</p>
      <p>Pay Rate: ${Number(employee.pay_rate).toFixed(2)}</p>
      <p>Retirement Rate: {employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</p>
      <p>Filing Status: {employee.filing_status}</p>

      <h2>Payroll Records</h2>
      <ul className="details-list">
        {payrollRecords.map(record => (
          <li key={record.id}>
            Date: {record.date}, Hours Worked: {record.hours_worked}, Gross Pay: ${Number(record.gross_pay).toFixed(2)}
            <button className="button-payroll" onClick={() => navigate(`/employees/${employee.id}/payroll_records/${record.id}`)}>
                View Payroll Record
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeDetail;
