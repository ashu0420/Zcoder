import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "blue" : "black",
    fontWeight: isActive ? "bold" : "normal",
    marginRight: "10px",
    textDecoration: "none",
  });
  const { token } = useAuth();


  return (
    <div>{!token ? <>
      <NavLink to="/auth/signup" style={linkStyle}>
        Sign Up
      </NavLink>
      |
      <NavLink to="/auth/signin" style={linkStyle}>
        Sign In
      </NavLink>

      {/* <hr /> */}
      <Outlet />
    </> :
      <NavLink to="/auth/profile" style={linkStyle}>
        Profile
      </NavLink>}
    </div>
  );
}

export default AuthPage;
