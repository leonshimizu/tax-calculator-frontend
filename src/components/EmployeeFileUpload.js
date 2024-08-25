import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import './EmployeeFileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { companyId } = useParams();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the first sheet is the one we need
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Parsed results:', jsonData);

      try {
        const response = await axios.post(`/companies/${companyId}/employees/upload`, { employees: jsonData });
        console.log('Upload response:', response);
        alert('Employees uploaded successfully!');
      } catch (error) {
        console.error('Error uploading employees:', error);
        alert('Failed to upload employees.');
      }

      setUploading(false);
    };

    reader.onerror = (error) => {
      console.error('File reading error:', error);
      setUploading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Employee Excel File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
