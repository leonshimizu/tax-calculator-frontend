import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import './CheckComponent.css';

const CheckComponent = () => {
  const { companyId } = useParams();
  const location = useLocation();
  const records = location.state?.records || [];
  const [checksData, setChecksData] = useState([]);
  const checkRefs = useRef([]); // Array to hold references to each check layout

  useEffect(() => {
    // Fetch the data for all checks
    const fetchData = async () => {
      const dataPromises = records.map(async (record) => {
        const employeeResponse = await axios.get(`/companies/${companyId}/employees/${record.employee_id}`);
        const year = new Date(record.date).getFullYear();
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

  // Function to print a specific check layout
  const printCheck = (index) => {
    const checkContent = checkRefs.current[index]; // Get the specific check layout by index
  
    if (checkContent) {
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write('<html><head><title>Print Check</title>');
      printWindow.document.write('<link rel="stylesheet" type="text/css" href="CheckComponent.css" />');
      printWindow.document.write('</head><body>');
      printWindow.document.write(checkContent.outerHTML); // Insert the check layout HTML
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      
      // Print the content without closing the window
      printWindow.print();
    } else {
      console.error('Failed to print: No content available for printing.');
    }
  };

  if (!checksData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="check-container">
      {checksData.map((data, index) => (
        <div key={index} className="check-section">
          <div ref={(el) => (checkRefs.current[index] = el)} className="check-layout">
            {/* First Third - Check Layout */}
            <div className="check">
              <div className="check-header">
                <p><strong>Pay to the Order of:</strong> {data.employee.first_name} {data.employee.last_name}</p>
                <p className="check-amount-box">{formatCurrency(data.payroll.net_pay)}</p>
              </div>
              <div className="check-amount-text">
                <p>{/* Amount in words here */}</p>
              </div>
              <div className="check-footer">
                <p><strong>Date:</strong> {data.payroll.pay_date}</p>
                <p><strong>Memo:</strong> Payroll for {data.payroll.pay_period_start} - {data.payroll.pay_period_end}</p>
              </div>
            </div>

            {/* Second and Third Thirds - Mirror Layout */}
            <div className="paystub-mirror">
              <div className="employee-details">
                <h3>Employee: {data.employee.first_name} {data.employee.last_name}</h3>
                <p>Company: {data.payroll.company_name}</p>
              </div>

              <div className="pay-details-section">
                {/* PAY and TAXES tables */}
                <div className="pay-table">
                  <table className="earnings-table">
                    <thead>
                      <tr>
                        <th>PAY</th>
                        <th>Hours</th>
                        <th>Rate</th>
                        <th>Current</th>
                        <th>YTD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Regular Pay</td>
                        <td>{data.payroll.hours_worked}</td>
                        <td>{formatCurrency(data.employee.pay_rate)}</td>
                        <td>{formatCurrency(data.payroll.gross_pay)}</td>
                        <td>{formatCurrency(data.ytd.gross_pay)}</td>
                      </tr>
                      <tr>
                        <td>Overtime Pay</td>
                        <td>{data.payroll.overtime_hours_worked}</td>
                        <td>{formatCurrency(data.employee.pay_rate * 1.5)}</td>
                        <td>{formatCurrency(data.payroll.overtime_hours_worked * data.employee.pay_rate * 1.5)}</td>
                        <td>{formatCurrency(data.ytd.overtime_hours_worked * data.employee.pay_rate * 1.5)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="taxes-table">
                    <thead>
                      <tr>
                        <th>TAXES</th>
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

                {/* OTHER PAY and DEDUCTIONS tables */}
                <div className="other-pay-table">
                  <table className="other-pay">
                    <thead>
                      <tr>
                        <th>OTHER PAY</th>
                        <th>Current</th>
                        <th>YTD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>401(k) After Tax</td>
                        <td>{formatCurrency(data.payroll.retirement_payment)}</td>
                        <td>{formatCurrency(data.ytd.retirement_payment)}</td>
                      </tr>
                      <tr>
                        <td>Roth 401(k)</td>
                        <td>{formatCurrency(data.payroll.roth_retirement_payment)}</td>
                        <td>{formatCurrency(data.ytd.roth_retirement_payment)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="deductions-table">
                    <thead>
                      <tr>
                        <th>DEDUCTIONS</th>
                        <th>Current</th>
                        <th>YTD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Health Insurance</td>
                        <td>{formatCurrency(data.payroll.insurance_payment)}</td>
                        <td>{formatCurrency(data.ytd.insurance_payment)}</td>
                      </tr>
                      <tr>
                        <td>Loan Payment</td>
                        <td>{formatCurrency(data.payroll.loan_payment)}</td>
                        <td>{formatCurrency(data.ytd.loan_payment)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Summary and Footer */}
                <div className="summary-footer">
                  <div className="summary-table">
                    <table>
                      <thead>
                        <tr>
                          <th>SUMMARY</th>
                          <th>Current</th>
                          <th>YTD</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Total Pay</td>
                          <td>{formatCurrency(data.payroll.gross_pay)}</td>
                          <td>{formatCurrency(data.ytd.gross_pay)}</td>
                        </tr>
                        <tr>
                          <td>Taxes</td>
                          <td>{formatCurrency(data.payroll.withholding_tax + data.payroll.social_security_tax + data.payroll.medicare_tax)}</td>
                          <td>{formatCurrency(data.ytd.withholding_tax + data.ytd.social_security_tax + data.ytd.medicare_tax)}</td>
                        </tr>
                        <tr>
                          <td>Deductions</td>
                          <td>{formatCurrency(data.payroll.total_deductions)}</td>
                          <td>{formatCurrency(data.ytd.total_deductions)}</td>
                        </tr>
                        <tr>
                          <td><strong>NET PAY</strong></td>
                          <td><strong>{formatCurrency(data.payroll.net_pay)}</strong></td>
                          <td><strong>{formatCurrency(data.payroll.net_pay)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => printCheck(index)} className="print-button">Print Check</button>
        </div>
      ))}
    </div>
  );
};

export default CheckComponent;
