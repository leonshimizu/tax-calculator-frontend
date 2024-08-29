// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './AdminDashboard.css'; // Import the CSS file for styling

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear any existing errors
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleUserApproval = async (userId, status) => {
    setError(null); // Clear any existing errors
    try {
      await axios.put(`/admin/users/${userId}`, { status });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status } : user
        )
      ); // Optimistically update the user's status
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <span className="user-info">{user.email} - {user.status}</span>
            {user.status === 'pending' && (
              <div className="action-buttons">
                <button
                  className="approve-button"
                  onClick={() => handleUserApproval(user.id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleUserApproval(user.id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
