import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import PayrollRecordDetails from './components/PayrollRecordDetails';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/employees/:employeeId/payroll_records/:recordId" element={<PayrollRecordDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
