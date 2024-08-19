import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EmployeeDetail = () => {
  const { id } = useParams();
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
    <div>
      <h1>{employee.name}'s Details</h1>
      <p>Position: {employee.position}</p>
      <p>Pay Rate: ${Number(employee.pay_rate).toFixed(2)}</p>
      <p>Filing Status: {employee.filing_status}</p>

      <h2>Payroll Records</h2>
      <ul>
        {payrollRecords.map(record => (
          <li key={record.id}>
            Date: {record.date}, Hours Worked: {record.hours_worked}, Gross Pay: ${Number(record.gross_pay).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeDetail;
