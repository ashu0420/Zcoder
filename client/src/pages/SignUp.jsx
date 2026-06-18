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
    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={handleSignUp}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium"
            >
                Create Account
            </button>

            {message && (
                <p className="text-center text-sm text-gray-600">
                    {message}
                </p>
            )}
        </div>
      );
}
export default Signup;
