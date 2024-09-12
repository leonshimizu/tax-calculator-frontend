import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import './YearToDatePage.css';

const YearToDatePage = () => {
  const { companyId } = useParams();
  const [companyYtdTotals, setCompanyYtdTotals] = useState(null);
  const [employeeYtdTotals, setEmployeeYtdTotals] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (companyId) {
      setLoading(true);
      fetchCompanyYtdTotals();
      fetchEmployeeYtdTotals();
    }
  }, [companyId, year]);

  const fetchCompanyYtdTotals = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/company_ytd_totals?year=${year}`);
      setCompanyYtdTotals(response.data);
    } catch (err) {
      console.error('Error fetching company YTD totals:', err);
      setError('Failed to fetch company YTD totals');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeYtdTotals = async () => {
    try {
      const response = await axios.get(`/companies/${companyId}/employees/ytd_totals?year=${year}`);
      const employees = response.data;

      const sortedEmployees = employees.sort((a, b) => a.last_name.localeCompare(b.last_name));

      setEmployeeYtdTotals(sortedEmployees);
    } catch (err) {
      console.error('Error fetching employee YTD totals:', err);
      setError('Failed to fetch employee YTD totals');
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleUpdateYtdTotals = async () => {
    try {
      setUpdating(true);
      await axios.post(`/companies/${companyId}/update_ytd_totals?year=${year}`);
      fetchCompanyYtdTotals();
      fetchEmployeeYtdTotals();
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
    <div className="ytd-page-container">
      <h1 className="ytd-header">Year-to-Date Totals</h1>
      <div className="ytd-year-selector">
        <label>Select Year: </label>
        <select value={year} onChange={handleYearChange}>
          {[2022, 2023, 2024].map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      <button onClick={handleUpdateYtdTotals} disabled={updating} className="ytd-update-btn">
        {updating ? 'Updating...' : 'Update YTD Totals'}
      </button>

      <div className="ytd-section">
        <h2>Company YTD Totals</h2>
        {companyYtdTotals ? (
          <div className="table-wrapper">
            <table className="ytd-table">
              <thead>
                <tr>
                  <th>Hours Worked</th>
                  <th>Overtime Hours</th>
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
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>No data available for the selected year.</p>
        )}
      </div>

      {/* Employee YTD Totals */}
      <div className="ytd-section">
        <h2>Employee YTD Totals</h2>
        {employeeYtdTotals.length > 0 ? (
          employeeYtdTotals.map((employee, index) => (
            <div key={index} className="employee-section">
              <h3>{employee.first_name} {employee.last_name}</h3>
              <div className="table-wrapper">
                <table className="ytd-table">
                  <thead>
                    <tr>
                      <th>Hours Worked</th>
                      <th>Overtime Hours</th>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{employee.hours_worked ? Number(employee.hours_worked).toFixed(2) : 'N/A'}</td>
                      <td>{employee.overtime_hours_worked ? Number(employee.overtime_hours_worked).toFixed(2) : 'N/A'}</td>
                      <td>{employee.reported_tips ? Number(employee.reported_tips).toFixed(2) : 'N/A'}</td>
                      <td>{employee.loan_payment ? Number(employee.loan_payment).toFixed(2) : 'N/A'}</td>
                      <td>{employee.insurance_payment ? Number(employee.insurance_payment).toFixed(2) : 'N/A'}</td>
                      <td>{employee.gross_pay ? Number(employee.gross_pay).toFixed(2) : 'N/A'}</td>
                      <td>{employee.net_pay ? Number(employee.net_pay).toFixed(2) : 'N/A'}</td>
                      <td>{employee.withholding_tax ? Number(employee.withholding_tax).toFixed(2) : 'N/A'}</td>
                      <td>{employee.social_security_tax ? Number(employee.social_security_tax).toFixed(2) : 'N/A'}</td>
                      <td>{employee.medicare_tax ? Number(employee.medicare_tax).toFixed(2) : 'N/A'}</td>
                      <td>{employee.retirement_payment ? Number(employee.retirement_payment).toFixed(2) : 'N/A'}</td>
                      <td>{employee.roth_retirement_payment ? Number(employee.roth_retirement_payment).toFixed(2) : 'N/A'}</td>
                      <td>{employee.bonus ? Number(employee.bonus).toFixed(2) : 'N/A'}</td>
                      <td>{employee.total_deductions ? Number(employee.total_deductions).toFixed(2) : 'N/A'}</td>
                      <td>{employee.total_additions ? Number(employee.total_additions).toFixed(2) : 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p>No employee data available for the selected year.</p>
        )}
      </div>
    </div>
  );
};

export default YearToDatePage;
