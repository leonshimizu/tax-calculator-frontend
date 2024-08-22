// src/components/EmployeeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDetail.css';
import axios from '../api/axios';

const EmployeeDetail = () => {
  const { companyId, employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [ytdTotals, setYtdTotals] = useState({
    hours_worked: 0,
    overtime_hours_worked: 0,
    reported_tips: 0,
    loan_payment: 0,
    insurance_payment: 0,
    gross_pay: 0,
    net_pay: 0,
    withholding_tax: 0,
    social_security_tax: 0,
    medicare_tax: 0,
    retirement_payment: 0,
  });

  useEffect(() => {
    fetchEmployee();
    fetchPayrollRecords();
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
      setPayrollRecords(response.data);
      calculateYtdTotals(response.data);
    } catch (error) {
      console.error('Error fetching payroll records:', error);
    }
  };

  const calculateYtdTotals = (records) => {
    const totals = records.reduce((acc, record) => {
      return {
        hours_worked: acc.hours_worked + parseFloat(record.hours_worked || 0),
        overtime_hours_worked: acc.overtime_hours_worked + parseFloat(record.overtime_hours_worked || 0),
        reported_tips: acc.reported_tips + parseFloat(record.reported_tips || 0),
        loan_payment: acc.loan_payment + parseFloat(record.loan_payment || 0),
        insurance_payment: acc.insurance_payment + parseFloat(record.insurance_payment || 0),
        gross_pay: acc.gross_pay + parseFloat(record.gross_pay || 0),
        net_pay: acc.net_pay + parseFloat(record.net_pay || 0),
        withholding_tax: acc.withholding_tax + parseFloat(record.withholding_tax || 0),
        social_security_tax: acc.social_security_tax + parseFloat(record.social_security_tax || 0),
        medicare_tax: acc.medicare_tax + parseFloat(record.medicare_tax || 0),
        retirement_payment: acc.retirement_payment + parseFloat(record.retirement_payment || 0),
      };
    }, {
      hours_worked: 0,
      overtime_hours_worked: 0,
      reported_tips: 0,
      loan_payment: 0,
      insurance_payment: 0,
      gross_pay: 0,
      net_pay: 0,
      withholding_tax: 0,
      social_security_tax: 0,
      medicare_tax: 0,
      retirement_payment: 0,
    });

    setYtdTotals(totals);
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="employee-detail">
      <button className="button-back" onClick={() => navigate(`/companies/${companyId}/employees`)}>Back</button>
      <h1>{employee.first_name} {employee.last_name}'s Details</h1>
      <p>Payroll Type: {employee.payroll_type}</p>
      <p>Department: {employee.department}</p>

      {employee.payroll_type === 'hourly' ? (
        <>
          <p>Pay Rate: ${Number(employee.pay_rate).toFixed(2)}</p>
        </>
      ) : null}

      <p>Retirement Rate: {employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</p>
      <p>Filing Status: {employee.filing_status}</p>

      <h2>Payroll Records</h2>
      <button className="button button-create" onClick={() => navigate(`/companies/${companyId}/employees/${employeeId}/payroll_records/new`)}>
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

      <h2>Year-to-Date Totals</h2>
      <table className="ytd-totals-table">
        <thead>
          <tr>
            {employee.payroll_type === 'hourly' && <th>Hours Worked</th>}
            {employee.payroll_type === 'hourly' && <th>Overtime Hours</th>}
            <th>Reported Tips</th>
            <th>Loan Payment</th>
            <th>Insurance Payment</th>
            <th>Gross Pay</th>
            <th>Net Pay</th>
            <th>Withholding Tax</th>
            <th>Social Security Tax</th>
            <th>Medicare Tax</th>
            <th>Retirement Payment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {employee.payroll_type === 'hourly' && <td>{ytdTotals.hours_worked.toFixed(2)}</td>}
            {employee.payroll_type === 'hourly' && <td>{ytdTotals.overtime_hours_worked.toFixed(2)}</td>}
            <td>${ytdTotals.reported_tips.toFixed(2)}</td>
            <td>${ytdTotals.loan_payment.toFixed(2)}</td>
            <td>${ytdTotals.insurance_payment.toFixed(2)}</td>
            <td>${ytdTotals.gross_pay.toFixed(2)}</td>
            <td>${ytdTotals.net_pay.toFixed(2)}</td>
            <td>${ytdTotals.withholding_tax.toFixed(2)}</td>
            <td>${ytdTotals.social_security_tax.toFixed(2)}</td>
            <td>${ytdTotals.medicare_tax.toFixed(2)}</td>
            <td>${ytdTotals.retirement_payment.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetail;
