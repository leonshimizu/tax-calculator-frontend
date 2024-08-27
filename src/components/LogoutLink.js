import axios from "axios";
import './LogoutLink.css'; // Import the CSS file

export function LogoutLink() {
  const handleClick = (event) => {
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  return (
    <a href="#" className="logout-link" onClick={handleClick}>
      Logout
    </a>
  );
}