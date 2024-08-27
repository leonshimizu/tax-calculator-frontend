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
import PayrollMasterFileUpload from './components/PayrollMasterFileUpload';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { LogoutLink } from './components/LogoutLink';

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
      <Navbar />
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
        <Route path="/companies/:companyId/payroll_records/upload" element={<PayrollFileUpload />} />
        <Route path="/companies/:companyId/payroll_master_file/upload" element={<PayrollMasterFileUpload />} /> {/* New route for PayrollMasterFileUpload */}
        <Route path="/companies/:companyId/custom_columns" element={<CustomColumnsManager />} />

        {/* Routes for authentication */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Catch-all route to handle unknown paths */}
        <Route path="*" element={<NotFoundPage />} />
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
