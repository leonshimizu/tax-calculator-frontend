// src/components/PayrollRecordDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PayrollRecordDetails.css';
import axios from '../api/axios';

const PayrollRecordDetails = () => {
    const { companyId, employeeId, recordId } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        fetchPayrollRecord();
        fetchEmployee();
    }, [companyId, employeeId, recordId]);

    const fetchPayrollRecord = async () => {
        try {
            const response = await axios.get(`/companies/${companyId}/employees/${employeeId}/payroll_records/${recordId}`);
            setRecord(response.data);  // Access the payroll record directly
        } catch (error) {
            console.error('Error fetching payroll record details:', error);
        }
    };

    const fetchEmployee = async () => {
        try {
            const response = await axios.get(`/companies/${companyId}/employees/${employeeId}`);
            setEmployee(response.data);
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    if (!record || !employee) return <div>Loading...</div>;

    return (
        <div className="payroll-record-details">
            <h1>Payroll Record Details</h1>
            <h2>{employee.first_name} {employee.last_name}</h2>
            <p>Department: {employee.department}</p>
            <p>Filing Status: {employee.filing_status}</p>

            <table>
                <tbody>
                    <tr>
                        <th>Date:</th>
                        <td>{record.date}</td>
                    </tr>
                    <tr>
                        <th>Hours Worked:</th>
                        <td>{record.hours_worked}</td>
                    </tr>
                    <tr>
                        <th>Overtime Hours:</th>
                        <td>{record.overtime_hours_worked || "N/A"}</td>
                    </tr>
                    <tr>
                        <th>Reported Tips:</th>
                        <td>${parseFloat(record.reported_tips).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Gross Income:</th>
                        <td>${parseFloat(record.gross_pay).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Net Pay:</th>
                        <td>${parseFloat(record.net_pay).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Loan Payment:</th>
                        <td>${parseFloat(record.loan_payment).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Insurance Payment:</th>
                        <td>${parseFloat(record.insurance_payment).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Withholding Tax:</th>
                        <td>${parseFloat(record.withholding_tax).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Social Security Tax:</th>
                        <td>${parseFloat(record.social_security_tax).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Medicare Tax:</th>
                        <td>${parseFloat(record.medicare_tax).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Retirement Payment:</th>
                        <td>${parseFloat(record.retirement_payment).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => navigate(`/companies/${companyId}/employees/${employeeId}/payroll_records/${recordId}/edit`)}>Edit</button>
            <button onClick={() => navigate(`/companies/${companyId}/employees/${employeeId}`)}>Back to Payroll Records</button>
        </div>
    );
};

export default PayrollRecordDetails;
