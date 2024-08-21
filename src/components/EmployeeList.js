// src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import './EmployeeList.css';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    department: 'front_of_house',
    pay_rate: '',
    retirement_rate: '',
    filing_status: 'single'
  });
  const [showAddRow, setShowAddRow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/employees');
      const sortedEmployees = response.data.sort((a, b) => a.first_name.localeCompare(b.first_name));
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ 
      ...newEmployee, 
      [name]: value === null ? '' : value  // Convert null to an empty string
    });
  };

  const handleEditChange = (e, id, field) => {
    const newEmployees = employees.map(employee => {
      if (employee.id === id) {
        return { ...employee, [field]: e.target.value };
      }
      return employee;
    });
    setEmployees(newEmployees);
  };

  const saveEdit = async (id) => {
    const employee = employees.find(emp => emp.id === id);
    try {
      await axios.put(`/employees/${id}`, employee);
      setEditEmployeeId(null);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const addEmployee = async () => {
    try {
      await axios.post('/employees', newEmployee);
      fetchEmployees();
      setShowAddRow(false);
      setNewEmployee({ first_name: '', last_name: '', department: 'front_of_house', pay_rate: '', retirement_rate: '', filing_status: 'single' });
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  return (
    <div className="employee-list">
      <h1>Employees</h1>
      <button onClick={() => navigate('/employees/batch')} className="button button-batch-entry">Batch Payroll Entry</button>
      <button onClick={() => navigate('/batch-payroll-records-display')} className="button button-view-records">
        View Payroll Records by Date
      </button>
      <table className="employee-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Pay Rate</th>
            <th>401K Rate</th>
            <th>Filing Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {showAddRow && (
            <tr>
              <td><input type="text" name="first_name" value={newEmployee.first_name} onChange={handleInputChange} /></td>
              <td><input type="text" name="last_name" value={newEmployee.last_name} onChange={handleInputChange} /></td>
              <td>
                <select name="department" value={newEmployee.department} onChange={handleInputChange}>
                  <option value="front_of_house">Front of House</option>
                  <option value="back_of_house">Back of House</option>
                </select>
              </td>
              <td><input type="number" name="pay_rate" value={Number(newEmployee.pay_rate)} onChange={handleInputChange} /></td>
              <td><input type="number" name="retirement_rate" value={newEmployee.retirement_rate} onChange={handleInputChange} /></td>
              <td>
                <select name="filing_status" value={newEmployee.filing_status} onChange={handleInputChange}>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="head_of_household">Head of Household</option>
                </select>
              </td>
              <td>
                <button className="button button-save" onClick={addEmployee}>Save</button>
                <button className="button button-cancel" onClick={() => setShowAddRow(false)}>Cancel</button>
              </td>
            </tr>
          )}
          {employees.map((employee) => (
            <tr key={employee.id}>
              {editEmployeeId === employee.id ? (
                <>
                  <td><input type="text" value={employee.first_name} onChange={(e) => handleEditChange(e, employee.id, 'first_name')} /></td>
                  <td><input type="text" value={employee.last_name} onChange={(e) => handleEditChange(e, employee.id, 'last_name')} /></td>
                  <td>
                    <select value={employee.department} onChange={(e) => handleEditChange(e, employee.id, 'department')}>
                      <option value="front_of_house">Front of House</option>
                      <option value="back_of_house">Back of House</option>
                    </select>
                  </td>
                  <td><input type="number" value={Number(employee.pay_rate)} onChange={(e) => handleEditChange(e, employee.id, 'pay_rate')} /></td>
                  <td><input type="number" value={employee.retirement_rate} onChange={(e) => handleEditChange(e, employee.id, 'retirement_rate')} /></td>
                  <td>
                    <select value={employee.filing_status} onChange={(e) => handleEditChange(e, employee.id, 'filing_status')}>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="head_of_household">Head of Household</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => saveEdit(employee.id)}>Save</button>
                    <button onClick={() => setEditEmployeeId(null)}>Cancel</button>
                    <button onClick={() => navigate(`/employees/${employee.id}`)}>Show</button>
                    <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.department}</td>
                  <td>${Number(employee.pay_rate).toFixed(2)}</td>
                  <td>{employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</td>
                  <td>{employee.filing_status}</td>
                  <td>
                    <button className="button-action button-show" onClick={() => navigate(`/employees/${employee.id}`)}>Show</button>
                    <button className="button-action button-edit" onClick={() => setEditEmployeeId(employee.id)}>Edit</button>
                    <button className="button-action button-delete" onClick={() => deleteEmployee(employee.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div className="button-group">
        <button className="button-add" onClick={() => setShowAddRow(true)}>Add New Employee</button>
      </div>
    </div>
  );
}

export default EmployeeList;
