import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CompanySettingsManager.css';

function CompanySettingsManager() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [customColumns, setCustomColumns] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isDeduction, setIsDeduction] = useState(true);
  const [loadingColumns, setLoadingColumns] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState(null);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');

  // Fetch custom columns
  const fetchCustomColumns = useCallback(async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/custom_columns`);
      setCustomColumns(response.data || []);
    } catch (err) {
      console.error('Error fetching custom columns:', err);
      setError('Failed to fetch custom columns');
    } finally {
      setLoadingColumns(false); // Ensure loading is set to false in the finally block
    }
  }, [companyId]);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/departments`);
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to fetch departments');
    } finally {
      setLoadingDepartments(false); // Ensure loading is set to false in the finally block
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      fetchCustomColumns();
      fetchDepartments();
    } else {
      setError('Invalid company ID');
      setLoadingColumns(false);
      setLoadingDepartments(false);
    }
  }, [companyId, fetchCustomColumns, fetchDepartments]);

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    try {
      const response = await axios.post(`/companies/${companyId}/custom_columns`, {
        name: newColumnName,
        is_deduction: isDeduction,
      });
      setCustomColumns([...customColumns, response.data]);
      setNewColumnName('');
      setIsDeduction(true);
    } catch (err) {
      console.error('Error adding custom column:', err);
      setError('Failed to add custom column');
    }
  };

  const handleRemoveColumn = async (columnId) => {
    try {
      await axios.delete(`/companies/${companyId}/custom_columns/${columnId}`);
      setCustomColumns(customColumns.filter((column) => column.id !== columnId));
    } catch (err) {
      console.error('Error removing custom column:', err);
      setError('Failed to remove custom column');
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) return;
    try {
      const response = await axios.post(`/companies/${companyId}/departments`, {
        name: newDepartmentName,
      });
      setDepartments([...departments, response.data]);
      setNewDepartmentName('');
    } catch (err) {
      console.error('Error adding department:', err);
      setError('Failed to add department');
    }
  };

  const handleRemoveDepartment = async (departmentId) => {
    try {
      await axios.delete(`/companies/${companyId}/departments/${departmentId}`);
      setDepartments(departments.filter((dept) => dept.id !== departmentId));
    } catch (err) {
      console.error('Error removing department:', err);
      setError('Failed to remove department');
    }
  };

  const handleEditDepartment = (department) => {
    setEditDepartmentId(department.id);
    setEditDepartmentName(department.name);
  };

  const handleUpdateDepartment = async () => {
    if (!editDepartmentName.trim()) return;
    try {
      const response = await axios.put(`/companies/${companyId}/departments/${editDepartmentId}`, {
        name: editDepartmentName,
      });
      setDepartments(
        departments.map((dept) => (dept.id === editDepartmentId ? response.data : dept))
      );
      setEditDepartmentId(null);
      setEditDepartmentName('');
    } catch (err) {
      console.error('Error updating department:', err);
      setError('Failed to update department');
    }
  };

  return (
    <div className="company-settings-manager">
      <button className="button-back" onClick={() => navigate(`/companies/${companyId}/employees`)}>Back</button>
      <h3>Manage Company Settings</h3>
      {error && <p>{error}</p>}
      {/* Custom Columns Section */}
      <div className="settings-section">
        <h4>Custom Columns</h4>
        {loadingColumns ? (
          <p>Loading custom columns...</p>
        ) : (
          <>
            <ul className="settings-list">
              {customColumns.map((column) => (
                <li key={column.id}>
                  {column.name} - {column.is_deduction ? "Deduction" : "Addition"}
                  <button className="button-remove" onClick={() => handleRemoveColumn(column.id)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="add-setting-form">
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="New Column Name"
                className="input-new-column"
              />
              <div className="deduction-toggle">
                <label>
                  <input
                    type="radio"
                    name="columnType"
                    checked={isDeduction}
                    onChange={() => setIsDeduction(true)}
                  />
                  Deduction
                </label>
                <label>
                  <input
                    type="radio"
                    name="columnType"
                    checked={!isDeduction}
                    onChange={() => setIsDeduction(false)}
                  />
                  Addition
                </label>
              </div>
              <button className="button-add" onClick={handleAddColumn}>Add Column</button>
            </div>
          </>
        )}
      </div>

      {/* Departments Section */}
      <div className="settings-section">
        <h4>Departments</h4>
        {loadingDepartments ? (
          <p>Loading departments...</p>
        ) : (
          <>
            <ul className="settings-list">
              {departments.map((dept) => (
                <li key={dept.id}>
                  {editDepartmentId === dept.id ? (
                    <>
                      <input
                        type="text"
                        value={editDepartmentName}
                        onChange={(e) => setEditDepartmentName(e.target.value)}
                        className="input-edit-department"
                      />
                      <button className="button-save" onClick={handleUpdateDepartment}>Save</button>
                      <button className="button-cancel" onClick={() => setEditDepartmentId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      {dept.name}
                      <button className="button-edit" onClick={() => handleEditDepartment(dept)}>Edit</button>
                      <button className="button-remove" onClick={() => handleRemoveDepartment(dept.id)}>Remove</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <div className="add-setting-form">
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="New Department Name"
                className="input-new-department"
              />
              <button className="button-add" onClick={handleAddDepartment}>Add Department</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CompanySettingsManager;
