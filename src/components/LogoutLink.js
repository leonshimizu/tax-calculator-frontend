import axios from "axios";
import './LogoutLink.css';

export function LogoutLink() {
  const handleClick = (event) => {
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  return (
    <button onClick={handleClick} className="logout-button">
      Logout
    </button>
  );
}