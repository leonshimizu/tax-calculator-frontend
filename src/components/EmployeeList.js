import React, { useEffect, useState } from 'react';
import './EmployeeList.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';

function EmployeeList() {
  const { companyId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]); // State for departments
  const [ytdTotals, setYtdTotals] = useState({
    hours_worked: 0,
    overtime_hours_worked: 0,
    reported_tips: 0,
    loan_payment: 0,
    insurance_payment: 0,
    gross_pay: 0,
    net_pay: 0,
    withholding_tax: 0,
    social_security_tax: 0,
    medicare_tax: 0,
    retirement_payment: 0,
    roth_retirement_payment: 0,
  });
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    payroll_type: 'hourly',
    department_id: '', // Use department_id instead of department
    pay_rate: '',
    retirement_rate: '',
    roth_retirement_rate: '',
    filing_status: 'single',
    company_id: companyId,
  });
  const [showAddRow, setShowAddRow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompany();
    fetchEmployees();
    fetchDepartments(); // Fetch departments when the component mounts
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}`);
      setCompany(response.data);
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/employees`);
      const sortedEmployees = response.data.sort((a, b) => a.last_name.localeCompare(b.last_name));
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/departments`);
      setDepartments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedEmployee = { ...newEmployee, [name]: value || '' }; // Ensure value is not null

    setNewEmployee(updatedEmployee);
  };

  const handleEditChange = (e, id, field) => {
    const newEmployees = employees.map(employee => {
      if (employee.id === id) {
        return { ...employee, [field]: e.target.value || '' }; // Ensure value is not null
      }
      return employee;
    });
    setEmployees(newEmployees);
  };

  const saveEdit = async (id) => {
    const employee = employees.find(emp => emp.id === id);
    try {
      await axios.put(`/companies/${companyId}/employees/${id}`, employee);
      setEditEmployeeId(null);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const addEmployee = async () => {
    try {
      await axios.post(`/companies/${companyId}/employees`, newEmployee);
      fetchEmployees();
      setShowAddRow(false);
      setNewEmployee({
        first_name: '',
        last_name: '',
        payroll_type: 'hourly',
        department_id: '',
        pay_rate: '',
        retirement_rate: '',
        roth_retirement_rate: '',
        filing_status: 'single',
        company_id: companyId,
      });
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`companies/${companyId}/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : '';
  };

  const hourlyEmployees = employees.filter(emp => emp.payroll_type === 'hourly');
  const salaryEmployees = employees.filter(emp => emp.payroll_type === 'salary');

  return (
    <div className="employee-list">
      <h2>Hourly Employees</h2>
      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Payroll Type</th>
              <th>Department</th>
              <th>Pay Rate</th>
              <th>401K Rate</th>
              <th>Roth 401K Rate</th>
              <th>Filing Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hourlyEmployees.map((employee) => (
              <tr key={employee.id}>
                {editEmployeeId === employee.id ? (
                  <>
                    <td><input type="text" value={employee.first_name || ''} onChange={(e) => handleEditChange(e, employee.id, 'first_name')} /></td>
                    <td><input type="text" value={employee.last_name || ''} onChange={(e) => handleEditChange(e, employee.id, 'last_name')} /></td>
                    <td>
                      <select value={employee.payroll_type || ''} onChange={(e) => handleEditChange(e, employee.id, 'payroll_type')}>
                        <option value="hourly">Hourly</option>
                        <option value="salary">Salary</option>
                      </select>
                    </td>
                    <td>
                      <select value={employee.department_id || ''} onChange={(e) => handleEditChange(e, employee.id, 'department_id')}>
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                      </select>
                    </td>
                    {employee.payroll_type === 'hourly' && (
                      <td><input type="number" value={employee.pay_rate || ''} onChange={(e) => handleEditChange(e, employee.id, 'pay_rate')} /></td>
                    )}
                    <td><input type="number" value={employee.retirement_rate || ''} onChange={(e) => handleEditChange(e, employee.id, 'retirement_rate')} /></td>
                    <td><input type="number" value={employee.roth_retirement_rate || ''} onChange={(e) => handleEditChange(e, employee.id, 'roth_retirement_rate')} /></td>
                    <td>
                      <select value={employee.filing_status || ''} onChange={(e) => handleEditChange(e, employee.id, 'filing_status')}>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="head_of_household">Head of Household</option>
                      </select>
                    </td>
                    <td>
                      <button className="button button-save" onClick={() => saveEdit(employee.id)}>Save</button>
                      <button className="button button-cancel" onClick={() => setEditEmployeeId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{employee.first_name}</td>
                    <td>{employee.last_name}</td>
                    <td>{employee.payroll_type}</td>
                    <td>{getDepartmentName(employee.department_id)}</td>
                    {employee.payroll_type === 'hourly' && (
                      <td>{employee.pay_rate ? `$${Number(employee.pay_rate).toFixed(2)}` : ''}</td>
                    )}
                    <td>{employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</td>
                    <td>{employee.roth_retirement_rate ? `${employee.roth_retirement_rate}%` : 'N/A'}</td>
                    <td>{employee.filing_status}</td>
                    <td>
                      <button
                        className="button-action button-show"
                        onClick={() => navigate(`/companies/${companyId}/employees/${employee.id}`)}
                      >
                        Show
                      </button>
                      <button
                        className="button-action button-edit"
                        onClick={() => setEditEmployeeId(employee.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="button-action button-delete"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Salary Employees</h2>
      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Payroll Type</th>
              <th>Department</th>
              <th>401K Rate</th>
              <th>Roth 401K Rate</th>
              <th>Filing Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaryEmployees.map((employee) => (
              <tr key={employee.id}>
                {editEmployeeId === employee.id ? (
                  <>
                    <td><input type="text" value={employee.first_name || ''} onChange={(e) => handleEditChange(e, employee.id, 'first_name')} /></td>
                    <td><input type="text" value={employee.last_name || ''} onChange={(e) => handleEditChange(e, employee.id, 'last_name')} /></td>
                    <td>
                      <select value={employee.payroll_type || ''} onChange={(e) => handleEditChange(e, employee.id, 'payroll_type')}>
                        <option value="hourly">Hourly</option>
                        <option value="salary">Salary</option>
                      </select>
                    </td>
                    <td>
                      <select value={employee.department_id || ''} onChange={(e) => handleEditChange(e, employee.id, 'department_id')}>
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="number" value={employee.retirement_rate || ''} onChange={(e) => handleEditChange(e, employee.id, 'retirement_rate')} /></td>
                    <td><input type="number" value={employee.roth_retirement_rate || ''} onChange={(e) => handleEditChange(e, employee.id, 'roth_retirement_rate')} /></td>
                    <td>
                      <select value={employee.filing_status || ''} onChange={(e) => handleEditChange(e, employee.id, 'filing_status')}>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="head_of_household">Head of Household</option>
                      </select>
                    </td>
                    <td>
                      <button className="button button-save" onClick={() => saveEdit(employee.id)}>Save</button>
                      <button className="button button-cancel" onClick={() => setEditEmployeeId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{employee.first_name}</td>
                    <td>{employee.last_name}</td>
                    <td>{employee.payroll_type}</td>
                    <td>{getDepartmentName(employee.department_id)}</td>
                    <td>{employee.retirement_rate ? `${employee.retirement_rate}%` : 'N/A'}</td>
                    <td>{employee.roth_retirement_rate ? `${employee.roth_retirement_rate}%` : 'N/A'}</td>
                    <td>{employee.filing_status}</td>
                    <td>
                      <button
                        className="button-action button-show"
                        onClick={() => navigate(`/companies/${companyId}/employees/${employee.id}`)}
                      >
                        Show
                      </button>
                      <button
                        className="button-action button-edit"
                        onClick={() => setEditEmployeeId(employee.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="button-action button-delete"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />
      <div className="add-employee-form">
        {!showAddRow && (
          <>
            <button className="button-add" onClick={() => setShowAddRow(true)}>Add New Employee</button>
          </>
        )}
        <div className={`add-employee-row ${showAddRow ? 'visible' : ''}`}>
          {showAddRow && (
            <>
              <h3>Add New Employee</h3>
              <div className="table-wrapper">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Payroll Type</th>
                      <th>Department</th>
                      {newEmployee.payroll_type === 'hourly' && <th>Pay Rate</th>}
                      <th>401K Rate</th>
                      <th>Roth 401K Rate</th>
                      <th>Filing Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><input type="text" name="first_name" value={newEmployee.first_name || ''} onChange={handleInputChange} /></td>
                      <td><input type="text" name="last_name" value={newEmployee.last_name || ''} onChange={handleInputChange} /></td>
                      <td>
                        <select name="payroll_type" value={newEmployee.payroll_type || ''} onChange={handleInputChange}>
                          <option value="hourly">Hourly</option>
                          <option value="salary">Salary</option>
                        </select>
                      </td>
                      <td>
                        <select name="department_id" value={newEmployee.department_id || ''} onChange={handleInputChange}>
                          {departments.map(department => (
                            <option key={department.id} value={department.id}>{department.name}</option>
                          ))}
                        </select>
                      </td>
                      {newEmployee.payroll_type === 'hourly' && (
                        <td><input type="number" name="pay_rate" value={newEmployee.pay_rate || ''} onChange={handleInputChange} /></td>
                      )}
                      <td><input type="number" name="retirement_rate" value={newEmployee.retirement_rate || ''} onChange={handleInputChange} /></td>
                      <td><input type="number" name="roth_retirement_rate" value={newEmployee.roth_retirement_rate || ''} onChange={handleInputChange} /></td>
                      <td>
                        <select name="filing_status" value={newEmployee.filing_status || ''} onChange={handleInputChange}>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="head_of_household">Head of Household</option>
                        </select>
                      </td>
                      <td>
                        <button className="button-save" onClick={addEmployee}>Save</button>
                        <button className="button-cancel" onClick={() => setShowAddRow(false)}>Cancel</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
