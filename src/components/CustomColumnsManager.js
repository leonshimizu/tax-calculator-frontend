import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import './CustomColumnsManager.css';

function CustomColumnsManager() {
  const { companyId } = useParams();
  const [customColumns, setCustomColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('decimal'); // State for the new column's data type
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
      setCustomColumns(response.data);
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
        data_type: newColumnType,  // Include data type in the request
      });
      setCustomColumns([...customColumns, response.data]);
      setNewColumnName('');
      setNewColumnType('decimal');  // Reset to default
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
                {column.name} ({column.data_type})
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
            <select
              value={newColumnType}
              onChange={(e) => setNewColumnType(e.target.value)}
              className="select-new-column-type"
            >
              <option value="decimal">Decimal</option>
            </select>
            <button className="button-add" onClick={handleAddColumn}>Add Column</button>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomColumnsManager;
