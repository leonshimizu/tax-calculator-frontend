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
import PayrollFileUpload from './components/PayrollFileUpload';
import NotFoundPage from './components/NotFoundPage';
import CompanySettingsManager from './components/CompanySettingsManager';
import PayrollMasterFileUpload from './components/PayrollMasterFileUpload';
import AdminDashboard from './components/AdminDashboard';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import YearToDatePage from './components/YearToDatePage';

const App = () => (
  <div style={{ paddingTop: '60px' }}>
    <Navbar />
    <Routes>
      {/* Routes for authentication */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PayrollHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <PayrollHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/employees/:employeeId"
        element={
          <ProtectedRoute>
            <EmployeeDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/employees/batch"
        element={
          <ProtectedRoute>
            <BatchPayrollEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/batch-payroll-records-display"
        element={
          <ProtectedRoute>
            <BatchPayrollRecordsDisplay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/employees/:employeeId/payroll_records/:recordId"
        element={
          <ProtectedRoute>
            <PayrollRecordDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/employees/:employeeId/payroll_records/new"
        element={
          <ProtectedRoute>
            <CreatePayrollRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/employees/upload"
        element={
          <ProtectedRoute>
            <EmployeeFileUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/payroll_records/upload"
        element={
          <ProtectedRoute>
            <PayrollFileUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/payroll_master_file/upload"
        element={
          <ProtectedRoute>
            <PayrollMasterFileUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/settings"
        element={
          <ProtectedRoute>
            <CompanySettingsManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies/:companyId/ytd-totals"
        element={
          <ProtectedRoute>
            <YearToDatePage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for unknown paths */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </div>
);

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;
