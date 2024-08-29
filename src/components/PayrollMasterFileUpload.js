// src/components/PayrollMasterFileUpload.js
import React, { useState } from 'react';
import axios from '../api/axios';
import './EmployeeFileUpload.css';

function PayrollMasterFileUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }

    try {
      const response = await axios.post('/api/upload_files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Master_Payroll_File.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert('Files processed and master file downloaded successfully!');
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Failed to process files.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Payroll Files to Create Master File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" multiple onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Processing...' : 'Upload and Process Files'}
        </button>
      </form>
    </div>
  );
}

export default PayrollMasterFileUpload;
