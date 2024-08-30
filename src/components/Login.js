// src/components/Login.js
import axios from "../api/axios";  // Use the custom axios instance
import { useState } from "react";
import './Auth.css'; // Import CSS file

export function Login() {
  const [errors, setErrors] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    axios
      .post("/sessions", params)  // This will now use the baseURL from the custom axios instance
      .then((response) => {
        console.log(response.data);
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
        localStorage.setItem("jwt", response.data.jwt);
        event.target.reset();
        window.location.href = "/"; // Change this to hide a modal, redirect to a specific page, etc.
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setErrors(["Your account is pending approval. Please contact the administrator."]);
        } else {
          setErrors(["Invalid email or password"]);
        }
      });
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>
      <ul className="auth-errors">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>Email:</label>
          <input name="email" type="email" />
        </div>
        <div className="auth-field">
          <label>Password:</label>
          <input name="password" type="password" />
        </div>
        <button className="auth-button" type="submit">Login</button>
      </form>
    </div>
  );
}
