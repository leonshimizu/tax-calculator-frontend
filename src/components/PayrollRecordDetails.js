import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PayrollRecordDetails.css';
import axios from '../api/axios';

const PayrollRecordDetails = () => {
  const { companyId, employeeId, recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [customColumns, setCustomColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayrollRecord();
    fetchEmployee();
    fetchCustomColumns();
  }, [companyId, employeeId, recordId]);

  const fetchPayrollRecord = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/employees/${employeeId}/payroll_records/${recordId}`);
      setRecord(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching payroll record details:', error);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error) {
      console.error('Error fetching custom columns:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!record || !employee) return <div>No payroll record or employee details found.</div>;

  return (
    <div className="payroll-record-details">
      <div className="button-group">
        <button onClick={() => navigate(`/companies/${companyId}/employees/${employeeId}`)}>Back to Payroll Records</button>
      </div>
      <h1>Payroll Record Details</h1>
      <h2>{employee.first_name} {employee.last_name}</h2>
      <p>Payroll Type: {employee.payroll_type}</p>
      <p>Department: {employee.department ? employee.department.name : 'N/A'}</p> {/* Access department name */}
      <p>Filing Status: {employee.filing_status}</p>

      <div className="table-wrapper">
        <table>
          <tbody>
            <tr>
              <th>Date:</th>
              <td>{record.payroll_record && record.payroll_record.date ? record.payroll_record.date : 'N/A'}</td>
            </tr>
            {employee.payroll_type === 'hourly' && (
              <>
                <tr>
                  <th>Hours Worked:</th>
                  <td>{record.payroll_record && record.payroll_record.hours_worked ? record.payroll_record.hours_worked : 'N/A'}</td>
                </tr>
                <tr>
                  <th>Overtime Hours:</th>
                  <td>{record.payroll_record && record.payroll_record.overtime_hours_worked ? record.payroll_record.overtime_hours_worked : 'N/A'}</td>
                </tr>
                <tr>
                  <th>Reported Tips:</th>
                  <td>${parseFloat(record.payroll_record && record.payroll_record.reported_tips ? record.payroll_record.reported_tips : 0).toFixed(2)}</td>
                </tr>
              </>
            )}
            <tr>
              <th>Gross Pay:</th>
              <td>${parseFloat(record.gross_pay || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Bonus:</th>
              <td>${parseFloat(record.payroll_record && record.payroll_record.bonus ? record.payroll_record.bonus : 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Net Pay:</th>
              <td>${parseFloat(record.net_pay || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Loan Payment:</th>
              <td>${parseFloat(record.payroll_record && record.payroll_record.loan_payment ? record.payroll_record.loan_payment : 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Insurance Payment:</th>
              <td>${parseFloat(record.payroll_record && record.payroll_record.insurance_payment ? record.payroll_record.insurance_payment : 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Withholding Tax:</th>
              <td>${parseFloat(record.withholding_tax || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Social Security Tax:</th>
              <td>${parseFloat(record.social_security_tax || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Medicare Tax:</th>
              <td>${parseFloat(record.medicare_tax || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Retirement Payment:</th>
              <td>${parseFloat(record.retirement_payment || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Roth Retirement Payment:</th>
              <td>${parseFloat(record.roth_retirement_payment || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Total Deductions:</th>
              <td>${parseFloat(record.total_deductions || 0).toFixed(2)}</td>
            </tr>

            {/* Display custom columns */}
            {customColumns.map((column) => (
              <tr key={column.id}>
                <th>{column.name}:</th>
                <td>
                  {column.data_type === 'boolean' ? (
                    record.custom_columns && record.custom_columns[column.name] ? 'Yes' : 'No'
                  ) : column.data_type === 'decimal' ? (
                    `$${parseFloat(record.custom_columns ? record.custom_columns[column.name] : 0).toFixed(2)}`
                  ) : (
                    record.custom_columns ? record.custom_columns[column.name] : 'N/A'
                  )}
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollRecordDetails;
