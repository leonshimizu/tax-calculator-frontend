import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/employees" element={<EmployeeList />} exact />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
