import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PayrollHome from './components/PayrollHome';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import PayrollRecordDetails from './components/PayrollRecordDetails';
import CreatePayrollRecord from './components/CreatePayrollRecord';
import BatchPayrollEntry from './components/BatchPayrollEntry';
import BatchPayrollRecordsDisplay from './components/BatchPayrollRecordsDisplay';
import EmployeeFileUpload from './components/EmployeeFileUpload';
import PayrollFileUpload from './components/PayrollFileUpload';
import NotFoundPage from './components/NotFoundPage';
import CustomColumnsManager from './components/CustomColumnsManager';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.performance) {
      if (performance.getEntriesByType("navigation")[0].type === "reload") {
        // Navigate to home page on refresh
        window.location.href = "/";
      }
    }
  }, [location]);

  return (
    <div style={{ paddingTop: '60px' }}>
      <Routes>
        {/* Define all the routes for your application */}
        <Route path="/" element={<><Navbar /><PayrollHome /></>} />
        <Route path="/companies" element={<><Navbar /><PayrollHome /></>} />
        <Route path="/companies/:companyId/employees" element={<><Navbar /><EmployeeList /></>} />
        <Route path="/companies/:companyId/employees/:employeeId" element={<><Navbar /><EmployeeDetail /></>} />
        <Route path="/companies/:companyId/employees/batch" element={<><Navbar /><BatchPayrollEntry /></>} />
        <Route path="/companies/:companyId/batch-payroll-records-display" element={<><Navbar /><BatchPayrollRecordsDisplay /></>} />
        <Route path="/companies/:companyId/employees/:employeeId/payroll_records/:recordId" element={<><Navbar /><PayrollRecordDetails /></>} />
        <Route path="/companies/:companyId/employees/:employeeId/payroll_records/new" element={<><Navbar /><CreatePayrollRecord /></>} />
        <Route path="/companies/:companyId/employees/upload" element={<><Navbar /><EmployeeFileUpload /></>} />
        <Route path="/companies/:companyId/payroll_records/upload" element={<><Navbar /><PayrollFileUpload /></>} />

        {/* Add routes for managing custom columns */}
        <Route path="/companies/:companyId/custom_columns" element={<><Navbar /><CustomColumnsManager /></>} />

        {/* Catch-all route to redirect to home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;
