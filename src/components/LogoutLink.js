// src/components/LogoutLink.js
import axios from "axios";
import './LogoutLink.css';

export function LogoutLink() {
  const handleClick = (event) => {
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  return (
    <button onClick={handleClick} className="logout-link">
      Logout
    </button>
  );
}
