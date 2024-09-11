import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import './CheckComponent.css';
import jsPDF from 'jspdf';

const CheckComponent = () => {
  const { companyId } = useParams();
  const location = useLocation();
  const records = location.state?.records || [];
  const [checksData, setChecksData] = useState([]);

  useEffect(() => {
    // Prepare the data for all checks
    const fetchData = async () => {
      const dataPromises = records.map(async (record) => {
        const employeeResponse = await axios.get(`/companies/${companyId}/employees/${record.employee_id}`);

        // Extract the year from the payroll date
        const year = new Date(record.date).getFullYear();

        // Fetch the YTD data for the specific year
        const ytdResponse = await axios.get(`/companies/${companyId}/employees/${record.employee_id}/ytd_totals?year=${year}`);

        return {
          employee: employeeResponse.data,
          payroll: record,
          ytd: ytdResponse.data,
        };
      });

      const data = await Promise.all(dataPromises);
      setChecksData(data);
    };

    fetchData();
  }, [records, companyId]);

  const formatCurrency = (amount) => {
    const parsedAmount = parseFloat(amount);
    return !isNaN(parsedAmount) ? `$${parsedAmount.toFixed(2)}` : 'N/A';
  };

  const printCheck = (index) => {
    const doc = new jsPDF();
    doc.html(document.getElementById(`check-content-${index}`), {
      callback: function (doc) {
        doc.save(`check_${checksData[index].employee.last_name}.pdf`);
      }
    });
  };

  if (!checksData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="check-container">
      {checksData.map((data, index) => (
        <div key={index} className="check-section">
          <div id={`check-content-${index}`} className="check-layout">
            <h1>Pay Stub</h1>
            <div className="company-info">
              <h2>{data.payroll.company_name}</h2>
              <p>{data.payroll.company_address}</p>
            </div>

            <div className="employee-info">
              <h3>Payee: {data.employee.first_name} {data.employee.last_name}</h3>
              <p>Address: {data.employee.address}</p>
            </div>

            <div className="pay-period-info">
              <p><strong>Pay Period:</strong> {data.payroll.pay_period_start} - {data.payroll.pay_period_end}</p>
              <p><strong>Pay Date:</strong> {data.payroll.pay_date}</p>
            </div>

            <div className="earnings-section">
              <table className="earnings-table">
                <thead>
                  <tr>
                    <th>Earnings</th>
                    <th>Current</th>
                    <th>YTD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Regular Pay</td>
                    <td>{formatCurrency(data.payroll.gross_pay)}</td>
                    <td>{formatCurrency(data.ytd.gross_pay)}</td>
                  </tr>
                  <tr>
                    <td>Overtime Pay</td>
                    <td>{formatCurrency(data.payroll.overtime_hours_worked)}</td>
                    <td>{formatCurrency(data.ytd.overtime_hours_worked)}</td>
                  </tr>
                  <tr>
                    <td>Tips</td>
                    <td>{formatCurrency(data.payroll.reported_tips)}</td>
                    <td>{formatCurrency(data.ytd.reported_tips)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="deductions-section">
              <table className="deductions-table">
                <thead>
                  <tr>
                    <th>Deductions</th>
                    <th>Current</th>
                    <th>YTD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Federal Income Tax</td>
                    <td>{formatCurrency(data.payroll.withholding_tax)}</td>
                    <td>{formatCurrency(data.ytd.withholding_tax)}</td>
                  </tr>
                  <tr>
                    <td>Social Security</td>
                    <td>{formatCurrency(data.payroll.social_security_tax)}</td>
                    <td>{formatCurrency(data.ytd.social_security_tax)}</td>
                  </tr>
                  <tr>
                    <td>Medicare</td>
                    <td>{formatCurrency(data.payroll.medicare_tax)}</td>
                    <td>{formatCurrency(data.ytd.medicare_tax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="summary-section">
              <h4>Net Pay: {formatCurrency(data.payroll.net_pay)}</h4>
              <p><strong>Total Deductions:</strong> {formatCurrency(data.payroll.total_deductions)}</p>
            </div>
          </div>

          <button onClick={() => printCheck(index)} className="print-button">Print Check</button>
        </div>
      ))}
    </div>
  );
};

export default CheckComponent;
