import axios from "axios";
import { useState } from "react";
import './Auth.css'; // Import CSS file

export function Signup() {
  const [errors, setErrors] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    axios
      .post("http://localhost:3000/users.json", params)
      .then((response) => {
        console.log(response.data);
        event.target.reset();
        window.location.href = "/"; // Change this to hide a modal, redirect to a specific page, etc.
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        setErrors(error.response.data.errors);
      });
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
