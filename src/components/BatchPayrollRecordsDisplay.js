import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { utils, writeFile } from 'xlsx';
import './BatchPayrollRecordsDisplay.css';

function BatchPayrollRecordsDisplay() {
  const { companyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [records, setRecords] = useState(location.state?.records || []);
  const [customColumns, setCustomColumns] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomColumns();
    fetchDepartments();
    if (location.state?.records) {
      setRecords(location.state.records);
    } else if (searchDate) {
      handleSearch();
    }
  }, [location.state, searchDate]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/departments`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCustomColumns = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/custom_columns`);
      setCustomColumns(response.data || []);
    } catch (error) {
      console.error('Error fetching custom columns:', error);
    }
  };

  const handleSearch = async () => {
    if (searchDate) {
      setLoading(true);
      try {
        const response = await axios.get(`/companies/${companyId}/payroll_records?date=${searchDate}`);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  };

  const downloadAsCSV = () => {
    const data = records.map((record) => {
      const employee = record.employee || {};
      const customColumnsData = record.custom_columns_data || {};
      const customColumnsFormatted = customColumns.reduce((acc, column) => {
        acc[column.name] = customColumnsData[column.name] || 'N/A';
        return acc;
      }, {});
      return {
        'First Name': employee.first_name || 'Unknown',
        'Last Name': employee.last_name || 'Unknown',
        'Filing Status': employee.filing_status || 'N/A',
        'Department': getDepartmentName(employee.department_id),
        'Pay Rate': employee.pay_rate || 'N/A',
        'Retirement Rate': employee.retirement_rate || 'N/A',
        'Roth 401K Rate': employee.roth_retirement_rate || 'N/A',
        'Date': record.date || 'N/A',
        'Hours Worked': record.hours_worked || 'N/A',
        'Overtime Hours': record.overtime_hours_worked || 'N/A',
        'Reported Tips': record.reported_tips || 'N/A',
        'Loan Payment': record.loan_payment || 'N/A',
        'Insurance Payment': record.insurance_payment || 'N/A',
        'Gross Pay': record.gross_pay || 'N/A',
        'Net Pay': record.net_pay || 'N/A',
        'Withholding Tax': record.withholding_tax || 'N/A',
        'Social Security Tax': record.social_security_tax || 'N/A',
        'Medicare Tax': record.medicare_tax || 'N/A',
        'Retirement Payment': record.retirement_payment || 'N/A',
        'Roth 401K Payment': record.roth_retirement_payment || 'N/A',
        'Total Deductions': record.total_deductions || 'N/A',
        'Total Additions': record.total_additions || 'N/A',
        'Bonus': record.bonus || 'N/A',
        ...customColumnsFormatted,
      };
    });

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Payroll Records');
    writeFile(workbook, 'Payroll_Records.xlsx');
  };

  const handleCreateChecks = () => {
    navigate(`/companies/${companyId}/create-checks`, { state: { records } });
  };

  return (
    <div className="batch-payroll-records-display">
      <h1>Batch Payroll Records</h1>

      <div className="search-container">
        <label htmlFor="searchDate">Search by Date:</label>
        <input
          type="date"
          id="searchDate"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button onClick={handleSearch} className="button-search">
          Search
        </button>
      </div>

      <div className="button-group">
        <button onClick={downloadAsCSV} className="button-download">
          Download as Excel
        </button>
        <button onClick={handleCreateChecks} className="button-create-checks">
          Create Checks
        </button>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <>
          {records.length > 0 ? (
            <div className="table-wrapper">
              <table className="record-table">
                <thead>
                  <tr>
                    <th>First Name</th><th>Last Name</th><th>Filing Status</th><th>Department</th><th>Pay Rate</th>
                    <th>Retirement Rate</th><th>Roth 401K Rate</th><th>Hours Worked</th><th>Overtime Hours</th>
                    <th>Reported Tips</th><th>Loan Payment</th><th>Insurance Payment</th><th>Gross Pay</th><th>Net Pay</th>
                    <th>Withholding Tax</th><th>Social Security Tax</th><th>Medicare Tax</th><th>Retirement Payment</th>
                    <th>Roth 401K Payment</th><th>Total Deductions</th><th>Total Additions</th><th>Bonus</th>
                    {customColumns.map((column) => (
                      <th key={column.id}>{column.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => {
                    const employee = record.employee || {};
                    return (
                      <tr key={index}>
                        <td>{employee.first_name || 'Unknown'}</td><td>{employee.last_name || 'Unknown'}</td>
                        <td>{employee.filing_status || 'N/A'}</td><td>{getDepartmentName(employee.department_id)}</td>
                        <td>{employee.pay_rate || 'N/A'}</td><td>{employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</td>
                        <td>{employee.roth_retirement_rate ? `${employee.roth_retirement_rate}%` : 'N/A'}</td>
                        <td>{record.hours_worked || 'N/A'}</td><td>{record.overtime_hours_worked || 'N/A'}</td>
                        <td>{record.reported_tips || 'N/A'}</td><td>{record.loan_payment || 'N/A'}</td>
                        <td>{record.insurance_payment || 'N/A'}</td><td>{record.gross_pay || 'N/A'}</td>
                        <td>{record.net_pay || 'N/A'}</td><td>{record.withholding_tax || 'N/A'}</td>
                        <td>{record.social_security_tax || 'N/A'}</td><td>{record.medicare_tax || 'N/A'}</td>
                        <td>{record.retirement_payment || 'N/A'}</td><td>{record.roth_retirement_payment || 'N/A'}</td>
                        <td>{record.total_deductions || 'N/A'}</td><td>{record.total_additions || 'N/A'}</td>
                        <td>{record.bonus || 'N/A'}</td>
                        {customColumns.map((column) => (
                          <td key={column.id}>{record.custom_columns_data?.[column.name] || 'N/A'}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-records-message">No payroll records found for the selected date.</p>
          )}
        </>
      )}

      <button className="button-back" onClick={() => navigate(`/companies/${companyId}/employees`)}>
        Back
      </button>
    </div>
  );
}

export default BatchPayrollRecordsDisplay;
