// src/components/BatchPayrollRecordsDisplay.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
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

  const calculateYtdTotals = () => {
    const totals = {
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
    };

    records.forEach(record => {
      totals.hours_worked += parseFloat(record.hours_worked) || 0;
      totals.overtime_hours_worked += parseFloat(record.overtime_hours_worked) || 0;
      totals.reported_tips += parseFloat(record.reported_tips) || 0;
      totals.loan_payment += parseFloat(record.loan_payment) || 0;
      totals.insurance_payment += parseFloat(record.insurance_payment) || 0;
      totals.gross_pay += parseFloat(record.gross_pay) || 0;
      totals.net_pay += parseFloat(record.net_pay) || 0;
      totals.withholding_tax += parseFloat(record.withholding_tax) || 0;
      totals.social_security_tax += parseFloat(record.social_security_tax) || 0;
      totals.medicare_tax += parseFloat(record.medicare_tax) || 0;
      totals.retirement_payment += parseFloat(record.retirement_payment) || 0;
    });

    return totals;
  };

  const ytdTotals = calculateYtdTotals();

  return (
    <div className="container">
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

      {loading ? (
        <p>Loading records...</p>
      ) : records.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Filing Status</th>
              <th>Department</th>
              <th>Pay Rate</th>
              <th>Retirement Rate</th>
              <th>Date</th>
              <th>Hours Worked</th>
              <th>Overtime Hours</th>
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
            {records.map((record, index) => {
              const employee = record.employee || {};
              return (
                <tr key={index}>
                  <td>{employee.first_name || 'Unknown'}</td>
                  <td>{employee.last_name || 'Unknown'}</td>
                  <td>{employee.filing_status || 'N/A'}</td>
                  <td>{employee.department || 'N/A'}</td>
                  <td>{parseFloat(employee.pay_rate).toFixed(2) || 'N/A'}</td>
                  <td>{employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</td>
                  <td>{record.date || 'N/A'}</td>
                  <td>{parseFloat(record.hours_worked).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.overtime_hours_worked).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.reported_tips).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.loan_payment).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.insurance_payment).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.gross_pay).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.net_pay).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.withholding_tax).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.social_security_tax).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.medicare_tax).toFixed(2) || 'N/A'}</td>
                  <td>{parseFloat(record.retirement_payment).toFixed(2) || 'N/A'}</td>
                </tr>
              );
            })}
            {/* YTD Totals Row */}
            <tr className="ytd-totals">
              <td colSpan="7" className="ytd-label">Totals:</td>
              <td>{ytdTotals.hours_worked.toFixed(2)}</td>
              <td>{ytdTotals.overtime_hours_worked.toFixed(2)}</td>
              <td>{ytdTotals.reported_tips.toFixed(2)}</td>
              <td>{ytdTotals.loan_payment.toFixed(2)}</td>
              <td>{ytdTotals.insurance_payment.toFixed(2)}</td>
              <td>{ytdTotals.gross_pay.toFixed(2)}</td>
              <td>{ytdTotals.net_pay.toFixed(2)}</td>
              <td>{ytdTotals.withholding_tax.toFixed(2)}</td>
              <td>{ytdTotals.social_security_tax.toFixed(2)}</td>
              <td>{ytdTotals.medicare_tax.toFixed(2)}</td>
              <td>{ytdTotals.retirement_payment.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No records available for the selected date.</p>
      )}

      <button className="button-back" onClick={() => navigate(`/companies/${companyId}/employees`)}>Back</button>
    </div>
  );
}

export default BatchPayrollRecordsDisplay;
