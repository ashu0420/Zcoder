import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import API_URL from "../config/api";
function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { setToken, setUserId, setUser } = useAuth();
    const navigate = useNavigate();
    const handleSignin = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify(
                    {
                        username,
                        password
                    }
                )
            })
            const data = await res.json();
            setMessage(data.message || "Signed In");

            if (!res.ok) {
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("username", data.user.username);
            setToken(data.token);
            setUserId(data.user.id);
            setUser(data.user.username);
            navigate("/");
        }
        catch (err) {
            setMessage("Something is wrong");
        }
        finally {

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
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={handleSignin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
            >
                Sign In
            </button>

            {message && (
                <p className="text-center text-sm text-gray-600">
                    {message}
                </p>
            )}
        </div>
      );
}
export default Signin;
