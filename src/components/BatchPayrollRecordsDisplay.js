// src/components/BatchPayrollRecordsDisplay.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BatchPayrollRecordsDisplay.css';

function BatchPayrollRecordsDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const records = location.state?.records || [];

  // Sort the records alphabetically by employee name
  const sortedRecords = records.sort((a, b) => {
    const nameA = a?.employee?.name?.toLowerCase() || '';
    const nameB = b?.employee?.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  if (sortedRecords.length === 0) {
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
          {sortedRecords.map((record, index) => {
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
      <button className="button-back" onClick={() => navigate(`/employees`)}>Back</button>
    </div>
  );
}

export default BatchPayrollRecordsDisplay;
