import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext, useNavigate } from "react-router-dom"
import API_URL from "../config/api";
function Discussion() {

    const { token } = useAuth();
    const { problem } = useOutletContext();
    const [chat, setChat] = useState("");
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`${API_URL}/api/problems/${problem._id}/discussion`)
            .then(res => res.json())
            .then(setPosts);
    }, [problem._id]);
    if (!chat.trim()) return;
    const sendChat = async () => {
        if (!token) return navigate("/auth/signin");
        const res = await fetch(`${API_URL}/api/problems/${problem._id}/discussion`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                content: chat
            })
        });
        const data = await res.json();
        setPosts(prev => [data, ...prev]);
        setChat("");

    }
    return <div>
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px"
            }}
        >
            Discussion
            <textarea name="" id="" value={chat} onChange={(e) => { setChat(e.target.value) }} placeholder="Type here"></textarea>
            <button onClick={sendChat}>{token ? "Send" : "Login"}</button>
        </div>

        <div>
            {
                posts.map((p) => {
                    return <div
                        key={p._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "12px",
                            marginBottom: "12px"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "8px"
                            }}
                        >
                            <strong>{p.user.username}</strong>
                            <small>{new Date(p.createdAt).toLocaleDateString()}</small>
                        </div>
                        <p> {p.content}</p>
                    </div>
                })
            }
        </div>
    </div>
}
export default Discussion;