// src/components/Signup.js
import axios from "../api/axios"; // Import the custom axios instance
import { useState } from "react";
import './Auth.css'; // Import CSS file

export function Signup() {
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]); // Reset errors before making a new request

    const params = new FormData(event.target);

    try {
      const response = await axios.post("/users", params); // Use the custom axios instance and relative URL

      // Ensure response and response.data exist before accessing them
      if (response && response.data) {
        console.log(response.data);
        event.target.reset();
        window.location.href = "/"; // Redirect to home or another page as needed
      } else {
        // Handle case where response does not have expected data
        setErrors(["Unexpected response format from the server"]);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // If there's an error response from the server, log it
      if (error.response && error.response.data && error.response.data.errors) {
        console.log(error.response.data.errors);
        setErrors(error.response.data.errors); // Display server-side validation errors
      } else {
        // Handle network or other errors
        setErrors(["Failed to sign up. Please try again."]);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Signup</h1>
      <ul className="auth-errors">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>Name:</label>
          <input name="name" type="text" />
        </div>
        <div className="auth-field">
          <label>Email:</label>
          <input name="email" type="email" />
        </div>
        <div className="auth-field">
          <label>Password:</label>
          <input name="password" type="password" />
        </div>
        <div className="auth-field">
          <label>Password confirmation:</label>
          <input name="password_confirmation" type="password" />
        </div>
        <button className="auth-button" type="submit">Signup</button>
      </form>
    </div>
  );
}
