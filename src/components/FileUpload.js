import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';  // Import useParams to get the companyId
import './FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { companyId } = useParams();  // Get companyId from URL parameters

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    // Parse the CSV file
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        console.log('Parsed results:', results.data);
        try {
          // Send parsed data to backend with companyId in the URL
          const response = await axios.post(`/companies/${companyId}/employees/upload`, { employees: results.data });
          console.log('Upload response:', response);
          alert('Employees uploaded successfully!');
        } catch (error) {
          console.error('Error uploading employees:', error);
          alert('Failed to upload employees.');
        }
        setUploading(false);
      },
    });
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Employee CSV</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
