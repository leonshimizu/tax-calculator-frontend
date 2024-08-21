// src/components/BatchPayrollRecordsDisplay.js
import React from 'react';
import { useLocation } from 'react-router-dom';

function BatchPayrollRecordsDisplay() {
  // Use the useLocation hook to access the passed state
  const location = useLocation();
  const records = location.state?.records || [];

  // Debugging: Log the records to the console to ensure they are being received
  console.log('Received records:', records);

  if (records.length === 0) {
    return <div>No records available</div>;
  }

  return (
    <div>
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
            // Ensure each record has an employee object and a name property
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
    </div>
  );
}

export default BatchPayrollRecordsDisplay;
