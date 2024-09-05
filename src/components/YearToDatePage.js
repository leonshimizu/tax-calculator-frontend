import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import './YearToDatePage.css';

const YearToDatePage = () => {
  const { companyId } = useParams(); // Get companyId from URL
  const [companyYtdTotals, setCompanyYtdTotals] = useState(null);
  // const [employeeYtdTotals, setEmployeeYtdTotals] = useState([]); // Commented out for now
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (companyId) {
      console.log(`Company ID from URL: ${companyId}`);
      setLoading(true);
      fetchCompanyYtdTotals();
      // fetchEmployeeYtdTotals(); // Commented out for now
    }
  }, [companyId, year]);

  const fetchCompanyYtdTotals = async () => {
    try {
      console.log(`Fetching company YTD totals for company ID ${companyId} and year ${year}`);
      const response = await axios.get(`/companies/${companyId}/company_ytd_totals?year=${year}`);
      console.log("Company YTD totals fetched:", response.data);
      setCompanyYtdTotals(response.data);
    } catch (err) {
      console.error('Error fetching company YTD totals:', err);
      setError('Failed to fetch company YTD totals');
    } finally {
      setLoading(false);
    }
  };

  // Commented out the employee YTD totals logic
  // const fetchEmployeeYtdTotals = async () => {
  //   try {
  //     console.log(`Fetching employee YTD totals for company ID ${companyId} and year ${year}`);
  //     const response = await axios.get(`/companies/${companyId}/employees/ytd_totals?year=${year}`);
  //     console.log("Employee YTD totals fetched:", response.data);
  //     setEmployeeYtdTotals(response.data);
  //   } catch (err) {
  //     console.error('Error fetching employee YTD totals:', err);
  //     setError('Failed to fetch employee YTD totals');
  //   }
  // };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleUpdateYtdTotals = async () => {
    try {
      setUpdating(true);
      console.log(`Updating YTD totals for company ID ${companyId} and year ${year}`);
      await axios.post(`/companies/${companyId}/update_ytd_totals?year=${year}`);
      fetchCompanyYtdTotals();
      // fetchEmployeeYtdTotals(); // Commented out for now
    } catch (err) {
      console.error('Error updating YTD totals:', err);
      setError('Failed to update YTD totals');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="ytd-page">
      <h1>Year-to-Date Totals</h1>
      <div className="ytd-year-selector">
        <label>Select Year: </label>
        <select value={year} onChange={handleYearChange}>
          {[2022, 2023, 2024].map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      <button onClick={handleUpdateYtdTotals} disabled={updating}>
        {updating ? 'Updating...' : 'Update YTD Totals'}
      </button>

      {/* Company YTD Totals Table */}
      <h2>Company YTD Totals</h2>
      {companyYtdTotals ? (
        <table className="ytd-table">
          <thead>
            <tr>
              <th>Hours Worked</th>
              <th>Overtime Hours Worked</th>
              <th>Reported Tips</th>
              <th>Loan Payment</th>
              <th>Insurance Payment</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>
              <th>Withholding Tax</th>
              <th>Social Security Tax</th>
              <th>Medicare Tax</th>
              <th>Retirement Payment</th>
              <th>Roth Retirement Payment</th>
              <th>Bonus</th>
              <th>Total Deductions</th>
              <th>Total Additions</th>
              {/* Add more fields as needed */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{companyYtdTotals.hours_worked ? Number(companyYtdTotals.hours_worked).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.overtime_hours_worked ? Number(companyYtdTotals.overtime_hours_worked).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.reported_tips ? Number(companyYtdTotals.reported_tips).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.loan_payment ? Number(companyYtdTotals.loan_payment).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.insurance_payment ? Number(companyYtdTotals.insurance_payment).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.gross_pay ? Number(companyYtdTotals.gross_pay).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.net_pay ? Number(companyYtdTotals.net_pay).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.withholding_tax ? Number(companyYtdTotals.withholding_tax).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.social_security_tax ? Number(companyYtdTotals.social_security_tax).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.medicare_tax ? Number(companyYtdTotals.medicare_tax).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.retirement_payment ? Number(companyYtdTotals.retirement_payment).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.roth_retirement_payment ? Number(companyYtdTotals.roth_retirement_payment).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.bonus ? Number(companyYtdTotals.bonus).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.total_deductions ? Number(companyYtdTotals.total_deductions).toFixed(2) : 'N/A'}</td>
              <td>{companyYtdTotals.total_additions ? Number(companyYtdTotals.total_additions).toFixed(2) : 'N/A'}</td>
              {/* Add more fields as needed */}
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No data available for the selected year.</p>
      )}

      {/* Employee YTD Totals */}
      {/* Commented out employee YTD totals logic for now */}
      {/* <h2>Employee YTD Totals</h2>
      {employeeYtdTotals.length > 0 ? (
        employeeYtdTotals.map((employee, index) => (
          <div key={index}>
            <h3>{employee.first_name} {employee.last_name}</h3>
            <table className="ytd-table">
              <thead>
                <tr>
                  <th>Hours Worked</th>
                  <th>Overtime Hours Worked</th>
                  <th>Reported Tips</th>
                  <th>Loan Payment</th>
                  <th>Insurance Payment</th>
                  <th>Gross Pay</th>
                  <th>Net Pay</th>
                  <th>Withholding Tax</th>
                  <th>Social Security Tax</th>
                  <th>Medicare Tax</th>
                  <th>Retirement Payment</th>
                  <th>Roth Retirement Payment</th>
                  <th>Bonus</th>
                  <th>Total Deductions</th>
                  <th>Total Additions</th>
                  {/* Add more fields as needed */}
      {/*         </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{employee.totals.hours_worked ? Number(employee.totals.hours_worked).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.overtime_hours_worked ? Number(employee.totals.overtime_hours_worked).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.reported_tips ? Number(employee.totals.reported_tips).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.loan_payment ? Number(employee.totals.loan_payment).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.insurance_payment ? Number(employee.totals.insurance_payment).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.gross_pay ? Number(employee.totals.gross_pay).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.net_pay ? Number(employee.totals.net_pay).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.withholding_tax ? Number(employee.totals.withholding_tax).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.social_security_tax ? Number(employee.totals.social_security_tax).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.medicare_tax ? Number(employee.totals.medicare_tax).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.retirement_payment ? Number(employee.totals.retirement_payment).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.roth_retirement_payment ? Number(employee.totals.roth_retirement_payment).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.bonus ? Number(employee.totals.bonus).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.total_deductions ? Number(employee.totals.total_deductions).toFixed(2) : 'N/A'}</td>
                  <td>{employee.totals.total_additions ? Number(employee.totals.total_additions).toFixed(2) : 'N/A'}</td>
                  {/* Add more fields as needed */}
      {/*         </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No data available for the selected year.</p>
      )} */}
    </div>
  );
};

export default YearToDatePage;
