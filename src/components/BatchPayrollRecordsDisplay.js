import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { utils, writeFile } from 'xlsx'; // Import necessary methods from xlsx library
import './BatchPayrollRecordsDisplay.css';

function BatchPayrollRecordsDisplay() {
  const { companyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [records, setRecords] = useState(location.state?.records || []);
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchDate) {
      handleSearch();
    }
  }, [searchDate]);

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

  const calculateYtdTotals = (records) => {
    const totals = {
      hours_worked: 0,
      overtime_hours_worked: 0,
      reported_tips: 0,
      loan_payment: 0,
      insurance_payment: 0,
      gross_pay: 0,
      bonus: 0,
      net_pay: 0,
      withholding_tax: 0,
      social_security_tax: 0,
      medicare_tax: 0,
      retirement_payment: 0,
      roth_retirement_payment: 0,
    };

    records.forEach(record => {
      totals.hours_worked += parseFloat(record.hours_worked) || 0;
      totals.overtime_hours_worked += parseFloat(record.overtime_hours_worked) || 0;
      totals.reported_tips += parseFloat(record.reported_tips) || 0;
      totals.loan_payment += parseFloat(record.loan_payment) || 0;
      totals.insurance_payment += parseFloat(record.insurance_payment) || 0;
      totals.gross_pay += parseFloat(record.gross_pay) || 0;
      totals.bonus += parseFloat(record.bonus) || 0;
      totals.net_pay += parseFloat(record.net_pay) || 0;
      totals.withholding_tax += parseFloat(record.withholding_tax) || 0;
      totals.social_security_tax += parseFloat(record.social_security_tax) || 0;
      totals.medicare_tax += parseFloat(record.medicare_tax) || 0;
      totals.retirement_payment += parseFloat(record.retirement_payment) || 0;
      totals.roth_retirement_payment += parseFloat(record.roth_retirement_payment) || 0;
    });

    return totals;
  };

  const hourlyRecords = records.filter(record => record.employee?.payroll_type === 'hourly');
  const salaryRecords = records.filter(record => record.employee?.payroll_type === 'salary');

  const hourlyYtdTotals = calculateYtdTotals(hourlyRecords);
  const salaryYtdTotals = calculateYtdTotals(salaryRecords);

  const formatNumber = (num) => num !== undefined ? num.toFixed(2) : 'N/A';

  const downloadAsCSV = () => {
    const data = records.map(record => {
      const employee = record.employee || {};
      return {
        'First Name': employee.first_name || 'Unknown',
        'Last Name': employee.last_name || 'Unknown',
        'Filing Status': employee.filing_status || 'N/A',
        'Department': employee.department || 'N/A',
        'Pay Rate': employee.pay_rate || 'N/A',
        'Retirement Rate': employee.retirement_rate || 'N/A',
        'Roth 401K Rate': employee.roth_retirement_rate || 'N/A',
        'Date': record.date || 'N/A',
        'Hours Worked': record.hours_worked || 'N/A',
        'Overtime Hours': record.overtime_hours_worked || 'N/A',
        'Reported Tips': record.reported_tips || 'N/A',
        'Loan Payment': record.loan_payment || 'N/A',
        'Insurance Payment': record.insurance_payment || 'N/A',
        'Net Pay': record.net_pay || 'N/A',
        'Withholding Tax': record.withholding_tax || 'N/A',
        'Social Security Tax': record.social_security_tax || 'N/A',
        'Medicare Tax': record.medicare_tax || 'N/A',
        'Retirement Payment': record.retirement_payment || 'N/A',
        'Roth 401K Payment': record.roth_retirement_payment || 'N/A',
      };
    });

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Payroll Records');
    writeFile(workbook, 'Payroll_Records.xlsx');
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

      <button onClick={downloadAsCSV} className="button-download">
        Download as Excel
      </button>

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <>
          {hourlyRecords.length > 0 || salaryRecords.length > 0 ? (
            <>
              {hourlyRecords.length > 0 && (
                <>
                  <h2>Hourly Employees</h2>
                  <div className="table-wrapper">
                    <table className="record-table">
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Filing Status</th>
                          <th>Department</th>
                          <th>Pay Rate</th>
                          <th>Retirement Rate</th>
                          <th>Roth 401K Rate</th>
                          <th>Hours Worked</th>
                          <th>Overtime Hours</th>
                          <th>Reported Tips</th>
                          <th>Loan Payment</th>
                          <th>Insurance Payment</th>
                          <th>Net Pay</th>
                          <th>Withholding Tax</th>
                          <th>Social Security Tax</th>
                          <th>Medicare Tax</th>
                          <th>Retirement Payment</th>
                          <th>Roth 401K Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hourlyRecords.map((record, index) => {
                          const employee = record.employee || {};
                          return (
                            <tr key={index}>
                              <td>{employee.first_name || 'Unknown'}</td>
                              <td>{employee.last_name || 'Unknown'}</td>
                              <td>{employee.filing_status || 'N/A'}</td>
                              <td>{employee.department || 'N/A'}</td>
                              <td>{formatNumber(parseFloat(employee.pay_rate))}</td>
                              <td>{employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</td>
                              <td>{employee.roth_retirement_rate ? `${employee.roth_retirement_rate}%` : 'N/A'}</td>
                              <td>{formatNumber(parseFloat(record.hours_worked))}</td>
                              <td>{formatNumber(parseFloat(record.overtime_hours_worked))}</td>
                              <td>{formatNumber(parseFloat(record.reported_tips))}</td>
                              <td>{formatNumber(parseFloat(record.loan_payment))}</td>
                              <td>{formatNumber(parseFloat(record.insurance_payment))}</td>
                              <td>{formatNumber(parseFloat(record.net_pay))}</td>
                              <td>{formatNumber(parseFloat(record.withholding_tax))}</td>
                              <td>{formatNumber(parseFloat(record.social_security_tax))}</td>
                              <td>{formatNumber(parseFloat(record.medicare_tax))}</td>
                              <td>{formatNumber(parseFloat(record.retirement_payment))}</td>
                              <td>{formatNumber(parseFloat(record.roth_retirement_payment))}</td>
                            </tr>
                          );
                        })}
                        <tr className="ytd-totals">
                          <td colSpan="7" className="ytd-label">Totals:</td>
                          <td>{formatNumber(hourlyYtdTotals.hours_worked)}</td>
                          <td>{formatNumber(hourlyYtdTotals.overtime_hours_worked)}</td>
                          <td>{formatNumber(hourlyYtdTotals.reported_tips)}</td>
                          <td>{formatNumber(hourlyYtdTotals.loan_payment)}</td>
                          <td>{formatNumber(hourlyYtdTotals.insurance_payment)}</td>
                          <td>{formatNumber(hourlyYtdTotals.net_pay)}</td>
                          <td>{formatNumber(hourlyYtdTotals.withholding_tax)}</td>
                          <td>{formatNumber(hourlyYtdTotals.social_security_tax)}</td>
                          <td>{formatNumber(hourlyYtdTotals.medicare_tax)}</td>
                          <td>{formatNumber(hourlyYtdTotals.retirement_payment)}</td>
                          <td>{formatNumber(hourlyYtdTotals.roth_retirement_payment)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {salaryRecords.length > 0 && (
                <>
                  <h2>Salary Employees</h2>
                  <div className="table-wrapper">
                    <table className="record-table">
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Filing Status</th>
                          <th>Department</th>
                          <th>Gross Pay</th>
                          <th>Bonus</th>
                          <th>Loan Payment</th>
                          <th>Insurance Payment</th>
                          <th>Net Pay</th>
                          <th>Withholding Tax</th>
                          <th>Social Security Tax</th>
                          <th>Medicare Tax</th>
                          <th>Retirement Payment</th>
                          <th>Roth 401K Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaryRecords.map((record, index) => {
                          const employee = record.employee || {};
                          return (
                            <tr key={index}>
                              <td>{employee.first_name || 'Unknown'}</td>
                              <td>{employee.last_name || 'Unknown'}</td>
                              <td>{employee.filing_status || 'N/A'}</td>
                              <td>{employee.department || 'N/A'}</td>
                              <td>{formatNumber(parseFloat(record.gross_pay))}</td>
                              <td>{formatNumber(parseFloat(record.bonus))}</td>
                              <td>{formatNumber(parseFloat(record.loan_payment))}</td>
                              <td>{formatNumber(parseFloat(record.insurance_payment))}</td>
                              <td>{formatNumber(parseFloat(record.net_pay))}</td>
                              <td>{formatNumber(parseFloat(record.withholding_tax))}</td>
                              <td>{formatNumber(parseFloat(record.social_security_tax))}</td>
                              <td>{formatNumber(parseFloat(record.medicare_tax))}</td>
                              <td>{formatNumber(parseFloat(record.retirement_payment))}</td>
                              <td>{formatNumber(parseFloat(record.roth_retirement_payment))}</td>
                            </tr>
                          );
                        })}
                        <tr className="ytd-totals">
                          <td colSpan="4" className="ytd-label">Totals:</td>
                          <td>{formatNumber(salaryYtdTotals.gross_pay)}</td>
                          <td>{formatNumber(salaryYtdTotals.bonus)}</td>
                          <td>{formatNumber(salaryYtdTotals.loan_payment)}</td>
                          <td>{formatNumber(salaryYtdTotals.insurance_payment)}</td>
                          <td>{formatNumber(salaryYtdTotals.net_pay)}</td>
                          <td>{formatNumber(salaryYtdTotals.withholding_tax)}</td>
                          <td>{formatNumber(salaryYtdTotals.social_security_tax)}</td>
                          <td>{formatNumber(salaryYtdTotals.medicare_tax)}</td>
                          <td>{formatNumber(salaryYtdTotals.retirement_payment)}</td>
                          <td>{formatNumber(salaryYtdTotals.roth_retirement_payment)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
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
