// src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import './EmployeeList.css';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: 'front_of_house',
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
      setEmployees(response.data);
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
      fetchEmployees();  // Refresh the list
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const addEmployee = async () => {
    try {
      await axios.post('/employees', newEmployee);
      fetchEmployees();  // Refresh the list
      setShowAddRow(false);  // Hide the input row
      setNewEmployee({ name: '', position: 'front_of_house', pay_rate: '', retirement_rate: '', filing_status: 'single' });  // Reset form
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`/employees/${id}`);
      fetchEmployees();  // Refresh the list
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  return (
    <div className="employee-list">
      <h1>Employees</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Pay Rate</th>
            <th>401K Rate</th>
            <th>Filing Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {showAddRow && (
            <tr>
              <td><input type="text" name="name" value={newEmployee.name} onChange={handleInputChange} /></td>
              <td>
                <select name="position" value={newEmployee.position} onChange={handleInputChange}>
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
                  <td><input type="text" value={employee.name} onChange={(e) => handleEditChange(e, employee.id, 'name')} /></td>
                  <td>
                    <select value={employee.position} onChange={(e) => handleEditChange(e, employee.id, 'position')}>
                      <option value="front_of_house">Front of House</option>
                      <option value="back_of_house">Back of House</option>
                    </select>
                  </td>
                  <td><input type="number" value={Number(employee.pay_rate)} onChange={(e) => handleEditChange(e, employee.id, 'pay_rate')} /></td>
                  <td><input type="number" value={employee.retirement_rate} onChange={(e) => handleEditChange(e, employee.id, 'retirement_rate')} /></td>
                  <td>{employee.filing_status}</td>
                  <td>
                    <button onClick={() => saveEdit(employee.id)}>Save</button>
                    <button onClick={() => setEditEmployeeId(null)}>Cancel</button>
                    <button onClick={() => navigate(`/employees/${employee.id}`)}>Show</button>
                    <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
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
