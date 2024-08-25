// src/components/PayrollFileUpload.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import './FileUpload.css'; // Assuming you want to use the same styling

function PayrollFileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { companyId } = useParams(); // Retrieve the company ID from URL params

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      
      try {
        // Send parsed data to backend with companyId in the URL
        const response = await axios.post(`/companies/${companyId}/payroll_records/upload`, { payroll_data: data });
        console.log('Upload response:', response);
        alert('Payroll records uploaded successfully!');
      } catch (error) {
        console.error('Error uploading payroll records:', error);
        alert('Failed to upload payroll records.');
      }
      setUploading(false);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Payroll Excel</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default PayrollFileUpload;
