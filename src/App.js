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
import EmployeeFileUpload from './components/EmployeeFileUpload';
import PayrollFileUpload from './components/PayrollFileUpload'; // Import the new PayrollFileUpload component
import NotFoundPage from './components/NotFoundPage'; // Import a 404 Not Found page component
import CustomColumnsManager from './components/CustomColumnsManager'; // Import the CustomColumnsManager component

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: '60px' }}>
        <Routes>
          {/* Define all the routes for your application */}
          <Route path="/" element={<PayrollHome />} />
          <Route path="/companies" element={<PayrollHome />} />
          <Route path="/companies/:companyId/employees" element={<EmployeeList />} />
          <Route path="/companies/:companyId/employees/:employeeId" element={<EmployeeDetail />} />
          <Route path="/companies/:companyId/employees/batch" element={<BatchPayrollEntry />} />
          <Route path="/companies/:companyId/batch-payroll-records-display" element={<BatchPayrollRecordsDisplay />} />
          <Route path="/companies/:companyId/employees/:employeeId/payroll_records/:recordId" element={<PayrollRecordDetails />} />
          <Route path="/companies/:companyId/employees/:employeeId/payroll_records/new" element={<CreatePayrollRecord />} />
          <Route path="/companies/:companyId/employees/upload" element={<EmployeeFileUpload />} />
          <Route path="/companies/:companyId/payroll_records/upload" element={<PayrollFileUpload />} /> {/* New route for batch payroll record upload */}

          {/* Add routes for managing custom columns */}
          <Route path="/companies/:companyId/custom_columns" element={<CustomColumnsManager />} />

          {/* Add a catch-all route for 404 errors */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
