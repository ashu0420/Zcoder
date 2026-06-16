import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { token } = useAuth();
    const linkStyle = ({ isActive }) => ({
        textDecoration: "none",
        fontWeight: isActive ? "600" : "500",
        color: isActive ? "#2563eb" : "#374151",
        fontSize: "16px"
      });

    return (
        <>
            
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    padding: "16px 32px",
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "#fff"
                }}
            >
                <NavLink to="/" style={linkStyle}>
                    Home
                </NavLink>
                <NavLink to="/problems" style={linkStyle}>
                    Problems
                </NavLink>
                <NavLink to="/contests" style={linkStyle}>
                    Contests
                </NavLink>
                {/* <NavLink to="/bookmarks" style={{ marginRight: "15px" }}>
               Bookmarks
               </NavLink>
               <NavLink to="/signup" style={{ marginRight: "15px" }}>
               Sign Up
               </NavLink> */}
                {!token ?
                    <NavLink to="/auth" style={linkStyle}>
                        Sign up/Sign in
                    </NavLink> :
                    <NavLink to="/profile" style={linkStyle}>
                        Profile
                    </NavLink>}

            </nav>
        </>
    );
}

export default Navbar;
