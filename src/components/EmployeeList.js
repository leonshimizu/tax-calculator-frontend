// src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeList.css';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:3000/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  };

  const handleEditChange = (e, id, field) => {
    const newEmployees = employees.map((employee) => {
      if (employee.id === id) {
        return { ...employee, [field]: e.target.value };
      }
      return employee;
    });
    setEmployees(newEmployees);
  };
  
  const saveEdit = (id) => {
    const employee = employees.find(emp => emp.id === id);
    axios.put(`http://localhost:3000/employees/${id}`, employee)
      .then(() => {
        setEditEmployeeId(null);
        fetchEmployees();  // Refresh the list
      })
      .catch(error => console.error('Failed to save employee:', error));
  };
  
  const deleteEmployee = (id) => {
    axios.delete(`http://localhost:3000/employees/${id}`)
      .then(() => {
        fetchEmployees();  // Refresh the list
      })
      .catch(error => console.error('Failed to delete employee:', error));
  };

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    pay_rate: '',
    filing_status: 'single'
  });
  const [showAddRow, setShowAddRow] = useState(false);

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const addEmployee = () => {
    axios.post('http://localhost:3000/employees', newEmployee)
      .then(() => {
        fetchEmployees();  // Refresh the list
        setShowAddRow(false);  // Hide the input row
        setNewEmployee({ name: '', position: '', pay_rate: '', filing_status: 'single' });  // Reset form
      })
      .catch(error => console.error('Failed to add employee:', error));
  };

  return (
    <div>
      <h1>Employees</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Pay Rate</th>
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
              <td>
                <select name="filing_status" value={newEmployee.filing_status} onChange={handleInputChange}>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="head_of_household">Head of Household</option>
                </select>
              </td>
              <td>
                <button onClick={addEmployee}>Save</button>
                <button onClick={() => setShowAddRow(false)}>Cancel</button>
              </td>
            </tr>
          )}
          {employees.map((employee) => (
            <tr key={employee.id}>
              {editEmployeeId === employee.id ? (
                // Editable inputs
                <>
                  <td><input type="text" value={employee.name} onChange={(e) => handleEditChange(e, employee.id, 'name')} /></td>
                  <td>
                    <select value={employee.position} onChange={(e) => handleEditChange(e, employee.id, 'position')}>
                      <option value="front_of_house">Front of House</option>
                      <option value="back_of_house">Back of House</option>
                    </select>
                  </td>
                  <td><input type="number" value={Number(employee.pay_rate)} onChange={(e) => handleEditChange(e, employee.id, 'pay_rate')} /></td>
                  <td>{employee.filing_status}</td>
                  <td>
                    <button onClick={() => saveEdit(employee.id)}>Save</button>
                    <button onClick={() => setEditEmployeeId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                // Static display
                <>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>${Number(employee.pay_rate).toFixed(2)}</td>
                  <td>{employee.filing_status}</td>
                  <td>
                    <button onClick={() => setEditEmployeeId(employee.id)}>Edit</button>
                    <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <button onClick={() => setShowAddRow(true)}>Add New Employee</button>
    </div>
  );
}

export default EmployeeList;
