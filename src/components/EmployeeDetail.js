import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDetail.css';
import axios from '../api/axios';

const EmployeeDetail = () => {
  const { companyId, employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);  // State for storing departments
  const [payrollRecords, setPayrollRecords] = useState([]);

  useEffect(() => {
    fetchEmployee();
    fetchPayrollRecords();
    fetchDepartments();  // Fetch departments on component mount
  }, [companyId, employeeId]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/employees/${employeeId}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const fetchPayrollRecords = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/employees/${employeeId}/payroll_records`);
      const sortedRecords = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPayrollRecords(sortedRecords);
    } catch (error) {
      console.error('Error fetching payroll records:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/departments`);
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'N/A';
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="employee-detail">
      <button className="button-back" onClick={() => navigate(`/companies/${companyId}/employees`)}>Back</button>
      <h1>{employee.first_name} {employee.last_name}'s Details</h1>
      <p>Payroll Type: {employee.payroll_type}</p>
      <p>Department: {getDepartmentName(employee.department_id)}</p>  {/* Update to use department_id */}

      {employee.payroll_type === 'hourly' && (
        <p>Pay Rate: ${Number(employee.pay_rate).toFixed(2)}</p>
      )}

      <p>Retirement Rate: {employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</p>
      <p>Roth 401K Rate: {employee.roth_retirement_rate ? `${employee.roth_retirement_rate}%` : 'N/A'}</p>
      <p>Filing Status: {employee.filing_status}</p>

      <h2>Payroll Records</h2>
      <button className="button-create" onClick={() => navigate(`/companies/${companyId}/employees/${employeeId}/payroll_records/new`)}>
        Create New Payroll Record
      </button>
      <table className="details-table">
        <thead>
          <tr>
            <th>Date</th>
            {employee.payroll_type === 'hourly' && <th>Hours Worked</th>}
            <th>Gross Pay</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrollRecords.map(record => (
            <tr key={record.id}>
              <td>{record.date}</td>
              {employee.payroll_type === 'hourly' && <td>{record.hours_worked}</td>}
              <td>${Number(record.gross_pay).toFixed(2)}</td>
              <td>
                <button className="button-payroll" onClick={() => navigate(`/companies/${companyId}/employees/${employeeId}/payroll_records/${record.id}`)}>
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
