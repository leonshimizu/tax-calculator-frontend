import React from 'react';
import { useLocation } from 'react-router-dom';
import './BatchPayrollRecordsDisplay.css'; // Make sure you have this CSS file

function BatchPayrollRecordsDisplay() {
  const location = useLocation();
  const { records } = location.state || {};  // Provide a fallback if state is null

  if (!records) {
    return <div>No records to display</div>;
  }

  return (
    <div className="container">
      <h1>Batch Payroll Records</h1>
      <table className="records-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Hours Worked</th>
            <th>Overtime Hours</th>
            <th>Reported Tips</th>
            <th>Gross Pay</th>
            <th>Net Pay</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.employeeId}</td>
              <td>{record.employeeName}</td>
              <td>{record.date}</td>
              <td>{record.hoursWorked}</td>
              <td>{record.overtimeHours}</td>
              <td>${Number(record.reportedTips).toFixed(2)}</td>
              <td>${Number(record.grossPay).toFixed(2)}</td>
              <td>${Number(record.netPay).toFixed(2)}</td>
              <td>
                <button className="button-detail">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BatchPayrollRecordsDisplay;
