import React from 'react';
import { useLocation } from 'react-router-dom';
import './BatchPayrollRecordsDisplay.css';  // Import the CSS file

function BatchPayrollRecordsDisplay() {
  const location = useLocation();
  const records = location.state?.records || [];

  if (records.length === 0) {
    return <div className="container">No records available</div>;
  }

  return (
    <div className="container">
      <h1>Batch Payroll Records</h1>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Hours Worked</th>
            <th>Overtime Hours</th>
            <th>Reported Tips</th>
            <th>Gross Pay</th>
            <th>Net Pay</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => {
            const employeeName = record?.employee?.name || 'Unknown Employee';
            return (
              <tr key={index}>
                <td>{employeeName}</td>
                <td>{record.date || 'N/A'}</td>
                <td>{record.hours_worked || 'N/A'}</td>
                <td>{record.overtime_hours_worked || 'N/A'}</td>
                <td>{record.reported_tips || 'N/A'}</td>
                <td>{record.gross_pay || 'N/A'}</td>
                <td>{record.net_pay || 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <a href="/previous-page" className="button-back">Back</a>
    </div>
  );
}

export default BatchPayrollRecordsDisplay;
