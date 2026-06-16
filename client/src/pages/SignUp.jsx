import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const  navigate = useNavigate();
    const handleSignUp = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })
            const data = await res.json();
            setMessage(data.message || "Registered");
            if (!res.ok)
            {
                return;
            }
            setTimeout(() => {
                navigate("/auth/signin")
            }, 1000);
        }
        catch (err) {
            setMessage("Something is wrong");
        }
    }
    return <div>

        <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <br />
        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <br />
        <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <br />
        <button onClick={handleSignUp}>Sign Up</button>
        {message && <p>{message}</p>}
    </div>;
}
export default Signup;
