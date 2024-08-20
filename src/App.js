import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import PayrollRecordDetails from './components/PayrollRecordDetails';
import CreatePayrollRecord from './components/CreatePayrollRecord';
import BatchPayrollEntry from './components/BatchPayrollEntry';
import BatchPayrollRecordsDisplay from './components/BatchPayrollRecordsDisplay';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/employees/batch" element={<BatchPayrollEntry />} />
          <Route path="/batch-payroll-records-display" element={<BatchPayrollRecordsDisplay />} />
          <Route path="/employees/:employeeId/payroll_records/:recordId" element={<PayrollRecordDetails />} />
          <Route path="/employees/:employeeId/payroll_records/new" element={<CreatePayrollRecord />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
