// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PayrollHome from './components/PayrollHome';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import PayrollRecordDetails from './components/PayrollRecordDetails';
import CreatePayrollRecord from './components/CreatePayrollRecord';
import BatchPayrollEntry from './components/BatchPayrollEntry';
import BatchPayrollRecordsDisplay from './components/BatchPayrollRecordsDisplay';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/" element={<PayrollHome />} />
          <Route path="/companies" element={<PayrollHome />} />
          <Route path="/companies/:companyId/employees" element={<EmployeeList />} />
          <Route path="/companies/:companyId/employees/:employeeId" element={<EmployeeDetail />} />
          <Route path="/companies/:companyId/employees/batch" element={<BatchPayrollEntry />} />
          <Route path="/companies/:companyId/batch-payroll-records-display" element={<BatchPayrollRecordsDisplay />} />
          <Route path="/companies/:companyId/employees/:employeeId/payroll_records/:recordId" element={<PayrollRecordDetails />} />
          <Route path="/companies/:companyId/employees/:employeeId/payroll_records/new" element={<CreatePayrollRecord />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
