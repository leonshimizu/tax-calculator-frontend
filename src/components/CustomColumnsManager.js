import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CustomColumnsManager.css';

function CustomColumnsManager() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [customColumns, setCustomColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [isDeduction, setIsDeduction] = useState(true); // Default state for the column type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchCustomColumns();
    } else {
      setError('Invalid company ID');
      setLoading(false);
    }
  }, [companyId]);

  const fetchCustomColumns = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/custom_columns`);
      if (response && response.data) {
        setCustomColumns(response.data);
      } else {
        setError('No data found in response');
      }
    } catch (err) {
      console.error('Error fetching custom columns:', err);
      setError('Failed to fetch custom columns');
    } finally {
      setLoading(false);
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
  
    try {
      const response = await axios.post(`/companies/${companyId}/custom_columns`, {
        name: newColumnName,
        is_deduction: isDeduction, // Send is_deduction based on user selection
      });
  
      if (response && response.data) {
        setCustomColumns([...customColumns, response.data]);
        setNewColumnName('');
        setIsDeduction(true); // Reset to default after adding
      } else {
        setError('No data found in response');
      }
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

  return (
    <div className="custom-columns-manager">
      <button className="button-back" onClick={() => navigate(`/companies/${companyId}/employees`)}>Back</button>
      <h3>Manage Custom Columns</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <ul className="custom-columns-list">
            {customColumns.map((column) => (
              <li key={column.id}>
                {column.name} - {column.is_deduction ? "Deduction" : "Addition"}
                <button className="button-remove" onClick={() => handleRemoveColumn(column.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="add-column-form">
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
                  onChange={() => setIsDeduction(true)} // Set to true when "Deduction" is selected
                />
                Deduction
              </label>
              <label>
                <input
                  type="radio"
                  name="columnType"
                  checked={!isDeduction}
                  onChange={() => setIsDeduction(false)} // Set to false when "Addition" is selected
                />
                Addition
              </label>
            </div>
            <button className="button-add" onClick={handleAddColumn}>Add Column</button>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomColumnsManager;
