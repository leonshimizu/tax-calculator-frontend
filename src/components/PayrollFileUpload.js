// src/components/PayrollFileUpload.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import './EmployeeFileUpload.css';

function PayrollFileUpload() {
  const [file, setFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null); // New state for PDF files
  const [uploading, setUploading] = useState(false);
  const { companyId } = useParams(); // Retrieve the company ID from URL params

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePdfFileChange = (e) => { // New handler for PDF file change
    setPdfFile(e.target.files[0]);
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

  const handlePdfSubmit = async (e) => { // Updated handler for PDF submission and Excel download
    e.preventDefault();
    if (!pdfFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      // Send the PDF file to backend and receive the Excel file
      const response = await axios.post('/api/upload_pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Important for handling file downloads
      });

      // Create a URL for the downloaded Excel file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payroll_data.xlsx'); // Set the download attribute with a filename
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert('Excel file generated and downloaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to process PDF.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Payroll Excel</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Excel'}
        </button>
      </form>

      <h2>Upload Payroll PDF</h2> {/* New section for PDF upload */}
      <form onSubmit={handlePdfSubmit}>
        <input type="file" accept=".pdf" onChange={handlePdfFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Processing...' : 'Upload PDF and Generate Excel'}
        </button>
      </form>
    </div>
  );
}

export default PayrollFileUpload;
