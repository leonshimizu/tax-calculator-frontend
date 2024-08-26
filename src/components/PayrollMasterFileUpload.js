// src/components/PayrollMasterFileUpload.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from '../api/axios';
import './EmployeeFileUpload.css';

function PayrollMasterFileUpload() {
  const [files, setFiles] = useState([]);
  const [namesFile, setNamesFile] = useState(null); // New state for names Excel file
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleNamesFileChange = (e) => { // New handler for names Excel file change
    setNamesFile(e.target.files[0]);
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

  const handleNamesSubmit = async (e) => { // Updated handler for names Excel file submission
    e.preventDefault();
    if (!namesFile) return;
  
    setUploading(true);
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read as a 2D array to access rows directly
  
      const processedData = data.map((row) => {
        const fullName = row[0]; // Assuming the name is in the first column
  
        // Add a check to ensure fullName is defined and not empty
        if (!fullName) {
          return { first_name: '', last_name: '' }; // Default to empty strings if the full name is undefined or empty
        }
  
        const nameParts = fullName.split(',').map(part => part.trim());
  
        if (nameParts.length < 2) {
          return { first_name: '', last_name: fullName }; // If no comma is found, treat entire string as last name
        }
  
        const lastName = nameParts[0];
        const firstAndMiddle = nameParts[1].split(' ');
  
        const firstName = firstAndMiddle[0];
        const middleInitial = firstAndMiddle.length > 1 ? firstAndMiddle.slice(1).join(' ') : '';
  
        return {
          first_name: `${firstName} ${middleInitial}`.trim(), // Combine first name and middle initial
          last_name: lastName
        };
      });
  
      // Convert the processed data into a worksheet
      const newWorkbook = XLSX.utils.book_new();
      const newWorksheetData = [
        ['First Name', 'Last Name'], // Header row
        ...processedData.map((entry) => [entry.first_name, entry.last_name]) // Data rows
      ];
      const newWorksheet = XLSX.utils.aoa_to_sheet(newWorksheetData);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Processed Names');
  
      // Generate Excel file and trigger download
      XLSX.writeFile(newWorkbook, 'Processed_Employee_Names.xlsx');
  
      setUploading(false);
    };
    reader.readAsBinaryString(namesFile);
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

      <h2>Upload Employee Names Excel</h2> {/* New section for names Excel upload */}
      <form onSubmit={handleNamesSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleNamesFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Processing...' : 'Upload Names and Download Processed File'}
        </button>
      </form>
    </div>
  );
}

export default PayrollMasterFileUpload;
